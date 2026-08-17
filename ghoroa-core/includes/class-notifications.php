<?php
/**
 * Order notifications for GHOROA.
 *
 * Routes all customer-facing emails through this class.
 * Phase 2: swap the transport method here to add SMS/push — class interface stays the same.
 *
 * Emails customised with Ghoroa brand voice:
 * "Your rider's on the way — should be with you in about 20 minutes."
 * NOT: "Order #4471 status: OUT FOR DELIVERY."
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Notifications {

	public static function init(): void {
		// Register custom WooCommerce email classes
		add_filter( 'woocommerce_email_classes', [ __CLASS__, 'register_emails' ] );

		// Trigger emails on GHOROA status transitions
		add_action( 'woocommerce_order_status_ghoroa-confirmed',        [ __CLASS__, 'trigger_confirmed' ], 10, 2 );
		add_action( 'woocommerce_order_status_ghoroa-out-for-delivery', [ __CLASS__, 'trigger_out_for_delivery' ], 10, 2 );
		add_action( 'woocommerce_order_status_ghoroa-delivered',        [ __CLASS__, 'trigger_delivered' ], 10, 2 );

		// Override WooCommerce email template directory to include ours
		add_filter( 'woocommerce_locate_template', [ __CLASS__, 'override_template_path' ], 10, 3 );
		add_filter( 'woocommerce_locate_core_template', [ __CLASS__, 'override_template_path' ], 10, 3 );
	}

	// ─── Register email classes ───────────────────────────────────────────────

	public static function register_emails( array $emails ): array {
		require_once GHOROA_DIR . 'includes/emails/class-email-order-confirmed.php';
		require_once GHOROA_DIR . 'includes/emails/class-email-out-for-delivery.php';

		$emails['Ghoroa_Email_Order_Confirmed']       = new \Ghoroa\Core\Emails\Email_Order_Confirmed();
		$emails['Ghoroa_Email_Out_For_Delivery']      = new \Ghoroa\Core\Emails\Email_Out_For_Delivery();

		return $emails;
	}

	// ─── Trigger hooks ───────────────────────────────────────────────────────

	public static function trigger_confirmed( int $order_id, \WC_Order $order ): void {
		self::send_email( 'Ghoroa_Email_Order_Confirmed', $order_id );
	}

	public static function trigger_out_for_delivery( int $order_id, \WC_Order $order ): void {
		self::send_email( 'Ghoroa_Email_Out_For_Delivery', $order_id );
	}

	public static function trigger_delivered( int $order_id, \WC_Order $order ): void {
		// Use WooCommerce's built-in completed email, just with our voice template
		do_action( 'woocommerce_order_status_completed_notification', $order_id, $order );
	}

	// ─── Template override ───────────────────────────────────────────────────

	public static function override_template_path( string $template, string $template_name, string $template_path ): string {
		$ghoroa_template = GHOROA_DIR . 'templates/' . $template_name;
		if ( file_exists( $ghoroa_template ) ) {
			return $ghoroa_template;
		}
		return $template;
	}

	// ─── Transport ───────────────────────────────────────────────────────────

	/**
	 * Send a registered WC email by its class key.
	 * Phase 2: this method is where SMS/push transport would be added.
	 */
	private static function send_email( string $email_class_key, int $order_id ): void {
		$mailer = WC()->mailer();
		$emails = $mailer->get_emails();

		if ( isset( $emails[ $email_class_key ] ) ) {
			$emails[ $email_class_key ]->trigger( $order_id );
		}
	}

	/**
	 * Send a raw branded email. Used for custom notification hooks.
	 */
	public static function send_raw( string $to, string $subject, string $body, string $headers = '' ): bool {
		$mailer  = WC()->mailer();
		$heading = 'Ghoroa';

		$content = $mailer->wrap_message( $heading, $body );

		return $mailer->send( $to, $subject, $content, $headers );
	}

	/**
	 * Format a brand-voice delivery ETA message.
	 */
	public static function delivery_eta_message( int $order_id ): string {
		$order    = wc_get_order( $order_id );
		$rider_id = $order ? (int) $order->get_meta( '_ghoroa_assigned_rider_id' ) : 0;
		$name     = $order ? $order->get_billing_first_name() : '';

		if ( $rider_id ) {
			$rider = get_user_by( 'id', $rider_id );
			$rider_name = $rider ? $rider->display_name : __( 'your rider', 'ghoroa-core' );
		} else {
			$rider_name = __( 'your rider', 'ghoroa-core' );
		}

		return sprintf(
			/* translators: 1: rider name */
			__( '%1$s is on the way — should be with you in about 20 minutes.', 'ghoroa-core' ),
			$rider_name
		);
	}
}
