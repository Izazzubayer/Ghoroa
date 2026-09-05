<?php
/**
 * Menu item availability toggle for Ghoroa.
 *
 * Adds an "Available Today" toggle to WooCommerce products.
 * Unavailable items are hidden from the shop without being deleted.
 * Adds a bulk action in wp-admin products list.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Menu_Availability {

	const META_KEY = '_ghoroa_available';

	public static function init(): void {
		// Add field to product data panel
		add_action( 'woocommerce_product_options_general_product_data', [ __CLASS__, 'add_availability_field' ] );
		add_action( 'woocommerce_process_product_meta', [ __CLASS__, 'save_availability_field' ] );

		// Hide unavailable products from shop/archives
		add_action( 'woocommerce_product_query', [ __CLASS__, 'filter_unavailable_from_shop' ] );
		add_filter( 'woocommerce_is_purchasable', [ __CLASS__, 'block_purchase_if_unavailable' ], 10, 2 );

		// Bulk actions in product list
		add_filter( 'bulk_actions-edit-product', [ __CLASS__, 'add_bulk_actions' ] );
		add_filter( 'handle_bulk_actions-edit-product', [ __CLASS__, 'handle_bulk_actions' ], 10, 3 );
		add_action( 'admin_notices', [ __CLASS__, 'bulk_action_notice' ] );

		// Add column to product list
		add_filter( 'manage_product_posts_columns', [ __CLASS__, 'add_column' ] );
		add_action( 'manage_product_posts_custom_column', [ __CLASS__, 'render_column' ], 10, 2 );

		// AJAX quick-toggle from dashboard
		add_action( 'wp_ajax_ghoroa_toggle_availability', [ __CLASS__, 'ajax_toggle' ] );
	}

	// ─── Product field ───────────────────────────────────────────────────────

	public static function add_availability_field(): void {
		global $post;
		$available = get_post_meta( $post->ID, self::META_KEY, true );
		$available = ( '' === $available ) ? 'yes' : $available; // Default: available
		?>
		<div class="options_group ghoroa-availability">
			<p class="form-field">
				<label for="<?php echo esc_attr( self::META_KEY ); ?>">
					<?php esc_html_e( 'Available Today', 'ghoroa-core' ); ?>
				</label>
				<input type="checkbox"
					   id="<?php echo esc_attr( self::META_KEY ); ?>"
					   name="<?php echo esc_attr( self::META_KEY ); ?>"
					   value="yes"
					   <?php checked( 'yes', $available ); ?>
				/>
				<span class="description">
					<?php esc_html_e( 'Uncheck to hide this item from the menu without deleting it.', 'ghoroa-core' ); ?>
				</span>
			</p>
		</div>
		<?php
	}

	public static function save_availability_field( int $post_id ): void {
		$available = isset( $_POST[ self::META_KEY ] ) ? 'yes' : 'no';
		update_post_meta( $post_id, self::META_KEY, $available );
	}

	// ─── Shop filter ─────────────────────────────────────────────────────────

	public static function filter_unavailable_from_shop( \WP_Query $q ): void {
		if ( is_admin() ) {
			return;
		}
		$meta_query   = $q->get( 'meta_query' ) ?: [];
		$meta_query[] = [
			'relation' => 'OR',
			[
				'key'     => self::META_KEY,
				'value'   => 'yes',
				'compare' => '=',
			],
			[
				'key'     => self::META_KEY,
				'compare' => 'NOT EXISTS',
			],
		];
		$q->set( 'meta_query', $meta_query );
	}

	public static function block_purchase_if_unavailable( bool $purchasable, \WC_Product $product ): bool {
		$available = get_post_meta( $product->get_id(), self::META_KEY, true );
		if ( 'no' === $available ) {
			return false;
		}
		return $purchasable;
	}

	// ─── Bulk actions ────────────────────────────────────────────────────────

	public static function add_bulk_actions( array $actions ): array {
		$actions['ghoroa_mark_available']   = __( 'Mark as Available (Ghoroa)', 'ghoroa-core' );
		$actions['ghoroa_mark_unavailable'] = __( 'Mark as Unavailable (Ghoroa)', 'ghoroa-core' );
		return $actions;
	}

	public static function handle_bulk_actions( string $redirect, string $action, array $ids ): string {
		if ( ! in_array( $action, [ 'ghoroa_mark_available', 'ghoroa_mark_unavailable' ], true ) ) {
			return $redirect;
		}

		$value = ( 'ghoroa_mark_available' === $action ) ? 'yes' : 'no';
		foreach ( $ids as $id ) {
			update_post_meta( (int) $id, self::META_KEY, $value );
		}

		return add_query_arg( [
			'ghoroa_bulk_done' => count( $ids ),
			'ghoroa_bulk_act'  => $action,
		], $redirect );
	}

	public static function bulk_action_notice(): void {
		if ( empty( $_GET['ghoroa_bulk_done'] ) ) {
			return;
		}
		$count  = (int) $_GET['ghoroa_bulk_done'];
		$action = sanitize_text_field( $_GET['ghoroa_bulk_act'] ?? '' );
		$label  = 'ghoroa_mark_available' === $action ? __( 'available', 'ghoroa-core' ) : __( 'unavailable', 'ghoroa-core' );
		printf(
			'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
			sprintf(
				/* translators: 1: count, 2: status label */
				esc_html__( '%1$d item(s) marked as %2$s.', 'ghoroa-core' ),
				$count,
				esc_html( $label )
			)
		);
	}

	// ─── Product list column ─────────────────────────────────────────────────

	public static function add_column( array $columns ): array {
		$columns['ghoroa_available'] = __( 'Available', 'ghoroa-core' );
		return $columns;
	}

	public static function render_column( string $column, int $post_id ): void {
		if ( 'ghoroa_available' !== $column ) {
			return;
		}
		$available = get_post_meta( $post_id, self::META_KEY, true );
		$is_avail  = '' === $available || 'yes' === $available;
		echo $is_avail
			? '<span style="color:#6E7350;font-weight:600;">✓ ' . esc_html__( 'Yes', 'ghoroa-core' ) . '</span>'
			: '<span style="color:#A8461E;font-weight:600;">✗ ' . esc_html__( 'No', 'ghoroa-core' ) . '</span>';
	}

	// ─── AJAX quick-toggle ───────────────────────────────────────────────────

	public static function ajax_toggle(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'edit_products' ) ) {
			wp_send_json_error();
		}

		$product_id = (int) ( $_POST['product_id'] ?? 0 );
		$current    = get_post_meta( $product_id, self::META_KEY, true );
		$new_value  = ( 'no' === $current ) ? 'yes' : 'no';
		update_post_meta( $product_id, self::META_KEY, $new_value );

		wp_send_json_success( [ 'available' => $new_value ] );
	}

	/**
	 * Public helper: is a product available?
	 */
	public static function is_available( int $product_id ): bool {
		$val = get_post_meta( $product_id, self::META_KEY, true );
		return '' === $val || 'yes' === $val;
	}
}
