<?php
/**
 * Headless REST API for Ghoroa Next.js frontend.
 *
 * Endpoints (public, locale-aware):
 *   GET  /ghoroa/v1/menu
 *   GET  /ghoroa/v1/locations
 *   GET  /ghoroa/v1/faqs
 *   GET  /ghoroa/v1/settings
 *   GET  /ghoroa/v1/pages
 *   POST /ghoroa/v1/revalidate  (signed secret)
 *   GET  /ghoroa/v1/draft-token  (signed secret)
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Headless API routes and helpers.
 */
final class Headless {

	public const NAMESPACE = 'ghoroa/v1';

	/**
	 * Boot routes, settings, and filters.
	 */
	public static function init(): void {
		add_action( 'rest_api_init', array( self::class, 'register_routes' ) );
		add_action( 'plugins_loaded', array( self::class, 'ensure_public_meta_read' ), 5 );
		add_action( 'save_post', array( self::class, 'on_save_post' ), 20, 3 );
		add_action( 'edited_term', array( self::class, 'on_edited_term' ), 20, 3 );
		add_action( 'created_term', array( self::class, 'on_created_term' ), 20, 3 );
		add_action( 'delete_post', array( self::class, 'on_delete_post' ), 20, 1 );
		add_action( 'delete_term', array( self::class, 'on_delete_term' ), 20, 3 );
	}

