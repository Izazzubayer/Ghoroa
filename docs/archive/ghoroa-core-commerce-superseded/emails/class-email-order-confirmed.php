<?php
/**
 * WooCommerce email: Order Confirmed.
 *
 * @package GhoroaCore\Emails
 */

namespace Ghoroa\Core\Emails;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Email_Order_Confirmed extends \WC_Email {

	public function __construct() {
		$this->id             = 'ghoroa_order_confirmed';
		$this->title          = __( 'Ghoroa — Order Confirmed', 'ghoroa-core' );
		$this->description    = __( 'Sent to the customer when their order is confirmed by the kitchen.', 'ghoroa-core' );
		$this->heading        = __( "We've got your order.", 'ghoroa-core' );
		$this->subject        = __( 'Your Ghoroa order is confirmed 🍽️', 'ghoroa-core' );
		$this->template_html  = 'emails/ghoroa-order-confirmed.php';
		$this->template_plain = 'emails/plain/ghoroa-order-confirmed.php';
		$this->template_base  = Ghoroa_DIR . 'templates/';
		$this->customer_email = true;

		parent::__construct();
	}

	public function trigger( int $order_id ): void {
		$this->setup_locale();

		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return;
		}

		$this->object    = $order;
		$this->recipient = $order->get_billing_email();

		if ( ! $this->recipient ) {
			$this->restore_locale();
			return;
		}

		$this->send(
			$this->get_recipient(),
			$this->get_subject(),
			$this->get_content(),
			$this->get_headers(),
			$this->get_attachments()
		);

		$this->restore_locale();
	}

	public function get_content_html(): string {
		return wc_get_template_html(
			$this->template_html,
			[
				'order'         => $this->object,
				'email_heading' => $this->get_heading(),
				'sent_to_admin' => false,
				'plain_text'    => false,
				'email'         => $this,
			],
			'',
			$this->template_base
		);
	}

	public function get_content_plain(): string {
		return wc_get_template_html(
			$this->template_plain,
			[
				'order'         => $this->object,
				'email_heading' => $this->get_heading(),
				'sent_to_admin' => false,
				'plain_text'    => true,
				'email'         => $this,
			],
			'',
			$this->template_base
		);
	}
}
