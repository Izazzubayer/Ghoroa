<?php
/**
 * Admin dashboard for GHOROA.
 *
 * Registers the top-level "Ghoroa" admin menu with sub-pages.
 * Today's Orders view with status transition buttons.
 * Dashboard KPI cards: revenue, pending counts, popular items.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Admin_Dashboard {

	const PAGE_SLUG = 'ghoroa-dashboard';

	public static function init(): void {
		add_action( 'admin_menu', [ __CLASS__, 'register_menus' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_assets' ] );

		// AJAX: status transition from dashboard
		add_action( 'wp_ajax_ghoroa_change_status', [ __CLASS__, 'ajax_change_status' ] );
		// AJAX: get today's orders data (for auto-refresh)
		add_action( 'wp_ajax_ghoroa_get_orders', [ __CLASS__, 'ajax_get_orders' ] );
	}

	// ─── Menus ───────────────────────────────────────────────────────────────

	public static function register_menus(): void {
		// Top-level Ghoroa menu
		add_menu_page(
			__( 'Ghoroa', 'ghoroa-core' ),
			__( 'Ghoroa', 'ghoroa-core' ),
			'manage_woocommerce',
			self::PAGE_SLUG,
			[ __CLASS__, 'render_dashboard' ],
			self::get_menu_icon(),
			55
		);

		// Today's Orders (same as parent, but explicit sub-menu label)
		add_submenu_page(
			self::PAGE_SLUG,
			__( "Today's Orders", 'ghoroa-core' ),
			__( "Today's Orders", 'ghoroa-core' ),
			'manage_woocommerce',
			self::PAGE_SLUG,
			[ __CLASS__, 'render_dashboard' ]
		);

		// Analytics sub-page registered by Analytics class
		// Delivery Zones sub-page registered by Delivery_Zones class
		// Customers sub-page registered by Customer_Records class
	}

	private static function get_menu_icon(): string {
		// SVG of a simplified arch — the Ghoroa brand motif
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
			<path d="M3 18V10a7 7 0 0 1 14 0v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
		</svg>';
		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	// ─── Assets ──────────────────────────────────────────────────────────────

	public static function enqueue_assets( string $hook ): void {
		$ghoroa_pages = [
			'toplevel_page_ghoroa-dashboard',
			'ghoroa_page_ghoroa-zones',
			'ghoroa_page_ghoroa-customers',
			'ghoroa_page_ghoroa-analytics',
		];

		if ( ! in_array( $hook, $ghoroa_pages, true ) ) {
			return;
		}

		wp_enqueue_style(
			'ghoroa-admin',
			GHOROA_URL . 'assets/css/admin.css',
			[],
			GHOROA_VERSION
		);

		wp_enqueue_script(
			'ghoroa-admin',
			GHOROA_URL . 'assets/js/admin.js',
			[ 'jquery' ],
			GHOROA_VERSION,
			true
		);

		wp_localize_script( 'ghoroa-admin', 'ghoroaAdmin', [
			'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
			'nonce'     => wp_create_nonce( 'ghoroa_admin_nonce' ),
			'restUrl'   => rest_url( 'ghoroa/v1' ),
			'statuses'  => Order_Statuses::get_all_slugs(),
			'i18n'      => [
				'confirmStatus' => __( 'Change order status?', 'ghoroa-core' ),
				'saving'        => __( 'Saving…', 'ghoroa-core' ),
				'saved'         => __( 'Saved', 'ghoroa-core' ),
				'error'         => __( 'Error. Please try again.', 'ghoroa-core' ),
			],
		] );

		// Google Fonts — brand typography
		wp_enqueue_style(
			'ghoroa-fonts',
			'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Work+Sans:wght@300;400;500;600&family=Hind+Siliguri:wght@400;500;600&display=swap',
			[],
			null
		);
	}

	// ─── Render ──────────────────────────────────────────────────────────────

	public static function render_dashboard(): void {
		$view = GHOROA_DIR . 'admin/views/dashboard.php';
		if ( file_exists( $view ) ) {
			include $view;
		}
	}

	// ─── AJAX ────────────────────────────────────────────────────────────────

	public static function ajax_change_status(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Permission denied.', 'ghoroa-core' ) ] );
		}

		$order_id = (int) ( $_POST['order_id'] ?? 0 );
		$status   = sanitize_text_field( $_POST['status'] ?? '' );
		$order    = wc_get_order( $order_id );

		if ( ! $order ) {
			wp_send_json_error( [ 'message' => __( 'Order not found.', 'ghoroa-core' ) ] );
		}

		// Strip wc- prefix if provided
		$status = str_replace( 'wc-', '', $status );
		$order->update_status( $status, __( 'Status updated via Ghoroa dashboard.', 'ghoroa-core' ) );

		wp_send_json_success( [
			'order_id'   => $order_id,
			'new_status' => $status,
			'label'      => Order_Statuses::get_label( $status ),
		] );
	}

	public static function ajax_get_orders(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error();
		}

		$orders = self::get_todays_orders();
		$data   = [];

		foreach ( $orders as $order ) {
			$rider_id = (int) $order->get_meta( '_ghoroa_assigned_rider_id' );
			$data[]   = [
				'id'           => $order->get_id(),
				'status'       => $order->get_status(),
				'status_label' => Order_Statuses::get_label( $order->get_status() ),
				'status_color' => Order_Statuses::get_color( $order->get_status() ),
				'customer'     => trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() ),
				'phone'        => $order->get_billing_phone(),
				'area'         => $order->get_meta( '_ghoroa_delivery_area' ),
				'fulfillment'  => $order->get_meta( '_ghoroa_fulfillment_type' ),
				'total'        => wc_price( $order->get_total() ),
				'rider'        => $rider_id ? Rider_Assignment::get_rider_name( $rider_id ) : '',
				'time'         => $order->get_date_created()->date( 'H:i' ),
				'items'        => self::format_order_items( $order ),
			];
		}

		wp_send_json_success( $data );
	}

	// ─── Data helpers ────────────────────────────────────────────────────────

	/**
	 * Get all orders placed today (midnight to now).
	 */
	public static function get_todays_orders( string $status = '' ): array {
		$args = [
			'limit'      => -1,
			'orderby'    => 'date',
			'order'      => 'DESC',
			'date_query' => [
				[
					'after'     => 'today midnight',
					'inclusive' => true,
				],
			],
		];

		if ( $status ) {
			$args['status'] = $status;
		} else {
			// All active GHOROA statuses (exclude terminal)
			$args['status'] = [
				'wc-ghoroa-new', 'wc-ghoroa-confirmed', 'wc-ghoroa-preparing',
				'wc-ghoroa-ready', 'wc-ghoroa-out-for-delivery', 'wc-ghoroa-delivered',
				'wc-ghoroa-completed', 'wc-ghoroa-cancelled', 'wc-ghoroa-rejected',
				'wc-ghoroa-failed-delivery',
			];
		}

		return wc_get_orders( $args );
	}

	/**
	 * Get today's revenue from completed/delivered orders.
	 */
	public static function get_todays_revenue(): float {
		$orders = wc_get_orders( [
			'limit'      => -1,
			'status'     => [ 'wc-ghoroa-delivered', 'wc-ghoroa-completed' ],
			'date_query' => [ [ 'after' => 'today midnight', 'inclusive' => true ] ],
		] );

		return array_sum( array_map( fn( $o ) => (float) $o->get_total(), $orders ) );
	}

	/**
	 * Get counts by status for dashboard KPI cards.
	 */
	public static function get_status_counts(): array {
		$all    = self::get_todays_orders();
		$counts = [
			'pending'    => 0, // new + confirmed + preparing + ready
			'delivering' => 0,
			'completed'  => 0,
			'cancelled'  => 0,
		];

		foreach ( $all as $order ) {
			$s = $order->get_status();
			if ( in_array( $s, [ 'ghoroa-new', 'ghoroa-confirmed', 'ghoroa-preparing', 'ghoroa-ready' ], true ) ) {
				$counts['pending']++;
			} elseif ( 'ghoroa-out-for-delivery' === $s ) {
				$counts['delivering']++;
			} elseif ( in_array( $s, [ 'ghoroa-delivered', 'ghoroa-completed' ], true ) ) {
				$counts['completed']++;
			} elseif ( in_array( $s, [ 'ghoroa-cancelled', 'ghoroa-rejected', 'ghoroa-failed-delivery' ], true ) ) {
				$counts['cancelled']++;
			}
		}

		return $counts;
	}

	/**
	 * Get top N most-ordered items today.
	 */
	public static function get_popular_items( int $limit = 5 ): array {
		global $wpdb;

		$today = current_time( 'Y-m-d' );

		$rows = $wpdb->get_results( $wpdb->prepare(
			"SELECT oi.order_item_name AS name,
			        SUM( oim.meta_value ) AS qty
			   FROM {$wpdb->prefix}woocommerce_order_items AS oi
			   JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
			        ON oi.order_item_id = oim.order_item_id
			        AND oim.meta_key = '_qty'
			   JOIN {$wpdb->prefix}posts AS p
			        ON oi.order_id = p.ID
			        AND p.post_type = 'shop_order'
			        AND DATE(p.post_date) = %s
			  WHERE oi.order_item_type = 'line_item'
			  GROUP BY oi.order_item_name
			  ORDER BY qty DESC
			  LIMIT %d",
			$today,
			$limit
		) );

		return $rows ?: [];
	}

	private static function format_order_items( \WC_Order $order ): string {
		$items = [];
		foreach ( $order->get_items() as $item ) {
			$items[] = $item->get_name() . ' ×' . $item->get_quantity();
		}
		return implode( ', ', $items );
	}
}