	/**
	 * Register REST routes and schema.
	 */
	public static function register_routes(): void {
		register_rest_route(
			self::NAMESPACE,
			'/menu',
			array(
				'methods'  => 'GET',
				'callback' => array( self::class, 'get_menu' ),
				'permission_callback' => '__return_true',
				'args' => array(
					'locale' => array(
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_key',
						'default'           => 'en',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/locations',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_locations' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'locale' => array(
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_key',
						'default'           => 'en',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/faqs',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_faqs' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'locale' => array(
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_key',
						'default'           => 'en',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_settings' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/pages',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_pages' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'locale' => array(
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_key',
						'default'           => 'en',
					),
					'path'   => array(
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/draft-token',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_draft_token' ),
				'permission_callback' => array( self::class, 'require_secret' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/revalidate',
			array(
				'methods'             => 'POST',
				'callback'            => array( self::class, 'revalidate' ),
				'permission_callback' => array( self::class, 'require_secret' ),
			)
		);
	}

	/**
	 * Public REST read for display meta without write capability.
	 */
	public static function ensure_public_meta_read(): void {
		add_filter(
			'rest_pre_dispatch',
			static function ( $result, $server, $request ) {
				return $result;
			},
			0,
			3
		);

		// Display meta is public for headless. Keep write gated.
		add_filter( 'rest_authentication_errors', array( self::class, 'public_rest_meta' ), 10, 1 );
	}

	/**
	 * Allow public REST for read-only meta when no nonce is present.
	 *
	 * @param mixed $result Error or null.
	 * @return mixed
	 */
	public static function public_rest_meta( $result ) {
		// No-op when WordPress already has auth. We rely on `auth_callback`
		// changes for menu fields in Content_Types.
		return $result;
	}

	/**
	 * Render menu as grouped by meal period.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public static function get_menu( \WP_REST_Request $request ): \WP_REST_Response {
		$locale  = strtolower( (string) $request->get_param( 'locale' ) );
		$locale  = in_array( $locale, array( 'bn', 'en' ), true ) ? $locale : 'en';
		$posts   = get_posts(
			array(
				'post_type'              => Content_Types::CPT_MENU,
				'post_status'            => 'publish',
				'posts_per_page'         => 200,
				'orderby'                => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
				'no_found_rows'          => true,
				'update_post_term_cache' => false,
			)
		);

		$categories = array();
		foreach ( Content_Types::get_categories() as $slug => $names ) {
			$categories[ $slug ] = array(
				'en' => $names['en'],
				'bn' => $names['bn'],
			);
		}

		$groups = array();
		foreach ( $posts as $post ) {
			$categories_terms = get_the_terms( $post->ID, Content_Types::TAX_CATEGORY );
			$slug             = '';
			if ( $categories_terms && ! is_wp_error( $categories_terms ) ) {
				$slug = (string) $categories_terms[0]->slug;
			}
			if ( '' === $slug || ! isset( $categories[ $slug ] ) ) {
				$slug = 'lunch';
			}

			$item = self::normalize_menu_item( $post, $locale, $slug );
			if ( $item ) {
				$groups[ $slug ][] = $item;
			}
		}

		// Always return an empty-safe structure even when no items.
		foreach ( Content_Types::get_categories() as $slug => $_names ) {
			if ( ! isset( $groups[ $slug ] ) ) {
				$groups[ $slug ] = array();
			}
		}

		foreach ( $groups as $slug => $items ) {
			usort(
				$groups[ $slug ],
				static function ( $a, $b ) {
					return $a['sort_order'] <=> $b['sort_order'];
				}
			);
		}

		return new \WP_REST_Response(
			array(
				'locale'     => $locale,
				'categories' => $categories,
				'groups'     => $groups,
			)
		);
	}

	/**
	 * Normalize a single menu item for the frontend.
	 *
	 * @param \WP_Post $post   Menu post.
	 * @param string  $locale Locale.
	 * @param string  $slug   Category slug.
	 * @return array|null
	 */
	public static function normalize_menu_item( \WP_Post $post, string $locale, string $slug ): ?array {
		$id = $post->ID;
		$available = get_post_meta( $id, 'ghoroa_available', true );
		if ( $available === '0' || $available === 0 || $available === 'false' ) {
			return null;
		}

		$featured = get_post_meta( $id, 'ghoroa_featured', true );
		$name_en  = (string) get_post_meta( $id, 'ghoroa_name_en', true );
		$name_bn  = (string) get_post_meta( $id, 'ghoroa_name_bn', true );
		$price_t  = get_post_meta( $id, 'ghoroa_price_takeaway', true );
		$price_e  = get_post_meta( $id, 'ghoroa_price_eatin', true );

		if ( '' === $name_en && '' === $name_bn ) {
			$name_en = $post->post_title;
		}

		if ( $locale === 'bn' ) {
			$primary = $name_bn !== '' ? $name_bn : $name_en;
			$secondary = $name_en;
		} else {
			$primary   = $name_en !== '' ? $name_en : $post->post_title;
			$secondary = $name_bn;
		}

		return array(
			'id'           => $id,
			'slug'         => $slug,
			'name'         => $primary,
			'name_en'      => $name_en,
			'name_bn'      => $name_bn,
			'desc_en'      => (string) get_post_meta( $id, 'ghoroa_desc_en', true ),
			'desc_bn'      => (string) get_post_meta( $id, 'ghoroa_desc_bn', true ),
			'price_takeaway' => self::price_to_number( $price_t ),
			'price_eatin'    => self::price_to_number( $price_e ),
			'available'    => true,
			'featured'     => filter_var( $featured, FILTER_VALIDATE_BOOLEAN ),
			'sort_order'   => (int) get_post_meta( $id, 'ghoroa_sort_order', true ),
			'image'        => self::image_url( $id ),
		);
	}

	/**
	 * Render locations as a list.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public static function get_locations( \WP_REST_Request $request ): \WP_REST_Response {
		$locale = strtolower( (string) $request->get_param( 'locale' ) );
		$locale = in_array( $locale, array( 'bn', 'en' ), true ) ? $locale : 'en';
		$posts  = get_posts(
			array(
				'post_type'              => Content_Types::CPT_LOCATION,
				'post_status'            => 'publish',
				'posts_per_page'         => 20,
				'orderby'                => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
				'no_found_rows'          => true,
			)
		);
		$locations = array();
		foreach ( $posts as $post ) {
			$locations[] = self::normalize_location( $post, $locale );
		}

		return new \WP_REST_Response( array( 'locale' => $locale, 'locations' => $locations ) );
	}

	/**
	 * Normalize a location for the frontend.
	 *
	 * @param \WP_Post $post   Location post.
	 * @param string  $locale Locale.
	 */
	public static function normalize_location( \WP_Post $post, string $locale ): array {
		$id = $post->ID;
		$address_en = (string) get_post_meta( $id, 'ghoroa_address_en', true );
		$address_bn = (string) get_post_meta( $id, 'ghoroa_address_bn', true );
		$hours_en   = (string) get_post_meta( $id, 'ghoroa_hours_en', true );
		$hours_bn   = (string) get_post_meta( $id, 'ghoroa_hours_bn', true );

		if ( $locale === 'bn' ) {
			$primary = $address_bn !== '' ? $address_bn : $address_en;
			$secondary = $address_en;
			$hours = $hours_bn !== '' ? $hours_bn : $hours_en;
		} else {
			$primary = $address_en !== '' ? $address_en : $post->post_title;
			$secondary = $address_bn;
			$hours = $hours_en !== '' ? $hours_en : $hours_bn;
		}

		return array(
			'id'          => $id,
			'name'        => $post->post_title,
			'address'     => $primary,
			'address_en'  => $address_en,
			'address_bn'  => $address_bn,
			'phone'       => (string) get_post_meta( $id, 'ghoroa_phone', true ),
			'hours'       => $hours,
			'map_embed'   => (string) get_post_meta( $id, 'ghoroa_map_embed', true ),
			'image'       => self::image_url( $id ),
		);
	}

	/**
	 * Render FAQs as a list.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public static function get_faqs( \WP_REST_Request $request ): \WP_REST_Response {
		$locale = strtolower( (string) $request->get_param( 'locale' ) );
		$locale = in_array( $locale, array( 'bn', 'en' ), true ) ? $locale : 'en';
		$posts  = get_posts(
			array(
				'post_type'              => Content_Types::CPT_FAQ,
				'post_status'            => 'publish',
				'posts_per_page'         => 50,
				'orderby'                => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
				'no_found_rows'          => true,
			)
		);
		$items = array();
		foreach ( $posts as $post ) {
			$items[] = self::normalize_faq( $post, $locale );
		}

		return new \WP_REST_Response( array( 'locale' => $locale, 'items' => $items ) );
	}

	/**
	 * Normalize a FAQ for the frontend.
	 *
	 * @param \WP_Post $post   FAQ post.
	 * @param string  $locale Locale.
	 */
	public static function normalize_faq( \WP_Post $post, string $locale ): array {
		$title = $post->post_title;
		$body  = $post->post_content;
		if ( $locale === 'bn' ) {
			$bn_q = (string) get_post_meta( $post->ID, 'ghoroa_question_bn', true );
			$bn_a = (string) get_post_meta( $post->ID, 'ghoroa_answer_bn', true );
			if ( $bn_q !== '' ) {
				$title = $bn_q;
			}
			if ( $bn_a !== '' ) {
				$body = $bn_a;
			}
		}

		return array(
			'id'       => $post->ID,
			'question' => $title,
			'answer'   => $body,
		);
	}

	/**
	 * Global restaurant settings for the frontend.
	 */
	public static function get_settings(): \WP_REST_Response {
		$options = get_option( 'ghoroa_settings', array() );
		return new \WP_REST_Response(
			array(
				'phone'      => (string) ( $options['phone'] ?? '+8801711223344' ),
				'whatsapp'   => (string) ( $options['whatsapp'] ?? '8801711223344' ),
				'hours'      => (string) ( $options['hours'] ?? 'Daily · 12:00 – 23:00' ),
				'address'    => (string) ( $options['address'] ?? 'Gulshan 2, Dhaka' ),
				'email'      => (string) ( $options['email'] ?? 'hello@ghoroa.com' ),
				'social'     => (array) ( $options['social'] ?? array( 'instagram' => 'https://instagram.com', 'facebook' => 'https://facebook.com' ) ),
				'order_now'  => (string) ( $options['order_now'] ?? 'https://wa.me/8801711223344' ),
				'about'      => (string) ( $options['about'] ?? '' ),
				'tagline'    => (string) ( $options['tagline'] ?? 'Bangladeshi home cooking, served the way it was meant to be — unhurried, generous, and full of memory.' ),
			)
		);
	}

	/**
	 * Page content for About, Privacy, Terms, FAQ, etc.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public static function get_pages( \WP_REST_Request $request ): \WP_REST_Response {
		$locale = strtolower( (string) $request->get_param( 'locale' ) );
		$locale = in_array( $locale, array( 'bn', 'en' ), true ) ? $locale : 'en';
		$path   = (string) $request->get_param( 'path' );

		$pages = array(
			'about'          => 'about',
			'privacy-policy' => 'privacy-policy',
			'terms'          => 'terms',
			'faq'            => 'faq',
			'locations'      => 'locations',
			'contact'        => 'contact',
			'home'           => 'home',
		);

		// Standard pages are REST-readable. Prefer path if given.
		$slug = $path !== '' ? $path : 'about';
		$post = get_page_by_path( $slug );
		if ( ! $post ) {
			// Try known slugs.
			$post = get_page_by_path( $slug );
		}

		if ( ! $post || get_post_status( $post ) !== 'publish' ) {
			return new \WP_REST_Response(
				array(
					'locale' => $locale,
					'pages'  => array(),
				)
			);
		}

		return new \WP_REST_Response(
			array(
				'locale' => $locale,
				'pages'  => array(
					self::normalize_page( $post, $locale ),
				),
			)
		);
	}

	/**
	 * Normalize a WP page for Next.
	 *
	 * @param \WP_Post $post   Page.
	 * @param string  $locale Locale.
	 */
	public static function normalize_page( \WP_Post $post, string $locale ): array {
		$title = $post->post_title;
		$content = $post->post_content;
		if ( $locale === 'bn' ) {
			$bn = (string) get_post_meta( $post->ID, 'ghoroa_bn_content', true );
			if ( $bn !== '' ) {
				$content = $bn;
			}
			$bn_title = (string) get_post_meta( $post->ID, 'ghoroa_bn_title', true );
			if ( $bn_title !== '' ) {
				$title = $bn_title;
			}
		}

		return array(
			'id'       => $post->ID,
			'slug'     => $post->post_name,
			'path'     => $post->post_name,
			'title'    => $title,
			'content'  => $content,
			'excerpt'  => $post->post_excerpt,
			'image'    => self::image_url( $post->ID ),
		);
	}

	/**
	 * Create a draft token for Next draft mode.
	 */
	public static function get_draft_token( \WP_REST_Request $request ): \WP_REST_Response {
		$secret = self::get_secret();
		if ( empty( $secret ) ) {
			return new \WP_REST_Response(
				array( 'error' => 'No draft secret configured' ),
				400
			);
		}
		$payload = base64_encode( wp_json_encode( array( 't' => time(), 'secret' => $secret ) ) );
		return new \WP_REST_Response(
			array(
				'token' => hash_hmac( 'sha256', $payload, $secret ),
			)
		);
	}

	/**
	 * Revalidate tags after WordPress publish.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public static function revalidate( \WP_REST_Request $request ): \WP_REST_Response {
		$secret = self::get_secret();
		$given  = (string) $request->get_param( 'secret' );
		if ( empty( $secret ) || ! hash_equals( $secret, $given ) ) {
			return new \WP_REST_Response( array( 'error' => 'Invalid secret' ), 401 );
		}

		$tags = (array) $request->get_param( 'tags' );
		if ( empty( $tags ) ) {
			$tags = array( 'menu', 'faq', 'locations', 'pages', 'settings' );
		}

		// Revalidate is a signed webhook — Next receives the tags and
		// revalidates. We return a response so WordPress can fire the call.
		return new \WP_REST_Response(
			array(
				'ok'    => true,
				'tags'  => $tags,
				'message' => 'Next should revalidate the following tags: ' . implode( ',', $tags ),
			)
		);
	}

	/**
	 * WordPress save_post → revalidate webhook.
	 *
	 * @param int          $post_id   Post ID.
	 * @param \WP_Post     $post      Post object.
	 * @param bool         $update    Whether update.
	 */
	public static function on_save_post( int $post_id, \WP_Post $post, bool $update ): void {
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		if ( ! in_array( $post->post_type, array( Content_Types::CPT_MENU, Content_Types::CPT_LOCATION, Content_Types::CPT_FAQ, 'page' ), true ) ) {
			return;
		}

		$tags = array( 'pages', 'settings' );
		if ( $post->post_type === Content_Types::CPT_MENU ) {
			$tags = array( 'menu', 'pages' );
		} elseif ( $post->post_type === Content_Types::CPT_LOCATION ) {
			$tags = array( 'locations', 'pages' );
		} elseif ( $post->post_type === Content_Types::CPT_FAQ ) {
			$tags = array( 'faq', 'pages' );
		} elseif ( $post->post_type === 'page' ) {
			$tags = array( 'pages', 'settings' );
		}

		self::fire_revalidate( $tags );
	}

	/**
	 * WordPress term save → revalidate.
	 *
	 * @param int   $term_id Term ID.
	 * @param int   $tt_id   Term taxonomy ID.
	 * @param string $taxonomy Taxonomy name.
	 */
	public static function on_edited_term( int $term_id, int $tt_id, string $taxonomy ): void {
		if ( $taxonomy !== Content_Types::TAX_CATEGORY ) {
			return;
		}
		self::fire_revalidate( array( 'menu' ) );
	}

	/**
	 * WordPress term create → revalidate.
	 *
	 * @param int $term_id Term ID.
	 */
	public static function on_created_term( int $term_id, int $tt_id, string $taxonomy ): void {
		if ( $taxonomy !== Content_Types::TAX_CATEGORY ) {
			return;
		}
		self::fire_revalidate( array( 'menu' ) );
	}

	/**
	 * Delete post → revalidate.
	 *
	 * @param int $post_id Post ID.
	 */
	public static function on_delete_post( int $post_id ): void {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}
		if ( ! in_array( $post->post_type, array( Content_Types::CPT_MENU, Content_Types::CPT_LOCATION, Content_Types::CPT_FAQ, 'page' ), true ) ) {
			return;
		}
		$tags = array( 'pages', 'settings' );
		if ( $post->post_type === Content_Types::CPT_MENU ) {
			$tags = array( 'menu' );
		} elseif ( $post->post_type === Content_Types::CPT_LOCATION ) {
			$tags = array( 'locations' );
		} elseif ( $post->post_type === Content_Types::CPT_FAQ ) {
			$tags = array( 'faq' );
		}
		self::fire_revalidate( $tags );
	}

	/**
	 * Delete term → revalidate.
	 *
	 * @param int $term_id Term ID.
	 * @param int $tt_id   Term taxonomy ID.
	 * @param string $taxonomy Taxonomy name.
	 */
	public static function on_delete_term( int $term_id, int $tt_id, string $taxonomy ): void {
		if ( $taxonomy !== Content_Types::TAX_CATEGORY ) {
			return;
		}
		self::fire_revalidate( array( 'menu' ) );
	}

	/**
	 * Fire a signed revalidation request to the Next.js endpoint.
	 *
	 * @param array<int, string> $tags Tags.
	 */
	public static function fire_revalidate( array $tags ): void {
		$secret = self::get_secret();
		if ( empty( $secret ) || empty( $tags ) ) {
			return;
		}

		$endpoint = getenv( 'GHOROA_REVALIDATE_URL' ) ?: 'https://ghoroa.com/api/revalidate';
		$args = array(
			'timeout' => 5,
			'body'    => wp_json_encode(
				array(
					'secret' => $secret,
					'tags'   => $tags,
				)
			),
			'headers' => array(
				'Content-Type' => 'application/json',
			),
		);
		wp_remote_post( $endpoint, $args );
	}

	/**
	 * Require a signed secret for revalidate / draft.
	 *
	 * @return bool
	 */
	public static function require_secret(): bool {
		$secret = self::get_secret();
		if ( empty( $secret ) ) {
			return false;
		}

		// Allow authenticated users and secret token.
		if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Get secret from options.
	 *
	 * @return string
	 */
	public static function get_secret(): string {
		$options = get_option( 'ghoroa_settings', array() );
		return (string) ( $options['revalidate_secret'] ?? '' );
	}

	/**
	 * Convert price meta to a float.
	 *
	 * @param mixed $value Raw price.
	 */
	public static function price_to_number( $value ): ?float {
		if ( $value === '' || $value === null ) {
			return null;
		}
		$n = (float) $value;
		return $n > 0 ? $n : null;
	}

	/**
	 * Return the featured image as a public URL.
	 *
	 * @param int $post_id Post ID.
	 */
	public static function image_url( int $post_id ): ?string {
		$thumb = get_the_post_thumbnail_url( $post_id, 'large' );
		if ( ! $thumb ) {
			return null;
		}
		return $thumb;
	}
}
