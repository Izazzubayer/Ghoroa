<?php
/**
 * Ghoroa — Out for Delivery Email Template (HTML)
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var string   $eta_message
 * @var WC_Email $email
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

do_action( 'woocommerce_email_header', $email_heading, $email );
?>

<div style="font-family:'Work Sans',Arial,sans-serif;color:#2E2117;padding:0 24px;">

	<!-- Arch motif + motion icon -->
	<div style="text-align:center;padding:32px 0 24px;">
		<div style="display:inline-block;width:60px;height:80px;border:2px solid #D98B5F;border-radius:30px 30px 0 0;"></div>
	</div>

	<p style="font-family:'Georgia',serif;font-style:italic;font-size:22px;color:#2E2117;margin:0 0 16px;">
		<?php esc_html_e( 'On the way to you.', 'ghoroa-core' ); ?>
	</p>

	<!-- Brand-voice ETA message -->
	<p style="font-size:17px;color:#A8461E;font-weight:600;line-height:1.6;margin:0 0 20px;background:#FBF6EE;padding:16px 20px;border-radius:6px;border-left:4px solid #A8461E;">
		🛵 <?php echo esc_html( $eta_message ?? __( "Your rider is on the way — should be with you in about 20 minutes.", 'ghoroa-core' ) ); ?>
	</p>

	<p style="font-size:15px;color:#5A4735;line-height:1.7;margin:0 0 24px;">
		<?php
		printf(
			/* translators: customer first name */
			esc_html__( 'Hi %s — your Ghoroa order is packed and your rider has just picked it up.', 'ghoroa-core' ),
			esc_html( $order->get_billing_first_name() )
		);
		?>
	</p>

	<!-- Order summary -->
	<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 24px;background:#EFE3D0;border-radius:6px;overflow:hidden;">
		<tr>
			<td style="padding:12px 16px;font-size:13px;color:#5A4735;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">
				<?php esc_html_e( 'Order', 'ghoroa-core' ); ?> #<?php echo esc_html( $order->get_id() ); ?>
			</td>
			<td style="padding:12px 16px;text-align:right;font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#A8461E;">
				৳<?php echo esc_html( number_format( (float) $order->get_total(), 0 ) ); ?>
			</td>
		</tr>
		<?php foreach ( $order->get_items() as $item ) : ?>
		<tr>
			<td colspan="2" style="padding:8px 16px;border-top:1px solid rgba(46,33,23,0.1);font-size:13.5px;color:#2E2117;">
				<?php echo esc_html( $item->get_name() ); ?> ×<?php echo esc_html( $item->get_quantity() ); ?>
			</td>
		</tr>
		<?php endforeach; ?>
	</table>

	<!-- COD reminder -->
	<p style="font-size:13.5px;color:#5A4735;background:#FBF6EE;border:1px solid rgba(46,33,23,0.1);padding:12px 16px;border-radius:6px;margin:0 0 20px;">
		<?php esc_html_e( '💵 Payment: Cash on Delivery — please have exact change ready if possible.', 'ghoroa-core' ); ?>
	</p>

	<p style="font-family:'Georgia',serif;font-style:italic;font-size:15px;color:#A8461E;margin:20px 0 0;">
		<?php esc_html_e( '— Ghoroa', 'ghoroa-core' ); ?>
	</p>

</div>

<?php do_action( 'woocommerce_email_footer', $email ); ?>
