<?php
/**
 * Content types for the Ghoroa presence module.
 *
 * Field names mirror the Rosuii menu shape so Phase 2 can import from here
 * without a migration. See Ghoroa_DEVELOPMENT_SEQUENCE.md → "Menu CPT fields".
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers menu items, locations and FAQ entries plus their bilingual meta.
 */
final class Content_Types {

	public const CPT_MENU     = 'ghoroa_menu_item';
	public const CPT_LOCATION = 'ghoroa_location';
	public const CPT_FAQ      = 'ghoroa_faq';
	public const TAX_CATEGORY = 'ghoroa_menu_category';

	/**
	 * Meal periods seeded on activation, in menu order.
	 *
	 * @var array<string, array{en: string, bn: string}>
	 */
	private const CATEGORIES = array(
		'breakfast' => array( 'en' => 'Breakfast', 'bn' => 'সকালের নাস্তা' ),
		'lunch'     => array( 'en' => 'Lunch', 'bn' => 'দুপুরের খাবার' ),
		'dinner'    => array( 'en' => 'Dinner', 'bn' => 'বিকাল ও রাতের খাবার' ),
		'juice'     => array( 'en' => 'Juice bar', 'bn' => 'জুস বার' ),
		'snacks'    => array( 'en' => 'Snacks', 'bn' => 'নাস্তা' ),
	);

	/**
	 * Hook everything up.
	 */
	public static function init(): void {
		add_action( 'init', array( self::class, 'register_post_types' ) );
		add_action( 'init', array( self::class, 'register_taxonomy' ) );
		add_action( 'init', array( self::class, 'register_meta' ) );
	}

	/**
	 * Menu item, location and FAQ post types.
	 *
	 * All three are `show_in_rest` so they are editable in the block editor and
	 * readable by Phase 2 tooling over the REST API.
	 */
	public static function register_post_types(): void {
		register_post_type(
			self::CPT_MENU,
			array(
				'labels'        => self::labels( __( 'Menu item', 'ghoroa-core' ), __( 'Menu items', 'ghoroa-core' ) ),
				'public'        => true,
				'has_archive'   => false,
				'show_in_rest'  => true,
				'menu_icon'     => 'dashicons-food',
				'menu_position' => 20,
				'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
				'rewrite'       => array( 'slug' => 'menu-item' ),
			)
		);

		register_post_type(
			self::CPT_LOCATION,
			array(
				'labels'        => self::labels( __( 'Location', 'ghoroa-core' ), __( 'Locations', 'ghoroa-core' ) ),
				'public'        => true,
				'has_archive'   => false,
				'show_in_rest'  => true,
				'menu_icon'     => 'dashicons-location',
				'menu_position' => 21,
				'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
				'rewrite'       => array( 'slug' => 'branch' ),
			)
		);

		register_post_type(
			self::CPT_FAQ,
			array(
				'labels'        => self::labels( __( 'FAQ', 'ghoroa-core' ), __( 'FAQs', 'ghoroa-core' ) ),
				'public'        => true,
				'has_archive'   => false,
				'show_in_rest'  => true,
				'menu_icon'     => 'dashicons-editor-help',
				'menu_position' => 22,
				'supports'      => array( 'title', 'editor', 'page-attributes' ),
				'rewrite'       => array( 'slug' => 'faq-entry' ),
			)
		);
	}

	/**
	 * Meal-period taxonomy shared by the menu list block.
	 */
	public static function register_taxonomy(): void {
		register_taxonomy(
			self::TAX_CATEGORY,
			self::CPT_MENU,
			array(
				'labels'            => self::labels( __( 'Meal period', 'ghoroa-core' ), __( 'Meal periods', 'ghoroa-core' ) ),
				'public'            => true,
				'hierarchical'      => true,
				'show_in_rest'      => true,
				'show_admin_column' => true,
				'rewrite'           => array( 'slug' => 'menu-category' ),
			)
		);
	}

