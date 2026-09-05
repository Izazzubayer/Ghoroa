<?php
/**
 * Rider assignment for Ghoroa orders.
 *
 * Riders are WordPress users with the custom `ghoroa_rider` role.
 * A meta box on the order edit screen provides a dropdown to assign a rider.
 * Stores the assignment in _ghoroa_assigned_rider_id as a proper WP user ID
 * so Phase 3's rider dashboard reads the same field without data migration.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Rider_Assignment {

	public static function init(): void {
		add_action( 'add_meta_boxes',            [ __CLASS__, 'add_meta_box' ] );
		add_action( 'woocommerce_process_shop_order_meta', [ __CLASS__, 'save_meta_box' ], 10, 2 );

		// AJAX handler for dashboard quick-assign
		add_action( 'wp_ajax_ghoroa_assign_rider', [ __CLASS__, 'ajax_assign_rider' ] );

		// AJAX: advance order status
		add_action( 'wp_ajax_ghoroa_advance_order', [ __CLASS__, 'ajax_advance_order' ] );
	}

	// ─── Meta box registration ────────────────────────────────────────────────

	public static function add_meta_box(): void {
		$screens = [ 'shop_order', 'woocommerce_page_wc-orders' ];
		foreach ( $screens as $screen ) {
			add_meta_box(
				'ghoroa-rider-assignment',
				__( '🛵 Assign Rider', 'ghoroa-core' ),
				[ __CLASS__, 'render_meta_box' ],
				$screen,
				'side',
				'high'
			);
		}
	}

	public static function render_meta_box( \WP_Post|\WC_Order $post_or_order ): void {
		$order    = $post_or_order instanceof \WC_Order
			? $post_or_order
			: wc_get_order( $post_or_order->ID );

		if ( ! $order ) {
			return;
		}

		$riders          = self::get_all_riders();
		$assigned_id     = (int) $order->get_meta( '_ghoroa_assigned_rider_id' );

		wp_nonce_field( 'ghoroa_rider_nonce', 'ghoroa_rider_nonce' );
		?>
		<div class="ghoroa-rider-box">
			<?php if ( empty( $riders ) ) : ?>
				<p style="color:#888;font-size:13px;">
					<?php esc_html_e( 'No riders registered yet. Add a user with the "Ghoroa Rider" role.', 'ghoroa-core' ); ?>
				</p>
			<?php else : ?>
				<select name="ghoroa_assigned_rider_id" id="ghoroa_assigned_rider_id" style="width:100%;">
					<option value=""><?php esc_html_e( '— Unassigned —', 'ghoroa-core' ); ?></option>
					<?php foreach ( $riders as $rider ) : ?>
						<option value="<?php echo esc_attr( $rider->ID ); ?>"
							<?php selected( $assigned_id, $rider->ID ); ?>>
							<?php echo esc_html( $rider->display_name ); ?>
						</option>
					<?php endforeach; ?>
				</select>
				<p class="description" style="margin-top:8px;font-size:12px;color:#5A4735;">
					<?php esc_html_e( 'Assigned rider can be viewed in customer emails and the dashboard.', 'ghoroa-core' ); ?>
				</p>
			<?php endif; ?>
		</div>
		<?php
	}

	public static function save_meta_box( int $order_id, \WP_Post $post ): void {
		if (
			! isset( $_POST['ghoroa_rider_nonce'] ) ||
			! wp_verify_nonce( $_POST['ghoroa_rider_nonce'], 'ghoroa_rider_nonce' )
		) {
			return;
		}

		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}

		$rider_id = (int) ( $_POST['ghoroa_assigned_rider_id'] ?? 0 );
		$order->update_meta_data( '_ghoroa_assigned_rider_id', $rider_id ?: '' );
		$order->save_meta_data();

		// Leave _ghoroa_rider_gps_ping empty — Phase 3 will populate it
		if ( ! $order->get_meta( '_ghoroa_rider_gps_ping' ) ) {
			$order->update_meta_data( '_ghoroa_rider_gps_ping', '' );
			$order->save_meta_data();
		}
	}

	// ─── AJAX: assign rider from dashboard ───────────────────────────────────

	public static function ajax_assign_rider(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Permission denied.', 'ghoroa-core' ) ] );
		}

		$order_id = (int) ( $_POST['order_id'] ?? 0 );
		$rider_id = (int) ( $_POST['rider_id'] ?? 0 );
		$order    = wc_get_order( $order_id );

		if ( ! $order ) {
			wp_send_json_error( [ 'message' => __( 'Order not found.', 'ghoroa-core' ) ] );
		}

		$order->update_meta_data( '_ghoroa_assigned_rider_id', $rider_id ?: '' );
		$order->save_meta_data();

		$rider_name = '';
		if ( $rider_id ) {
			$rider      = get_user_by( 'id', $rider_id );
			$rider_name = $rider ? $rider->display_name : '';
		}

		wp_send_json_success( [ 'rider_name' => $rider_name ] );
	}

	// ─── AJAX: advance order to next status ──────────────────────────────────

	public static function ajax_advance_order(): void {
		$order_id = (int) ( $_GET['order_id'] ?? 0 );
		$status   = sanitize_text_field( $_GET['status'] ?? '' );

		if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'ghoroa_advance_' . $order_id ) ) {
			wp_die( esc_html__( 'Security check failed.', 'ghoroa-core' ) );
		}

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ghoroa-core' ) );
		}

		$order = wc_get_order( $order_id );
		if ( $order && $status ) {
			$order->update_status( $status, __( 'Status updated by Ghoroa dashboard.', 'ghoroa-core' ) );
		}

		wp_safe_redirect( wp_get_referer() ?: admin_url( 'admin.php?page=ghoroa-dashboard' ) );
		exit;
	}

	// ─── Helpers ─────────────────────────────────────────────────────────────

	/**
	 * Get all WordPress users with the ghoroa_rider role.
	 */
	public static function get_all_riders(): array {
		return get_users( [ 'role' => 'ghoroa_rider', 'orderby' => 'display_name' ] );
	}

	/**
	 * Get rider display name by user ID (for templates).
	 */
	public static function get_rider_name( int $rider_id ): string {
		if ( ! $rider_id ) {
			return __( 'Unassigned', 'ghoroa-core' );
		}
		$user = get_user_by( 'id', $rider_id );
		return $user ? $user->display_name : __( 'Unknown', 'ghoroa-core' );
	}
}
