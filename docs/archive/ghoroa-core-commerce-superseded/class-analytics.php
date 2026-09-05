<?php
/**
 * Analytics for Ghoroa.
 *
 * Daily/weekly/monthly sales, AOV, popular items, cancelled rate, returning customers.
 * All computed via direct $wpdb queries against WooCommerce order tables.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Analytics {

	const PAGE_SLUG = 'ghoroa-analytics';

	public static function init(): void {
		add_action( 'admin_menu', [ __CLASS__, 'register_menu' ] );
		add_action( 'wp_ajax_ghoroa_get_analytics', [ __CLASS__, 'ajax_get_analytics' ] );
	}

	// ─── Menu ────────────────────────────────────────────────────────────────

	public static function register_menu(): void {
		add_submenu_page(
			'ghoroa-dashboard',
			__( 'Analytics', 'ghoroa-core' ),
			__( 'Analytics', 'ghoroa-core' ),
			'manage_woocommerce',
			self::PAGE_SLUG,
			[ __CLASS__, 'render_page' ]
		);
	}

	public static function render_page(): void {
		$view = Ghoroa_DIR . 'admin/views/analytics.php';
		if ( file_exists( $view ) ) {
			include $view;
		}
	}

	// ─── AJAX ────────────────────────────────────────────────────────────────

	public static function ajax_get_analytics(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error();
		}

		$period = sanitize_text_field( $_POST['period'] ?? 'week' );

		wp_send_json_success( [
			'summary'    => self::get_period_summary( $period ),
			'popular'    => self::get_popular_items_period( $period ),
			'daily'      => self::get_daily_breakdown( $period ),
			'returning'  => self::get_returning_rate(),
		] );
	}

	// ─── Data methods ─────────────────────────────────────────────────────────

	/**
	 * Returns: total_revenue, order_count, aov, cancelled_count, cancelled_rate
	 */
	public static function get_period_summary( string $period = 'week' ): array {
		[ $start, $end ] = self::period_dates( $period );

		$completed = self::query_orders_in_range(
			$start, $end,
			[ 'wc-ghoroa-completed', 'wc-ghoroa-delivered' ]
		);

		$cancelled = self::query_order_count_in_range(
			$start, $end,
			[ 'wc-ghoroa-cancelled', 'wc-ghoroa-rejected', 'wc-ghoroa-failed-delivery' ]
		);

		$total_revenue = array_sum( array_map( fn( $o ) => (float) $o->get_total(), $completed ) );
		$order_count   = count( $completed );
		$aov           = $order_count > 0 ? round( $total_revenue / $order_count, 2 ) : 0;

		$all_count = $order_count + $cancelled;
		$cancel_rate = $all_count > 0 ? round( ( $cancelled / $all_count ) * 100, 1 ) : 0;

		return [
			'total_revenue'  => $total_revenue,
			'order_count'    => $order_count,
			'aov'            => $aov,
			'cancelled'      => $cancelled,
			'cancelled_rate' => $cancel_rate,
		];
	}

	/**
	 * Most popular items in a period (by quantity sold).
	 */
	public static function get_popular_items_period( string $period = 'week', int $limit = 10 ): array {
		global $wpdb;
		[ $start, $end ] = self::period_dates( $period );

		return $wpdb->get_results( $wpdb->prepare(
			"SELECT oi.order_item_name AS name,
			        SUM( oim.meta_value ) AS qty
			   FROM {$wpdb->prefix}woocommerce_order_items AS oi
			   JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS oim
			        ON oi.order_item_id = oim.order_item_id
			        AND oim.meta_key = '_qty'
			   JOIN {$wpdb->prefix}posts AS p
			        ON oi.order_id = p.ID
			        AND p.post_type = 'shop_order'
			        AND p.post_date >= %s
			        AND p.post_date <= %s
			  WHERE oi.order_item_type = 'line_item'
			  GROUP BY oi.order_item_name
			  ORDER BY qty DESC
			  LIMIT %d",
			$start,
			$end,
			$limit
		) ) ?: [];
	}

	/**
	 * Revenue and order count broken down by day for the period.
	 */
	public static function get_daily_breakdown( string $period = 'week' ): array {
		global $wpdb;
		[ $start, $end ] = self::period_dates( $period );
		$statuses = "'" . implode( "','", [ 'wc-ghoroa-completed', 'wc-ghoroa-delivered' ] ) . "'";

		return $wpdb->get_results( $wpdb->prepare(
			"SELECT DATE(p.post_date) AS day,
			        COUNT(p.ID) AS orders,
			        SUM( CAST( pm.meta_value AS DECIMAL(10,2) ) ) AS revenue
			   FROM {$wpdb->prefix}posts AS p
			   JOIN {$wpdb->prefix}postmeta AS pm
			        ON p.ID = pm.post_id AND pm.meta_key = '_order_total'
			  WHERE p.post_type = 'shop_order'
			    AND p.post_status IN ({$statuses})
			    AND p.post_date >= %s
			    AND p.post_date <= %s
			  GROUP BY DATE(p.post_date)
			  ORDER BY day ASC",
			$start,
			$end
		) ) ?: [];
	}

	/**
	 * Percentage of customers who have placed more than 1 order.
	 */
	public static function get_returning_rate(): float {
		global $wpdb;

		$result = $wpdb->get_row(
			"SELECT
			    COUNT(DISTINCT customer_id) AS total,
			    SUM( IF(order_count > 1, 1, 0) ) AS returning_count
			FROM (
			    SELECT pm.meta_value AS customer_id, COUNT(p.ID) AS order_count
			    FROM {$wpdb->prefix}posts AS p
			    JOIN {$wpdb->prefix}postmeta AS pm
			         ON p.ID = pm.post_id AND pm.meta_key = '_customer_user'
			    WHERE p.post_type = 'shop_order'
			      AND pm.meta_value > 0
			    GROUP BY pm.meta_value
			) AS customer_orders"
		);

		if ( ! $result || 0 === (int) $result->total ) {
			return 0.0;
		}

		return round( ( (int) $result->returning_count / (int) $result->total ) * 100, 1 );
	}

	// ─── Helpers ─────────────────────────────────────────────────────────────

	private static function period_dates( string $period ): array {
		switch ( $period ) {
			case 'today':
				return [ current_time( 'Y-m-d' ) . ' 00:00:00', current_time( 'Y-m-d' ) . ' 23:59:59' ];
			case 'month':
				return [ current_time( 'Y-m-01' ) . ' 00:00:00', current_time( 'Y-m-t' ) . ' 23:59:59' ];
			case 'week':
			default:
				$start = date( 'Y-m-d', strtotime( 'monday this week', current_time( 'timestamp' ) ) );
				$end   = date( 'Y-m-d', strtotime( 'sunday this week', current_time( 'timestamp' ) ) );
				return [ $start . ' 00:00:00', $end . ' 23:59:59' ];
		}
	}

	private static function query_orders_in_range( string $start, string $end, array $statuses ): array {
		return wc_get_orders( [
			'limit'      => -1,
			'status'     => $statuses,
			'date_query' => [ [ 'after' => $start, 'before' => $end, 'inclusive' => true ] ],
		] );
	}

	private static function query_order_count_in_range( string $start, string $end, array $statuses ): int {
		return count( wc_get_orders( [
			'limit'      => -1,
			'status'     => $statuses,
			'date_query' => [ [ 'after' => $start, 'before' => $end, 'inclusive' => true ] ],
			'return'     => 'ids',
		] ) );
	}
}
