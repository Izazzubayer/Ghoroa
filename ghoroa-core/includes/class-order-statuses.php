<?php
/**
 * Custom WooCommerce order statuses for GHOROA.
 *
 * Registers all 10 order lifecycle statuses as real wc- statuses
 * so they appear correctly in native WooCommerce admin lists and reports.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Order_Statuses {

	/**
	 * Full status registry.
	 * key   = status slug (without wc- prefix)
	 * value = [label_en, label_bn, color]
	 */
	private static array $statuses = [
		'ghoroa-new'              => [ 'New Order',         'নতুন অর্ডার',        '#A8461E' ],
		'ghoroa-confirmed'        => [ 'Confirmed',         'নিশ্চিত',            '#D98B5F' ],
		'ghoroa-preparing'        => [ 'Preparing',         'প্রস্তুতি চলছে',     '#A9824E' ],
		'ghoroa-ready'            => [ 'Ready',             'প্রস্তুত',           '#6E7350' ],
		'ghoroa-out-for-delivery' => [ 'Out for Delivery',  'ডেলিভারিতে আছে',    '#5A4735' ],
		'ghoroa-delivered'        => [ 'Delivered',         'পৌঁছে গেছে',         '#2E2117' ],
		'ghoroa-completed'        => [ 'Completed',         'সম্পন্ন',            '#2E2117' ],
		'ghoroa-cancelled'        => [ 'Cancelled',         'বাতিল',              '#888888' ],
		'ghoroa-rejected'         => [ 'Rejected',          'প্রত্যাখ্যাত',        '#cc0000' ],
		'ghoroa-failed-delivery'  => [ 'Failed Delivery',   'ডেলিভারি ব্যর্থ',   '#cc4400' ],
	];

	public static function init(): void {
		add_action( 'init', [ __CLASS__, 'register_statuses' ] );
		add_filter( 'wc_order_statuses', [ __CLASS__, 'add_to_wc_statuses' ] );
		add_filter( 'woocommerce_order_is_paid_statuses', [ __CLASS__, 'add_paid_statuses' ] );
		add_filter( 'bulk_actions-edit-shop_order', [ __CLASS__, 'add_bulk_actions' ] );
		add_action( 'admin_head', [ __CLASS__, 'status_colors_css' ] );

		// Register column indicator colors
		add_filter( 'woocommerce_admin_order_actions', [ __CLASS__, 'add_quick_actions' ], 10, 2 );
	}

	/**
	 * Register each status as a real WP post status.
	 */
	public static function register_statuses(): void {
		foreach ( self::$statuses as $slug => $data ) {
			$label = $data[0];
			register_post_status( 'wc-' . $slug, [
				'label'                     => $label,
				'public'                    => false,
				'show_in_admin_all_list'    => true,
				'show_in_admin_status_list' => true,
				/* translators: %s: count of orders with this status */
				'label_count'               => _n_noop(
					$label . ' <span class="count">(%s)</span>',
					$label . ' <span class="count">(%s)</span>',
					'ghoroa-core'
				),
			] );
		}
	}

	/**
	 * Add statuses to WooCommerce's own status list.
	 */
	public static function add_to_wc_statuses( array $statuses ): array {
		foreach ( self::$statuses as $slug => $data ) {
			$statuses[ 'wc-' . $slug ] = __( $data[0], 'ghoroa-core' );
		}
		return $statuses;
	}

	/**
	 * Mark delivered/completed as "paid" so WC doesn't block stock reduction.
	 */
	public static function add_paid_statuses( array $statuses ): array {
		return array_merge( $statuses, [ 'ghoroa-delivered', 'ghoroa-completed' ] );
	}

	/**
	 * Add bulk status-change actions to the orders list.
	 */
	public static function add_bulk_actions( array $actions ): array {
		foreach ( self::$statuses as $slug => $data ) {
			$actions[ 'mark_' . $slug ] = sprintf(
				/* translators: %s: order status label */
				__( 'Change status to %s', 'ghoroa-core' ),
				$data[0]
			);
		}
		return $actions;
	}

	/**
	 * Inline CSS for status colour indicators in the WC order list.
	 */
	public static function status_colors_css(): void {
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->id, [ 'edit-shop_order', 'woocommerce_page_wc-orders' ], true ) ) {
			return;
		}
		echo '<style>';
		foreach ( self::$statuses as $slug => $data ) {
			$color = esc_attr( $data[2] );
			echo ".order-status.status-{$slug}{background:{$color}20;color:{$color};}";
		}
		echo '</style>';
	}

	/**
	 * Add quick action buttons to the order list row.
	 */
	public static function add_quick_actions( array $actions, \WC_Order $order ): array {
		$status = $order->get_status();

		// Progressive quick-action: only show the NEXT logical step
		$transitions = [
			'ghoroa-new'              => 'ghoroa-confirmed',
			'ghoroa-confirmed'        => 'ghoroa-preparing',
			'ghoroa-preparing'        => 'ghoroa-ready',
			'ghoroa-ready'            => 'ghoroa-out-for-delivery',
			'ghoroa-out-for-delivery' => 'ghoroa-delivered',
		];

		if ( isset( $transitions[ $status ] ) ) {
			$next        = $transitions[ $status ];
			$next_data   = self::$statuses[ $next ] ?? null;
			$next_label  = $next_data ? $next_data[0] : $next;

			$actions[ 'ghoroa_advance_' . $next ] = [
				'url'    => wp_nonce_url(
					admin_url( 'admin-ajax.php?action=ghoroa_advance_order&order_id=' . $order->get_id() . '&status=' . $next ),
					'ghoroa_advance_' . $order->get_id()
				),
				'name'   => sprintf( __( 'Mark as %s', 'ghoroa-core' ), $next_label ),
				'action' => 'ghoroa-advance',
			];
		}

		return $actions;
	}

	/**
	 * Public helper: get the human-readable label for a status slug.
	 */
	public static function get_label( string $slug ): string {
		$key = str_replace( 'wc-', '', $slug );
		return self::$statuses[ $key ][0] ?? ucwords( str_replace( [ 'wc-', '-' ], [ '', ' ' ], $slug ) );
	}

	/**
	 * Public helper: get all status slugs (with wc- prefix).
	 */
	public static function get_all_slugs(): array {
		return array_map( fn( $k ) => 'wc-' . $k, array_keys( self::$statuses ) );
	}

	/**
	 * Public helper: get the status color.
	 */
	public static function get_color( string $slug ): string {
		$key = str_replace( 'wc-', '', $slug );
		return self::$statuses[ $key ][2] ?? '#888888';
	}
}
