<?php
/**
 * Server-rendered menu list block.
 *
 * Core blocks cannot lay out "name … dotted leader … price" from post meta, so this
 * is the one custom block in Phase 1. Everything it renders comes from the menu CPT,
 * which keeps prices editable in the dashboard rather than baked into templates.
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders a meal period, or a set of featured dishes, from the menu CPT.
 */
final class Menu_List_Block {

	private const NAME = 'ghoroa/menu-list';

	/**
	 * Register the block and its editor script.
	 */
	public static function init(): void {
		add_action( 'init', array( self::class, 'register' ) );
	}

	/**
	 * Register the block type.
	 *
	 * The editor script is plain browser JS against the `wp.*` globals — there is no
	 * build step to keep in sync, which matters for a site handed to a small team.
	 */
	public static function register(): void {
		wp_register_script(
			'ghoroa-menu-list-editor',
			GHOROA_CORE_URL . 'blocks/menu-list/editor.js',
			array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-server-side-render', 'wp-i18n' ),
			GHOROA_CORE_VERSION,
			true
		);

		register_block_type(
			self::NAME,
			array(
				'api_version'     => 3,
				'title'           => __( 'Ghoroa menu list', 'ghoroa-core' ),
				'category'        => 'widgets',
				'icon'            => 'food',
				'description'     => __( 'Lists dishes from a meal period, with bilingual names and prices.', 'ghoroa-core' ),
				'editor_script'   => 'ghoroa-menu-list-editor',
				'attributes'      => array(
					'category'     => array( 'type' => 'string', 'default' => '' ),
					'featuredOnly' => array( 'type' => 'boolean', 'default' => false ),
					'limit'        => array( 'type' => 'number', 'default' => 100 ),
					'showHeading'  => array( 'type' => 'boolean', 'default' => true ),
				),
				'supports'        => array( 'html' => false, 'align' => array( 'wide' ) ),
				'render_callback' => array( self::class, 'render' ),
			)
		);
	}

	/**
	 * Render the block.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @return string Escaped HTML.
	 */
	public static function render( array $attributes ): string {
		$category      = isset( $attributes['category'] ) ? sanitize_key( (string) $attributes['category'] ) : '';
		$featured_only = ! empty( $attributes['featuredOnly'] );
		$show_heading  = ! isset( $attributes['showHeading'] ) || (bool) $attributes['showHeading'];
		$limit         = isset( $attributes['limit'] ) ? (int) $attributes['limit'] : 100;
		$limit         = max( 1, min( 200, $limit ) );

		$query_args = array(
			'post_type'              => Content_Types::CPT_MENU,
			'post_status'            => 'publish',
			'posts_per_page'         => $limit,
			'orderby'                => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
			'no_found_rows'          => true,
			'update_post_term_cache' => false,
		);

		if ( '' !== $category ) {
			$query_args['tax_query'] = array(
				array(
					'taxonomy' => Content_Types::TAX_CATEGORY,
					'field'    => 'slug',
					'terms'    => $category,
				),
			);
		}

		if ( $featured_only ) {
			$query_args['meta_query'] = array(
				array(
					'key'     => 'ghoroa_featured',
					'value'   => '1',
					'compare' => '=',
				),
			);
		}

		$posts = get_posts( $query_args );

		if ( empty( $posts ) ) {
			return self::empty_notice( $category );
		}

		$is_bn = self::is_bengali();
		$rows  = '';

		foreach ( $posts as $post ) {
			$rows .= self::render_row( $post, $is_bn );
		}

		$heading = $show_heading && '' !== $category ? self::render_heading( $category, $is_bn ) : '';

		return sprintf(
			'<section %1$s>%2$s<ul class="ghoroa-menu-list__items">%3$s</ul></section>',
			get_block_wrapper_attributes( array( 'class' => 'ghoroa-menu-list' ) ),
			$heading,
			$rows
		);
	}

