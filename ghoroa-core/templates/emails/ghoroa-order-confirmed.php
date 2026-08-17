<?php
/**
 * Ghoroa — Order Confirmed Email Template (HTML)
 *
 * @var WC_Order $order
 * @var string   $email_heading
 * @var WC_Email $email
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

do_action( 'woocommerce_email_header', $email_heading, $email );
?>

<div style="font-family:'Work Sans',Arial,sans-serif;color:#2E2117;padding:0 24px;">

	<!-- Arch motif header accent -->
	<div style="text-align:center;padding:32px 0 24px;">
		<div style="display:inline-block;width:60px;height:80px;border:2px solid #A8461E;border-radius:30px 30px 0 0;"></div>
	</div>

	<p style="font-family:'Georgia',serif;font-style:italic;font-size:20px;color:#2E2117;margin:0 0 16px;">
		<?php esc_html_e( "We've got your order.", 'ghoroa-core' ); ?>
	</p>

	<p style="font-size:15px;color:#5A4735;line-height:1.7;margin:0 0 24px;">
		<?php
		printf(
			/* translators: customer first name */
			esc_html__( 'Hi %s — your order has been confirmed by our kitchen and we\'re getting it ready for you.', 'ghoroa-core' ),
			esc_html( $order->get_billing_first_name() )
		);
		?>
	</p>

	<!-- Order details -->
	<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 24px;background:#FBF6EE;border-radius:6px;overflow:hidden;border:1px solid rgba(46,33,23,0.1);">
		<thead>
			<tr style="background:#EFE3D0;">
				<th style="padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#5A4735;font-family:'Work Sans',Arial,sans-serif;font-weight:600;"><?php esc_html_e( 'Item', 'ghoroa-core' ); ?></th>
				<th style="padding:12px 16px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#5A4735;font-family:'Work Sans',Arial,sans-serif;font-weight:600;"><?php esc_html_e( 'Total', 'ghoroa-core' ); ?></th>
			</tr>
		</thead>
		<tbody>
		<?php foreach ( $order->get_items() as $item ) : ?>
			<tr>
				<td style="padding:12px 16px;border-bottom:1px solid rgba(46,33,23,0.08);font-size:14px;">
					<?php echo esc_html( $item->get_name() ); ?>
					<span style="color:#A8461E;margin-left:6px;">×<?php echo esc_html( $item->get_quantity() ); ?></span>
				</td>
				<td style="padding:12px 16px;border-bottom:1px solid rgba(46,33,23,0.08);text-align:right;font-size:14px;font-family:'Georgia',serif;">
					৳<?php echo esc_html( number_format( (float) $item->get_total(), 0 ) ); ?>
				</td>
			</tr>
		<?php endforeach; ?>
		</tbody>
		<tfoot>
			<tr>
				<th style="padding:12px 16px;text-align:left;font-size:14px;font-weight:600;"><?php esc_html_e( 'Total', 'ghoroa-core' ); ?></th>
				<td style="padding:12px 16px;text-align:right;font-family:'Georgia',serif;font-size:18px;font-weight:600;color:#A8461E;">
					৳<?php echo esc_html( number_format( (float) $order->get_total(), 0 ) ); ?>
				</td>
			</tr>
		</tfoot>
	</table>

	<!-- Order meta -->
	<?php $area = $order->get_meta( '_ghoroa_delivery_area' ); ?>
	<?php $instructions = $order->get_meta( '_ghoroa_special_instructions' ); ?>
	<?php $fulfillment = $order->get_meta( '_ghoroa_fulfillment_type' ); ?>

	<?php if ( $fulfillment === 'pickup' ) : ?>
	<p style="font-size:14px;color:#5A4735;background:#EFE3D0;padding:12px 16px;border-radius:6px;margin:0 0 20px;">
		<?php esc_html_e( '🏠 This is a pickup order — please collect at the restaurant.', 'ghoroa-core' ); ?>
	</p>
	<?php elseif ( $area ) : ?>
	<p style="font-size:14px;color:#5A4735;margin:0 0 12px;">
		<strong><?php esc_html_e( 'Delivering to:', 'ghoroa-core' ); ?></strong> <?php echo esc_html( $order->get_meta( '_ghoroa_delivery_address' ) . ', ' . $area ); ?>
	</p>
	<?php endif; ?>

	<?php if ( $instructions ) : ?>
	<p style="font-size:13px;color:#5A4735;font-style:italic;background:#FBF6EE;border-left:3px solid #D98B5F;padding:10px 14px;border-radius:0 4px 4px 0;margin:0 0 20px;">
		<?php esc_html_e( 'Your note:', 'ghoroa-core' ); ?> <?php echo esc_html( $instructions ); ?>
	</p>
	<?php endif; ?>

	<p style="font-size:14px;color:#5A4735;line-height:1.7;margin:0 0 8px;">
		<?php esc_html_e( "We'll let you know once your order is on its way.", 'ghoroa-core' ); ?>
	</p>

	<p style="font-family:'Georgia',serif;font-style:italic;font-size:15px;color:#A8461E;margin:20px 0 0;">
		<?php esc_html_e( '— The Ghoroa kitchen', 'ghoroa-core' ); ?>
	</p>

</div>

<?php do_action( 'woocommerce_email_footer', $email ); ?>
