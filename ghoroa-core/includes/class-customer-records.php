<?php
/**
 * Customer records management for GHOROA.
 *
 * Auto-populates and updates customer meta from WooCommerce orders.
 * Provides a custom admin list table (Customers screen).
 * Saved addresses stored as a serialised array — Phase 2 UI just reads it.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Customer_Records {

	const PAGE_SLUG = 'ghoroa-customers';

	public static function init(): void {
		// Update records whenever an order status changes to completed/delivered
		add_action( 'woocommerce_order_status_changed', [ __CLASS__, 'update_customer_record' ], 10, 3 );
		// Also update on any new order creation
		add_action( 'woocommerce_new_order', [ __CLASS__, 'init_customer_record' ], 10, 2 );

		// Admin menu added by Admin_Dashboard; just register the callback
		add_action( 'admin_menu', [ __CLASS__, 'register_menu' ] );

		// AJAX: save customer notes
		add_action( 'wp_ajax_ghoroa_save_customer_note', [ __CLASS__, 'ajax_save_note' ] );
	}

	// ─── Menu ────────────────────────────────────────────────────────────────

	public static function register_menu(): void {
		add_submenu_page(
			'ghoroa-dashboard',
			__( 'Customers', 'ghoroa-core' ),
			__( 'Customers', 'ghoroa-core' ),
			'manage_woocommerce',
			self::PAGE_SLUG,
			[ __CLASS__, 'render_page' ]
		);
	}

	// ─── Record population ───────────────────────────────────────────────────

	/**
	 * Initialise empty customer record keys when a new order arrives.
	 */
	public static function init_customer_record( int $order_id, \WC_Order $order ): void {
		$customer_id = $order->get_customer_id();

		if ( $customer_id ) {
			// Registered customer
			$existing = get_user_meta( $customer_id, '_ghoroa_lifetime_orders', true );
			if ( '' === $existing ) {
				update_user_meta( $customer_id, '_ghoroa_lifetime_orders', 0 );
				update_user_meta( $customer_id, '_ghoroa_order_frequency', 0 );
				update_user_meta( $customer_id, '_ghoroa_customer_notes', '' );
				update_user_meta( $customer_id, '_ghoroa_saved_addresses', [] );
				update_user_meta( $customer_id, '_ghoroa_last_order_date', '' );
			}
		} else {
			// Guest: track by phone number
			self::ensure_guest_record( $order );
		}
	}

	/**
	 * Update customer record when an order is completed or delivered.
	 */
	public static function update_customer_record( int $order_id, string $from, string $to ): void {
		if ( ! in_array( $to, [ 'ghoroa-completed', 'ghoroa-delivered', 'completed' ], true ) ) {
			return;
		}

		$order       = wc_get_order( $order_id );
		$customer_id = $order ? $order->get_customer_id() : 0;

		if ( $customer_id ) {
			self::update_registered_customer( $customer_id, $order );
		} elseif ( $order ) {
			self::update_guest_record( $order );
		}
	}

	private static function update_registered_customer( int $customer_id, \WC_Order $order ): void {
		$lifetime = (int) get_user_meta( $customer_id, '_ghoroa_lifetime_orders', true );
		update_user_meta( $customer_id, '_ghoroa_lifetime_orders', $lifetime + 1 );

		// Compute order frequency (average days between orders)
		$last_date = get_user_meta( $customer_id, '_ghoroa_last_order_date', true );
		if ( $last_date ) {
			$days_since = (int) ( ( time() - strtotime( $last_date ) ) / DAY_IN_SECONDS );
			$current_freq = (float) get_user_meta( $customer_id, '_ghoroa_order_frequency', true );
			$orders_so_far = $lifetime ?: 1;
			// Running average
			$new_freq = round( ( ( $current_freq * ( $orders_so_far - 1 ) ) + $days_since ) / $orders_so_far, 1 );
			update_user_meta( $customer_id, '_ghoroa_order_frequency', $new_freq );
		}
		update_user_meta( $customer_id, '_ghoroa_last_order_date', current_time( 'Y-m-d' ) );

		// Store address (serialised array — Phase 2 adds multiple address UI)
		$address = $order->get_meta( '_ghoroa_delivery_address' );
		$area    = $order->get_meta( '_ghoroa_delivery_area' );
		if ( $address ) {
			$saved = get_user_meta( $customer_id, '_ghoroa_saved_addresses', true );
			if ( ! is_array( $saved ) ) {
				$saved = [];
			}
			$new_entry = [ 'address' => $address, 'area' => $area, 'saved_at' => current_time( 'Y-m-d' ) ];
			// Deduplicate by address string
			$exists = false;
			foreach ( $saved as &$s ) {
				if ( $s['address'] === $address ) {
					$s       = $new_entry;
					$exists  = true;
					break;
				}
			}
			unset( $s );
			if ( ! $exists ) {
				$saved[] = $new_entry;
			}
			update_user_meta( $customer_id, '_ghoroa_saved_addresses', $saved );
		}
	}

	private static function ensure_guest_record( \WC_Order $order ): void {
		$phone = $order->get_billing_phone();
		if ( ! $phone ) {
			return;
		}
		// Store guest record in options table keyed by phone
		$guests = get_option( 'ghoroa_guest_customers', [] );
		if ( ! isset( $guests[ $phone ] ) ) {
			$guests[ $phone ] = [
				'name'            => trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() ),
				'phone'           => $phone,
				'lifetime_orders' => 0,
				'order_frequency' => 0,
				'notes'           => '',
				'saved_addresses' => [],
				'last_order_date' => '',
			];
			update_option( 'ghoroa_guest_customers', $guests );
		}
	}

	private static function update_guest_record( \WC_Order $order ): void {
		$phone = $order->get_billing_phone();
		if ( ! $phone ) {
			return;
		}
		$guests = get_option( 'ghoroa_guest_customers', [] );
		if ( ! isset( $guests[ $phone ] ) ) {
			self::ensure_guest_record( $order );
			$guests = get_option( 'ghoroa_guest_customers', [] );
		}

		$guests[ $phone ]['lifetime_orders']++;
		$guests[ $phone ]['last_order_date'] = current_time( 'Y-m-d' );

		$address = $order->get_meta( '_ghoroa_delivery_address' );
		if ( $address ) {
			$saved = $guests[ $phone ]['saved_addresses'];
			$saved[] = [ 'address' => $address, 'area' => $order->get_meta( '_ghoroa_delivery_area' ) ];
			$guests[ $phone ]['saved_addresses'] = array_unique( $saved, SORT_REGULAR );
		}

		update_option( 'ghoroa_guest_customers', $guests );
	}

	// ─── AJAX: save note ─────────────────────────────────────────────────────

	public static function ajax_save_note(): void {
		check_ajax_referer( 'ghoroa_admin_nonce', 'nonce' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_send_json_error();
		}

		$customer_id = (int) ( $_POST['customer_id'] ?? 0 );
		$note        = sanitize_textarea_field( $_POST['note'] ?? '' );

		if ( $customer_id ) {
			update_user_meta( $customer_id, '_ghoroa_customer_notes', $note );
			wp_send_json_success();
		}

		wp_send_json_error( [ 'message' => __( 'Customer not found.', 'ghoroa-core' ) ] );
	}

	// ─── Admin page ──────────────────────────────────────────────────────────

	public static function render_page(): void {
		$view = GHOROA_DIR . 'admin/views/customers.php';
		if ( file_exists( $view ) ) {
			include $view;
		}
	}

	// ─── Data helpers ────────────────────────────────────────────────────────

	/**
	 * Get paginated customer list (registered + guests merged).
	 */
	public static function get_customers( int $page = 1, int $per_page = 30 ): array {
		$registered = get_users( [
			'role__not_in' => [ 'administrator', 'ghoroa_rider', 'shop_manager' ],
			'number'       => $per_page,
			'offset'       => ( $page - 1 ) * $per_page,
			'orderby'      => 'registered',
			'order'        => 'DESC',
			'meta_key'     => '_ghoroa_lifetime_orders',
			'meta_compare' => '>=',
			'meta_value'   => '0',
		] );

		$customers = [];
		foreach ( $registered as $user ) {
			$customers[] = [
				'type'            => 'registered',
				'id'              => $user->ID,
				'name'            => $user->display_name,
				'phone'           => get_user_meta( $user->ID, 'billing_phone', true ),
				'email'           => $user->user_email,
				'lifetime_orders' => (int) get_user_meta( $user->ID, '_ghoroa_lifetime_orders', true ),
				'order_frequency' => (float) get_user_meta( $user->ID, '_ghoroa_order_frequency', true ),
				'notes'           => get_user_meta( $user->ID, '_ghoroa_customer_notes', true ),
				'last_order_date' => get_user_meta( $user->ID, '_ghoroa_last_order_date', true ),
			];
		}

		return $customers;
	}
}
