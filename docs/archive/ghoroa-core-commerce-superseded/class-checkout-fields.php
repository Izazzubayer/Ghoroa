<?php
/**
 * WooCommerce checkout field customisation for Ghoroa.
 *
 * Strips the default WooCommerce checkout down to only what Ghoroa needs:
 * name, phone, delivery address, area, fulfillment type, special instructions.
 * Payment is locked to COD in Phase 1 but stored via _ghoroa_payment_gateway
 * so Phase 2 digital payments write a different value without restructuring checkout.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Checkout_Fields {

	public static function init(): void {
		// Strip unnecessary WC billing fields
		add_filter( 'woocommerce_checkout_fields', [ __CLASS__, 'customise_fields' ] );

		// Add custom Ghoroa fields
		add_action( 'woocommerce_after_checkout_billing_form', [ __CLASS__, 'add_ghoroa_fields' ] );

		// Force COD as the only payment method in Phase 1
		add_filter( 'woocommerce_available_payment_gateways', [ __CLASS__, 'force_cod_only' ] );

		// Save custom fields to order meta
		add_action( 'woocommerce_checkout_create_order', [ __CLASS__, 'save_order_meta' ], 10, 2 );

		// Validate required custom fields
		add_action( 'woocommerce_checkout_process', [ __CLASS__, 'validate_fields' ] );

		// Show custom fields in admin order view
		add_action( 'woocommerce_admin_order_data_after_shipping_address', [ __CLASS__, 'display_order_meta_admin' ], 10, 1 );

		// Nonce endpoint for cache-safe checkout JS
		add_action( 'rest_api_init', [ __CLASS__, 'register_nonce_endpoint' ] );

		// Enqueue front-end checkout assets
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_assets' ] );
	}

	// ─── Field Customisation ─────────────────────────────────────────────────

	/**
	 * Keep only the billing fields Ghoroa actually uses.
	 * WooCommerce's default set has company, address_2, country, state etc.
	 * We strip those and drive address via our own fields.
	 */
	public static function customise_fields( array $fields ): array {
		// Billing: keep first_name, last_name, phone, address_1
		$keep_billing = [ 'billing_first_name', 'billing_last_name', 'billing_phone', 'billing_email' ];
		foreach ( array_keys( $fields['billing'] ) as $key ) {
			if ( ! in_array( $key, $keep_billing, true ) ) {
				unset( $fields['billing'][ $key ] );
			}
		}

		// Relabel fields to match Ghoroa UX
		$fields['billing']['billing_first_name']['label']       = __( 'First Name', 'ghoroa-core' );
		$fields['billing']['billing_last_name']['label']        = __( 'Last Name', 'ghoroa-core' );
		$fields['billing']['billing_phone']['label']            = __( 'Mobile Number', 'ghoroa-core' );
		$fields['billing']['billing_phone']['placeholder']      = '+880 1X XX XXX XXX';
		$fields['billing']['billing_phone']['required']         = true;
		$fields['billing']['billing_email']['required']         = false;
		$fields['billing']['billing_email']['label']            = __( 'Email (optional)', 'ghoroa-core' );

		// Remove the shipping fields section — we handle address ourselves
		$fields['shipping'] = [];

		// Remove order notes — replaced by our special instructions field
		$fields['order']['order_comments']['placeholder'] = '';
		unset( $fields['order']['order_comments'] );

		return $fields;
	}

	/**
	 * Add Ghoroa-specific checkout fields after billing.
	 */
	public static function add_ghoroa_fields( \WC_Checkout $checkout ): void {
		$zones        = get_option( 'ghoroa_delivery_zones', [] );
		$zone_options = [ '' => __( '— Select area —', 'ghoroa-core' ) ];
		foreach ( $zones as $zone ) {
			$zone_options[ sanitize_key( $zone['name'] ) ] = esc_html( $zone['name'] );
		}

		echo '<div id="ghoroa-custom-fields">';

		// Fulfillment type
		woocommerce_form_field( 'ghoroa_fulfillment_type', [
			'type'     => 'select',
			'label'    => __( 'Order Type', 'ghoroa-core' ),
			'required' => true,
			'options'  => [
				'delivery' => __( 'Delivery', 'ghoroa-core' ),
				'pickup'   => __( 'Pickup from Restaurant', 'ghoroa-core' ),
			],
			'class'    => [ 'ghoroa-fulfillment-select', 'form-row-wide' ],
			'id'       => 'ghoroa_fulfillment_type',
		], $checkout->get_value( 'ghoroa_fulfillment_type' ) ?? 'delivery' );

		// Delivery address (shown only when fulfillment = delivery)
		echo '<div id="ghoroa-delivery-address-fields">';
		woocommerce_form_field( 'ghoroa_delivery_address', [
			'type'        => 'text',
			'label'       => __( 'Delivery Address', 'ghoroa-core' ),
			'placeholder' => __( 'House / Flat no., Road, Block...', 'ghoroa-core' ),
			'required'    => false,
			'class'       => [ 'form-row-wide' ],
			'id'          => 'ghoroa_delivery_address',
		], $checkout->get_value( 'ghoroa_delivery_address' ) );

		// Area / delivery zone
		woocommerce_form_field( 'ghoroa_delivery_area', [
			'type'     => 'select',
			'label'    => __( 'Area', 'ghoroa-core' ),
			'required' => false,
			'options'  => $zone_options,
			'class'    => [ 'form-row-wide' ],
			'id'       => 'ghoroa_delivery_area',
		], $checkout->get_value( 'ghoroa_delivery_area' ) );

		echo '</div>'; // #ghoroa-delivery-address-fields

		// Special instructions
		woocommerce_form_field( 'ghoroa_special_instructions', [
			'type'        => 'textarea',
			'label'       => __( 'Special Instructions', 'ghoroa-core' ),
			'placeholder' => __( 'Allergies, spice level, knock instead of ring...', 'ghoroa-core' ),
			'required'    => false,
			'class'       => [ 'form-row-wide' ],
			'id'          => 'ghoroa_special_instructions',
		], $checkout->get_value( 'ghoroa_special_instructions' ) );

		echo '</div>'; // #ghoroa-custom-fields
	}

	// ─── Payment Gateway Restriction ─────────────────────────────────────────

	/**
	 * Phase 1: restrict to Cash on Delivery only.
	 * Phase 2: remove this filter, let _ghoroa_payment_gateway carry the real value.
	 */
	public static function force_cod_only( array $gateways ): array {
		if ( is_checkout() ) {
			$cod = $gateways['cod'] ?? null;
			$gateways = [];
			if ( $cod ) {
				$gateways['cod'] = $cod;
			}
		}
		return $gateways;
	}

	// ─── Order Meta Saving ───────────────────────────────────────────────────

	/**
	 * Save all Ghoroa custom fields as proper order meta.
	 */
	public static function save_order_meta( \WC_Order $order, array $data ): void {
		$fulfillment = sanitize_text_field( $_POST['ghoroa_fulfillment_type'] ?? 'delivery' );
		$area        = sanitize_text_field( $_POST['ghoroa_delivery_area'] ?? '' );
		$address     = sanitize_textarea_field( $_POST['ghoroa_delivery_address'] ?? '' );
		$instructions= sanitize_textarea_field( $_POST['ghoroa_special_instructions'] ?? '' );

		// Look up the delivery fee for the selected zone
		$delivery_fee = 0;
		if ( 'delivery' === $fulfillment && $area ) {
			$zones = get_option( 'ghoroa_delivery_zones', [] );
			foreach ( $zones as $zone ) {
				if ( sanitize_key( $zone['name'] ) === $area ) {
					$delivery_fee = (float) $zone['fee'];
					break;
				}
			}
		}

		// Phase-1-active fields
		$order->update_meta_data( '_ghoroa_fulfillment_type',     $fulfillment );
		$order->update_meta_data( '_ghoroa_delivery_area',        $area );
		$order->update_meta_data( '_ghoroa_delivery_address',     $address );
		$order->update_meta_data( '_ghoroa_delivery_fee',         $delivery_fee );
		$order->update_meta_data( '_ghoroa_special_instructions', $instructions );
		$order->update_meta_data( '_ghoroa_payment_gateway',      'cod' ); // Phase 2: change value here

		// Phase-2/3 placeholder fields — stored now so no migration later
		$order->update_meta_data( '_ghoroa_assigned_rider_id',    '' );    // Phase 3 GPS dispatch
		$order->update_meta_data( '_ghoroa_rider_gps_ping',       '' );    // Phase 3 live tracking
		$order->update_meta_data( '_ghoroa_loyalty_points_earned', 0 );    // Phase 2 loyalty

		// Apply delivery fee as a fee line item
		if ( $delivery_fee > 0 && 'delivery' === $fulfillment ) {
			$fee = new \WC_Order_Item_Fee();
			$fee->set_name( __( 'Delivery Fee', 'ghoroa-core' ) );
			$fee->set_amount( $delivery_fee );
			$fee->set_total( $delivery_fee );
			$fee->set_tax_status( 'none' );
			$order->add_item( $fee );
		}
	}

	// ─── Validation ──────────────────────────────────────────────────────────

	public static function validate_fields(): void {
		$fulfillment = sanitize_text_field( $_POST['ghoroa_fulfillment_type'] ?? '' );

		if ( 'delivery' === $fulfillment ) {
			if ( empty( $_POST['ghoroa_delivery_address'] ) ) {
				wc_add_notice( __( 'Please enter your delivery address.', 'ghoroa-core' ), 'error' );
			}
			if ( empty( $_POST['ghoroa_delivery_area'] ) ) {
				wc_add_notice( __( 'Please select your delivery area.', 'ghoroa-core' ), 'error' );
			}
		}

		if ( empty( $_POST['billing_phone'] ) ) {
			wc_add_notice( __( 'Please enter your mobile number.', 'ghoroa-core' ), 'error' );
		}
	}

	// ─── Admin Display ───────────────────────────────────────────────────────

	public static function display_order_meta_admin( \WC_Order $order ): void {
		$fields = [
			'_ghoroa_fulfillment_type'     => __( 'Order Type', 'ghoroa-core' ),
			'_ghoroa_delivery_area'        => __( 'Delivery Area', 'ghoroa-core' ),
			'_ghoroa_delivery_address'     => __( 'Delivery Address', 'ghoroa-core' ),
			'_ghoroa_delivery_fee'         => __( 'Delivery Fee (BDT)', 'ghoroa-core' ),
			'_ghoroa_special_instructions' => __( 'Special Instructions', 'ghoroa-core' ),
			'_ghoroa_payment_gateway'      => __( 'Payment Method', 'ghoroa-core' ),
		];

		echo '<div class="ghoroa-order-meta" style="margin-top:16px;">';
		echo '<h4 style="margin-bottom:8px;font-family:sans-serif;">' . esc_html__( 'Ghoroa Order Details', 'ghoroa-core' ) . '</h4>';
		echo '<table cellpadding="4" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:13px;">';
		foreach ( $fields as $meta_key => $label ) {
			$value = $order->get_meta( $meta_key );
			if ( '' === $value || null === $value ) {
				continue;
			}
			echo '<tr>';
			echo '<td style="font-weight:600;color:#5A4735;padding-right:12px;">' . esc_html( $label ) . '</td>';
			echo '<td>' . esc_html( $value ) . '</td>';
			echo '</tr>';
		}
		echo '</table></div>';
	}

	// ─── REST nonce endpoint (cache-safe) ────────────────────────────────────

	public static function register_nonce_endpoint(): void {
		register_rest_route( 'ghoroa/v1', '/nonce', [
			'methods'             => 'GET',
			'callback'            => fn() => rest_ensure_response( [
				'nonce' => wp_create_nonce( 'wc_store_api' ),
			] ),
			'permission_callback' => '__return_true',
		] );
	}

	// ─── Assets ──────────────────────────────────────────────────────────────

	public static function enqueue_assets(): void {
		if ( ! is_checkout() ) {
			return;
		}
		wp_enqueue_style(
			'ghoroa-checkout',
			Ghoroa_URL . 'assets/css/checkout.css',
			[],
			Ghoroa_VERSION
		);
		wp_enqueue_script(
			'ghoroa-checkout',
			Ghoroa_URL . 'assets/js/checkout.js',
			[ 'jquery', 'wc-checkout' ],
			Ghoroa_VERSION,
			true
		);
		wp_localize_script( 'ghoroa-checkout', 'ghoroaCheckout', [
			'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
			'restUrl'  => rest_url( 'ghoroa/v1' ),
			'currency' => get_woocommerce_currency_symbol(),
			'i18n'     => [
				'selectArea'    => __( '— Select area —', 'ghoroa-core' ),
				'deliveryFee'   => __( 'Delivery Fee', 'ghoroa-core' ),
				'free'          => __( 'Free', 'ghoroa-core' ),
			],
		] );
	}
}
