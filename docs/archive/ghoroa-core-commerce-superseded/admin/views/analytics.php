<?php
/**
 * Ghoroa Admin — Analytics
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

use Ghoroa\Core\Analytics;

$period  = sanitize_text_field( $_GET['period'] ?? 'week' );
$summary = Analytics::get_period_summary( $period );
$popular = Analytics::get_popular_items_period( $period );
$daily   = Analytics::get_daily_breakdown( $period );
$ret     = Analytics::get_returning_rate();

$periods = [
	'today' => __( 'Today', 'ghoroa-core' ),
	'week'  => __( 'This Week', 'ghoroa-core' ),
	'month' => __( 'This Month', 'ghoroa-core' ),
];
?>
<div class="wrap ghoroa-wrap">

	<header class="ghoroa-header">
		<div class="ghoroa-header-inner">
			<div class="ghoroa-logo">
				<span class="ghoroa-logo-en">Ghoroa</span>
				<span class="ghoroa-logo-bn">ঘরোয়া</span>
			</div>
			<div class="ghoroa-header-meta">
				<span class="ghoroa-page-title"><?php esc_html_e( 'Analytics', 'ghoroa-core' ); ?></span>
			</div>
		</div>
	</header>

	<!-- Period selector -->
	<div class="ghoroa-period-tabs">
		<?php foreach ( $periods as $key => $label ) : ?>
		<a href="<?php echo esc_url( add_query_arg( [ 'page' => 'ghoroa-analytics', 'period' => $key ], admin_url( 'admin.php' ) ) ); ?>"
		   class="ghoroa-period-tab <?php echo $key === $period ? 'active' : ''; ?>">
			<?php echo esc_html( $label ); ?>
		</a>
		<?php endforeach; ?>
	</div>

	<!-- KPI summary -->
	<div class="ghoroa-kpi-grid">
		<div class="ghoroa-kpi-card ghoroa-kpi-revenue">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Revenue', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value">৳<?php echo esc_html( number_format( $summary['total_revenue'], 0 ) ); ?></div>
			<div class="ghoroa-kpi-sub"><?php echo esc_html( $summary['order_count'] ); ?> <?php esc_html_e( 'orders', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Avg Order Value', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value">৳<?php echo esc_html( number_format( $summary['aov'], 0 ) ); ?></div>
			<div class="ghoroa-kpi-sub"><?php esc_html_e( 'per order', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Cancel Rate', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value"><?php echo esc_html( $summary['cancelled_rate'] ); ?>%</div>
			<div class="ghoroa-kpi-sub"><?php echo esc_html( $summary['cancelled'] ); ?> <?php esc_html_e( 'cancelled', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Returning Customers', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value"><?php echo esc_html( $ret ); ?>%</div>
			<div class="ghoroa-kpi-sub"><?php esc_html_e( 'all-time', 'ghoroa-core' ); ?></div>
		</div>
	</div>

	<div class="ghoroa-analytics-grid">

		<!-- Daily breakdown table -->
		<div class="ghoroa-panel">
			<div class="ghoroa-panel-header">
				<h2><?php esc_html_e( 'Daily Breakdown', 'ghoroa-core' ); ?></h2>
			</div>
			<?php if ( empty( $daily ) ) : ?>
			<p class="ghoroa-empty-small"><?php esc_html_e( 'No completed orders in this period.', 'ghoroa-core' ); ?></p>
			<?php else : ?>
			<table class="ghoroa-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Date', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Orders', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Revenue (BDT)', 'ghoroa-core' ); ?></th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ( $daily as $row ) : ?>
				<tr>
					<td><?php echo esc_html( $row->day ); ?></td>
					<td class="ghoroa-cell-center"><?php echo esc_html( $row->orders ); ?></td>
					<td>৳<?php echo esc_html( number_format( (float) $row->revenue, 0 ) ); ?></td>
				</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<?php endif; ?>
		</div>

		<!-- Popular items -->
		<div class="ghoroa-panel">
			<div class="ghoroa-panel-header">
				<h2><?php esc_html_e( 'Popular Items', 'ghoroa-core' ); ?></h2>
			</div>
			<?php if ( empty( $popular ) ) : ?>
			<p class="ghoroa-empty-small"><?php esc_html_e( 'No order data in this period.', 'ghoroa-core' ); ?></p>
			<?php else : ?>
			<ol class="ghoroa-popular-list">
				<?php foreach ( $popular as $i => $item ) : ?>
				<li class="ghoroa-popular-item">
					<span class="ghoroa-popular-rank"><?php echo esc_html( $i + 1 ); ?></span>
					<div class="ghoroa-popular-bar-wrap">
						<span class="ghoroa-popular-name"><?php echo esc_html( $item->name ); ?></span>
						<div class="ghoroa-popular-bar" style="width:<?php echo esc_attr( min( 100, (int) $item->qty * 5 ) ); ?>%"></div>
					</div>
					<span class="ghoroa-popular-qty">×<?php echo esc_html( $item->qty ); ?></span>
				</li>
				<?php endforeach; ?>
			</ol>
			<?php endif; ?>
		</div>

	</div><!-- .ghoroa-analytics-grid -->

</div><!-- .ghoroa-wrap -->