	/**
	 * Bilingual and pricing meta.
	 *
	 * Registered with `show_in_rest` so the block editor sidebar, the REST API and
	 * any Phase 2 importer all see the same fields.
	 */
	public static function register_meta(): void {
		$text     = array( 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' );
		$textarea = array( 'type' => 'string', 'sanitize_callback' => 'wp_kses_post' );
		$number   = array( 'type' => 'number', 'sanitize_callback' => array( self::class, 'sanitize_price' ) );
		$boolean  = array( 'type' => 'boolean', 'sanitize_callback' => 'rest_sanitize_boolean' );

		$menu_fields = array(
			'name_en'        => $text,
			'name_bn'        => $text,
			'desc_en'        => $textarea,
			'desc_bn'        => $textarea,
			'price_takeaway' => $number,
			'price_eatin'    => $number,
			'available'      => $boolean,
			'featured'       => $boolean,
		);

		foreach ( $menu_fields as $key => $args ) {
			self::register_post_meta( self::CPT_MENU, $key, $args );
		}

		$location_fields = array(
			'address_en' => $textarea,
			'address_bn' => $textarea,
			'phone'      => $text,
			'hours_en'   => $textarea,
			'hours_bn'   => $textarea,
			'map_embed'  => array( 'type' => 'string', 'sanitize_callback' => 'esc_url_raw' ),
		);

		foreach ( $location_fields as $key => $args ) {
			self::register_post_meta( self::CPT_LOCATION, $key, $args );
		}

		foreach ( array( 'question_bn' => $text, 'answer_bn' => $textarea ) as $key => $args ) {
			self::register_post_meta( self::CPT_FAQ, $key, $args );
		}
	}

	/**
	 * Register one meta key with a consistent prefix and edit capability check.
	 *
	 * @param string               $post_type Post type the meta belongs to.
	 * @param string               $key       Unprefixed meta key.
	 * @param array<string, mixed> $args      Type and sanitize callback.
	 */
	private static function register_post_meta( string $post_type, string $key, array $args ): void {
		register_post_meta(
			$post_type,
			'ghoroa_' . $key,
			array(
				'type'              => $args['type'],
				'single'            => true,
				'show_in_rest'      => true,
				'sanitize_callback' => $args['sanitize_callback'],
				'auth_callback'     => static fn (): bool => current_user_can( 'edit_posts' ),
			)
		);
	}

	/**
	 * Prices are whole taka; reject anything negative or non-numeric.
	 *
	 * @param mixed $value Raw submitted value.
	 */
	public static function sanitize_price( mixed $value ): float {
		return is_numeric( $value ) ? max( 0.0, (float) $value ) : 0.0;
	}

	/**
	 * Create the meal periods on activation, storing the Bangla name as term meta.
	 */
	public static function seed_menu_categories(): void {
		$order = 0;

		foreach ( self::CATEGORIES as $slug => $names ) {
			++$order;
			$term = get_term_by( 'slug', $slug, self::TAX_CATEGORY );

			if ( ! $term ) {
				$inserted = wp_insert_term( $names['en'], self::TAX_CATEGORY, array( 'slug' => $slug ) );

				if ( is_wp_error( $inserted ) ) {
					continue;
				}

				$term_id = (int) $inserted['term_id'];
			} else {
				$term_id = (int) $term->term_id;
			}

			update_term_meta( $term_id, 'ghoroa_name_bn', $names['bn'] );
			update_term_meta( $term_id, 'ghoroa_sort_order', $order );
		}
	}

	/**
	 * Public list of meal periods for REST normalization.
	 *
	 * @return array<string, array{en: string, bn: string}>
	 */
	public static function get_categories(): array {
		return self::CATEGORIES;
	}

	/**
	 * Build a standard label set from a singular and plural name.
	 *
	 * @param string $singular Singular label.
	 * @param string $plural   Plural label.
	 * @return array<string, string>
	 */
	private static function labels( string $singular, string $plural ): array {
		return array(
			'name'          => $plural,
			'singular_name' => $singular,
			/* translators: %s: singular content type name. */
			'add_new_item'  => sprintf( __( 'Add %s', 'ghoroa-core' ), $singular ),
			/* translators: %s: singular content type name. */
			'edit_item'     => sprintf( __( 'Edit %s', 'ghoroa-core' ), $singular ),
			/* translators: %s: plural content type name. */
			'search_items'  => sprintf( __( 'Search %s', 'ghoroa-core' ), $plural ),
			'menu_name'     => $plural,
		);
	}
}
