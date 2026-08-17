<?php
/**
 * Bilingual support for GHOROA (Bangla/English).
 *
 * Adds _ghoroa_name_bn and _ghoroa_description_bn meta fields to WooCommerce products.
 * Front-end output filter swaps in Bangla when locale is bn_BD.
 * A simple JS toggle on the front end lets users switch without a page reload.
 * No WPML/Polylang dependency.
 *
 * Rule (per brand guidelines): Never pair Fraunces Italic with Hind Siliguri Bold in the
 * same line — Bangla is always upright; italic is an English-only accent.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Bilingual {

	const META_NAME_BN = '_ghoroa_name_bn';
	const META_DESC_BN = '_ghoroa_description_bn';

	public static function init(): void {
		// Add Bangla fields to WC product edit screen
		add_action( 'woocommerce_product_options_general_product_data', [ __CLASS__, 'add_product_fields' ] );
		add_action( 'woocommerce_process_product_meta', [ __CLASS__, 'save_product_fields' ] );

		// Filter product name/description on front end when locale is bn_BD
		add_filter( 'woocommerce_product_get_name',             [ __CLASS__, 'maybe_translate_name' ], 10, 2 );
		add_filter( 'woocommerce_product_get_description',      [ __CLASS__, 'maybe_translate_description' ], 10, 2 );
		add_filter( 'woocommerce_product_get_short_description',[ __CLASS__, 'maybe_translate_description' ], 10, 2 );

		// Language switcher cookie handler
		add_action( 'init', [ __CLASS__, 'handle_language_switch' ] );

		// Enqueue switcher UI
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_switcher' ] );

		// REST endpoint: get Bangla strings for a product
		add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
	}

	// ─── Product admin fields ────────────────────────────────────────────────

	public static function add_product_fields(): void {
		global $post;
		?>
		<div class="options_group ghoroa-bilingual" style="border-top:1px solid #eee;padding-top:12px;">
			<p style="padding:0 12px;font-weight:600;color:#5A4735;font-size:13px;">
				<?php esc_html_e( 'Ghoroa — Bangla Translation', 'ghoroa-core' ); ?>
			</p>
			<?php
			woocommerce_wp_text_input( [
				'id'          => self::META_NAME_BN,
				'label'       => __( 'Name (Bangla)', 'ghoroa-core' ) . ' — বাংলা',
				'description' => __( 'Bangla name displayed when the user switches to বাংলা.', 'ghoroa-core' ),
				'desc_tip'    => true,
				'value'       => get_post_meta( $post->ID, self::META_NAME_BN, true ),
			] );

			woocommerce_wp_textarea_input( [
				'id'          => self::META_DESC_BN,
				'label'       => __( 'Description (Bangla)', 'ghoroa-core' ) . ' — বাংলা',
				'description' => __( 'Bangla description for this menu item.', 'ghoroa-core' ),
				'desc_tip'    => true,
				'value'       => get_post_meta( $post->ID, self::META_DESC_BN, true ),
				'rows'        => 4,
			] );
			?>
		</div>
		<?php
	}

	public static function save_product_fields( int $post_id ): void {
		$name_bn = sanitize_text_field( $_POST[ self::META_NAME_BN ] ?? '' );
		$desc_bn = sanitize_textarea_field( $_POST[ self::META_DESC_BN ] ?? '' );
		update_post_meta( $post_id, self::META_NAME_BN, $name_bn );
		update_post_meta( $post_id, self::META_DESC_BN, $desc_bn );
	}

	// ─── Front-end translation filters ──────────────────────────────────────

	public static function maybe_translate_name( string $name, \WC_Product $product ): string {
		if ( self::is_bangla_active() ) {
			$bn = get_post_meta( $product->get_id(), self::META_NAME_BN, true );
			return $bn ?: $name;
		}
		return $name;
	}

	public static function maybe_translate_description( string $desc, \WC_Product $product ): string {
		if ( self::is_bangla_active() ) {
			$bn = get_post_meta( $product->get_id(), self::META_DESC_BN, true );
			return $bn ?: $desc;
		}
		return $desc;
	}

	// ─── Language switch handler ─────────────────────────────────────────────

	public static function handle_language_switch(): void {
		if ( isset( $_GET['ghoroa_lang'] ) ) {
			$lang = in_array( $_GET['ghoroa_lang'], [ 'en', 'bn' ], true ) ? $_GET['ghoroa_lang'] : 'en';
			setcookie( 'ghoroa_lang', $lang, time() + ( 30 * DAY_IN_SECONDS ), COOKIEPATH, COOKIE_DOMAIN );
			$_COOKIE['ghoroa_lang'] = $lang;
		}
	}

	public static function is_bangla_active(): bool {
		return ( $_COOKIE['ghoroa_lang'] ?? 'en' ) === 'bn';
	}

	// ─── Language switcher widget ────────────────────────────────────────────

	public static function enqueue_switcher(): void {
		wp_add_inline_style( 'woocommerce-general', '
			.ghoroa-lang-switcher {
				display: inline-flex;
				gap: 6px;
				align-items: center;
				font-family: "Work Sans", sans-serif;
				font-size: 13px;
			}
			.ghoroa-lang-switcher a {
				padding: 4px 10px;
				border-radius: 4px;
				text-decoration: none;
				color: #2E2117;
				border: 1px solid rgba(46,33,23,0.2);
				transition: background 0.2s, color 0.2s;
			}
			.ghoroa-lang-switcher a.active,
			.ghoroa-lang-switcher a:hover {
				background: #A8461E;
				color: #FBF6EE;
				border-color: #A8461E;
			}
		' );
	}

	/**
	 * Output the language switcher HTML (call from templates/shortcode).
	 */
	public static function render_switcher(): string {
		$current  = self::is_bangla_active() ? 'bn' : 'en';
		$base_url = remove_query_arg( 'ghoroa_lang' );
		$en_url   = add_query_arg( 'ghoroa_lang', 'en', $base_url );
		$bn_url   = add_query_arg( 'ghoroa_lang', 'bn', $base_url );
		ob_start();
		?>
		<div class="ghoroa-lang-switcher" role="navigation" aria-label="<?php esc_attr_e( 'Language switcher', 'ghoroa-core' ); ?>">
			<a href="<?php echo esc_url( $en_url ); ?>" <?php echo 'en' === $current ? 'class="active" aria-current="true"' : ''; ?>>English</a>
			<a href="<?php echo esc_url( $bn_url ); ?>" <?php echo 'bn' === $current ? 'class="active" aria-current="true"' : ''; ?> lang="bn">বাংলা</a>
		</div>
		<?php
		return ob_get_clean();
	}

	// ─── REST endpoint ───────────────────────────────────────────────────────

	public static function register_rest_routes(): void {
		register_rest_route( 'ghoroa/v1', '/product/(?P<id>\d+)/bangla', [
			'methods'             => 'GET',
			'callback'            => [ __CLASS__, 'rest_get_bangla' ],
			'permission_callback' => '__return_true',
			'args'                => [
				'id' => [ 'validate_callback' => fn( $p ) => is_numeric( $p ) ],
			],
		] );
	}

	public static function rest_get_bangla( \WP_REST_Request $request ): \WP_REST_Response {
		$id = (int) $request->get_param( 'id' );
		return rest_ensure_response( [
			'name_bn' => get_post_meta( $id, self::META_NAME_BN, true ),
			'desc_bn' => get_post_meta( $id, self::META_DESC_BN, true ),
		] );
	}
}