	/**
	 * One dish: name, optional description, dotted leader, prices.
	 *
	 * @param \WP_Post $post  Menu item.
	 * @param bool     $is_bn Whether the current request is Bangla.
	 */
	private static function render_row( \WP_Post $post, bool $is_bn ): string {
		$id = $post->ID;

		$name_en = (string) get_post_meta( $id, 'ghoroa_name_en', true );
		$name_bn = (string) get_post_meta( $id, 'ghoroa_name_bn', true );

		// Fall back to the post title so a half-filled entry still renders something.
		$primary   = $is_bn && '' !== $name_bn ? $name_bn : ( '' !== $name_en ? $name_en : $post->post_title );
		$secondary = $is_bn ? $name_en : $name_bn;

		$desc = (string) get_post_meta( $id, $is_bn ? 'ghoroa_desc_bn' : 'ghoroa_desc_en', true );

		$takeaway  = get_post_meta( $id, 'ghoroa_price_takeaway', true );
		$eatin     = get_post_meta( $id, 'ghoroa_price_eatin', true );
		$available = get_post_meta( $id, 'ghoroa_available', true );
		$sold_out  = '' !== $available && ! $available;

		$name_html = '<span class="ghoroa-menu-row__name">' . esc_html( $primary );

		if ( '' !== $secondary && $secondary !== $primary ) {
			$lang       = $is_bn ? 'en' : 'bn';
			$name_html .= sprintf(
				' <span class="ghoroa-menu-row__alt" lang="%1$s">%2$s</span>',
				esc_attr( $lang ),
				esc_html( $secondary )
			);
		}

		if ( $sold_out ) {
			$name_html .= ' <span class="ghoroa-tag">' . esc_html__( 'Sold out', 'ghoroa-core' ) . '</span>';
		}

		$name_html .= '</span>';

		return sprintf(
			'<li class="ghoroa-menu-item">
				<div class="ghoroa-menu-row">%1$s<span class="ghoroa-menu-row__leader" aria-hidden="true"></span>%2$s</div>
				%3$s
			</li>',
			$name_html,
			self::render_prices( $takeaway, $eatin ),
			'' !== $desc ? '<p class="ghoroa-menu-item__desc">' . esc_html( $desc ) . '</p>' : ''
		);
	}

	/**
	 * Price cell. Screen readers get the words, sighted users get the columns.
	 *
	 * @param mixed $takeaway Takeaway price.
	 * @param mixed $eatin    Eat-in price.
	 */
	private static function render_prices( mixed $takeaway, mixed $eatin ): string {
		$parts = array();

		if ( is_numeric( $takeaway ) && (float) $takeaway > 0 ) {
			$parts[] = sprintf(
				'<span class="ghoroa-price"><span class="screen-reader-text">%1$s </span>%2$s</span>',
				esc_html__( 'Takeaway', 'ghoroa-core' ),
				esc_html( self::format_price( $takeaway ) )
			);
		}

		if ( is_numeric( $eatin ) && (float) $eatin > 0 && (float) $eatin !== (float) $takeaway ) {
			$parts[] = sprintf(
				'<span class="ghoroa-price"><span class="screen-reader-text">%1$s </span>%2$s</span>',
				esc_html__( 'Eat in', 'ghoroa-core' ),
				esc_html( self::format_price( $eatin ) )
			);
		}

		if ( empty( $parts ) ) {
			return '';
		}

		return '<span class="ghoroa-menu-row__prices">' . implode( ' / ', $parts ) . '</span>';
	}

	/**
	 * Whole taka, no decimals.
	 *
	 * @param mixed $value Numeric price.
	 */
	private static function format_price( mixed $value ): string {
		return number_format_i18n( (float) $value, 0 );
	}

	/**
	 * Section heading using the term's English or Bangla name.
	 *
	 * @param string $category Term slug.
	 * @param bool   $is_bn    Whether the current request is Bangla.
	 */
	private static function render_heading( string $category, bool $is_bn ): string {
		$term = get_term_by( 'slug', $category, Content_Types::TAX_CATEGORY );

		if ( ! $term instanceof \WP_Term ) {
			return '';
		}

		$name = $term->name;

		if ( $is_bn ) {
			$bn = (string) get_term_meta( $term->term_id, 'ghoroa_name_bn', true );

			if ( '' !== $bn ) {
				$name = $bn;
			}
		}

		return '<h2 class="ghoroa-menu-list__heading">' . esc_html( $name ) . '</h2>';
	}

	/**
	 * Editors need to know why a section is blank; visitors should see nothing.
	 *
	 * @param string $category Term slug.
	 */
	private static function empty_notice( string $category ): string {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return '';
		}

		return sprintf(
			'<p class="ghoroa-menu-list__empty">%s</p>',
			esc_html(
				'' === $category
					? __( 'No featured dishes yet. Tick "Featured" on a menu item to show it here.', 'ghoroa-core' )
					: sprintf(
						/* translators: %s: meal period slug, e.g. breakfast. */
						__( 'No published menu items in "%s" yet.', 'ghoroa-core' ),
						$category
					)
			)
		);
	}

	/**
	 * Whether the current request should render Bangla.
	 *
	 * Works with Polylang/WPML (they filter the locale) and with a plain bn_BD site.
	 */
	private static function is_bengali(): bool {
		return str_starts_with( determine_locale(), 'bn' );
	}
}
