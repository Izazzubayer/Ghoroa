<?php
/**
 * Ghoroa Admin — Customers
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$page       = max( 1, (int) ( $_GET['paged'] ?? 1 ) );
$customers  = Ghoroa\Core\Customer_Records::get_customers( $page );
?>
<div class="wrap ghoroa-wrap">

	<header class="ghoroa-header">
		<div class="ghoroa-header-inner">
			<div class="ghoroa-logo">
				<span class="ghoroa-logo-en">Ghoroa</span>
				<span class="ghoroa-logo-bn">ঘরোয়া</span>
			</div>
			<div class="ghoroa-header-meta">
				<span class="ghoroa-page-title"><?php esc_html_e( 'Customers', 'ghoroa-core' ); ?></span>
			</div>
		</div>
	</header>

	<div class="ghoroa-panel">
		<div class="ghoroa-panel-header">
			<h2><?php esc_html_e( 'Customer Records', 'ghoroa-core' ); ?></h2>
			<p class="ghoroa-panel-desc"><?php esc_html_e( 'Auto-populated from completed orders. Notes are editable inline.', 'ghoroa-core' ); ?></p>
		</div>

		<?php if ( empty( $customers ) ) : ?>
		<div class="ghoroa-empty">
			<p><?php esc_html_e( 'No customer records yet. Records are created automatically when orders are completed.', 'ghoroa-core' ); ?></p>
		</div>
		<?php else : ?>
		<div class="ghoroa-table-wrap">
		<table class="ghoroa-table ghoroa-customers-table">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Customer', 'ghoroa-core' ); ?></th>
					<th><?php esc_html_e( 'Phone', 'ghoroa-core' ); ?></th>
					<th><?php esc_html_e( 'Orders', 'ghoroa-core' ); ?></th>
					<th><?php esc_html_e( 'Avg. Frequency', 'ghoroa-core' ); ?></th>
					<th><?php esc_html_e( 'Last Order', 'ghoroa-core' ); ?></th>
					<th><?php esc_html_e( 'Notes', 'ghoroa-core' ); ?></th>
				</tr>
			</thead>
			<tbody>
			<?php foreach ( $customers as $c ) : ?>
			<tr>
				<td>
					<div class="ghoroa-customer-name"><?php echo esc_html( $c['name'] ); ?></div>
					<?php if ( $c['email'] ) : ?>
					<div class="ghoroa-customer-email"><?php echo esc_html( $c['email'] ); ?></div>
					<?php endif; ?>
					<?php if ( $c['lifetime_orders'] >= 5 ) : ?>
					<span class="ghoroa-tag ghoroa-tag-loyal"><?php esc_html_e( 'Loyal', 'ghoroa-core' ); ?></span>
					<?php endif; ?>
				</td>
				<td><?php echo esc_html( $c['phone'] ?: '—' ); ?></td>
				<td class="ghoroa-cell-center"><?php echo esc_html( $c['lifetime_orders'] ); ?></td>
				<td class="ghoroa-cell-center">
					<?php
					$freq = (float) $c['order_frequency'];
					echo $freq > 0
						? esc_html( sprintf( __( 'Every %d days', 'ghoroa-core' ), round( $freq ) ) )
						: '—';
					?>
				</td>
				<td><?php echo $c['last_order_date'] ? esc_html( $c['last_order_date'] ) : '—'; ?></td>
				<td>
					<?php if ( 'registered' === $c['type'] ) : ?>
					<div class="ghoroa-note-wrap" data-customer-id="<?php echo esc_attr( $c['id'] ); ?>">
						<textarea class="ghoroa-note-field" rows="2" placeholder="<?php esc_attr_e( 'Add a note…', 'ghoroa-core' ); ?>"><?php echo esc_textarea( $c['notes'] ); ?></textarea>
						<button class="ghoroa-btn-sm ghoroa-save-note-btn"><?php esc_html_e( 'Save', 'ghoroa-core' ); ?></button>
					</div>
					<?php else : ?>
					<span class="ghoroa-muted"><?php esc_html_e( 'Guest', 'ghoroa-core' ); ?></span>
					<?php endif; ?>
				</td>
			</tr>
			<?php endforeach; ?>
			</tbody>
		</table>
		</div>
		<?php endif; ?>
	</div>

</div>
