<?php
/**
 * Ghoroa Admin Dashboard — Today's Orders + KPI Cards
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

use Ghoroa\Core\Admin_Dashboard;
use Ghoroa\Core\Order_Statuses;
use Ghoroa\Core\Rider_Assignment;

$today_orders  = Admin_Dashboard::get_todays_orders();
$revenue       = Admin_Dashboard::get_todays_revenue();
$counts        = Admin_Dashboard::get_status_counts();
$popular       = Admin_Dashboard::get_popular_items( 5 );
$all_riders    = Rider_Assignment::get_all_riders();

// Status transition map for buttons
$transitions = [
	'ghoroa-new'              => [ 'next' => 'ghoroa-confirmed',        'label' => __( 'Accept', 'ghoroa-core' ) ],
	'ghoroa-confirmed'        => [ 'next' => 'ghoroa-preparing',        'label' => __( 'Start Preparing', 'ghoroa-core' ) ],
	'ghoroa-preparing'        => [ 'next' => 'ghoroa-ready',            'label' => __( 'Mark Ready', 'ghoroa-core' ) ],
	'ghoroa-ready'            => [ 'next' => 'ghoroa-out-for-delivery', 'label' => __( 'Out for Delivery', 'ghoroa-core' ) ],
	'ghoroa-out-for-delivery' => [ 'next' => 'ghoroa-delivered',        'label' => __( 'Delivered', 'ghoroa-core' ) ],
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
				<span class="ghoroa-date"><?php echo esc_html( current_time( 'l, d F Y' ) ); ?></span>
				<button id="ghoroa-refresh-btn" class="ghoroa-btn-icon" title="<?php esc_attr_e( 'Refresh', 'ghoroa-core' ); ?>">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.65 2.35A8 8 0 1 0 15 8h-2a6 6 0 1 1-1.05-3.39L10 6h5V1l-1.35 1.35z" fill="currentColor"/></svg>
				</button>
			</div>
		</div>
	</header>

	<!-- KPI Cards -->
	<div class="ghoroa-kpi-grid">
		<div class="ghoroa-kpi-card ghoroa-kpi-revenue">
			<div class="ghoroa-kpi-label"><?php esc_html_e( "Today's Revenue", 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value">৳<?php echo esc_html( number_format( $revenue, 0 ) ); ?></div>
			<div class="ghoroa-kpi-sub"><?php echo esc_html( $counts['completed'] ); ?> <?php esc_html_e( 'orders completed', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card ghoroa-kpi-pending">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Pending', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value"><?php echo esc_html( $counts['pending'] ); ?></div>
			<div class="ghoroa-kpi-sub"><?php esc_html_e( 'awaiting action', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card ghoroa-kpi-delivering">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Out for Delivery', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value"><?php echo esc_html( $counts['delivering'] ); ?></div>
			<div class="ghoroa-kpi-sub"><?php esc_html_e( 'with riders now', 'ghoroa-core' ); ?></div>
		</div>
		<div class="ghoroa-kpi-card ghoroa-kpi-cancelled">
			<div class="ghoroa-kpi-label"><?php esc_html_e( 'Cancelled', 'ghoroa-core' ); ?></div>
			<div class="ghoroa-kpi-value"><?php echo esc_html( $counts['cancelled'] ); ?></div>
			<div class="ghoroa-kpi-sub"><?php esc_html_e( 'today', 'ghoroa-core' ); ?></div>
		</div>
	</div>

	<div class="ghoroa-main-grid">

		<!-- Today's Orders Table -->
		<div class="ghoroa-orders-panel">
			<div class="ghoroa-panel-header">
				<h2><?php esc_html_e( "Today's Orders", 'ghoroa-core' ); ?></h2>
				<span class="ghoroa-badge" id="ghoroa-order-count"><?php echo count( $today_orders ); ?></span>
			</div>

			<?php if ( empty( $today_orders ) ) : ?>
				<div class="ghoroa-empty">
					<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 16h32M12 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" stroke="#D98B5F" stroke-width="2" stroke-linecap="round"/></svg>
					<p><?php esc_html_e( 'No orders yet today. The kitchen is ready.', 'ghoroa-core' ); ?></p>
				</div>
			<?php else : ?>
			<div class="ghoroa-table-wrap">
			<table class="ghoroa-orders-table" id="ghoroa-orders-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Order', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Time', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Customer', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Items', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Area', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Total', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Rider', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Status', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Action', 'ghoroa-core' ); ?></th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ( $today_orders as $order ) :
					$order_id    = $order->get_id();
					$status      = $order->get_status();
					$rider_id    = (int) $order->get_meta( '_ghoroa_assigned_rider_id' );
					$fulfillment = $order->get_meta( '_ghoroa_fulfillment_type' );
					$transition  = $transitions[ $status ] ?? null;
					$items_str   = [];
					foreach ( $order->get_items() as $item ) {
						$items_str[] = $item->get_name() . ' ×' . $item->get_quantity();
					}
				?>
				<tr class="ghoroa-order-row" data-order-id="<?php echo esc_attr( $order_id ); ?>" data-status="<?php echo esc_attr( $status ); ?>">
					<td>
						<a href="<?php echo esc_url( get_edit_post_link( $order_id ) ); ?>" class="ghoroa-order-link">
							#<?php echo esc_html( $order_id ); ?>
						</a>
						<?php if ( 'pickup' === $fulfillment ) : ?>
							<span class="ghoroa-tag ghoroa-tag-pickup"><?php esc_html_e( 'Pickup', 'ghoroa-core' ); ?></span>
						<?php endif; ?>
					</td>
					<td class="ghoroa-cell-time"><?php echo esc_html( $order->get_date_created()->date( 'H:i' ) ); ?></td>
					<td>
						<div class="ghoroa-customer-name"><?php echo esc_html( trim( $order->get_billing_first_name() . ' ' . $order->get_billing_last_name() ) ); ?></div>
						<div class="ghoroa-customer-phone"><?php echo esc_html( $order->get_billing_phone() ); ?></div>
					</td>
					<td class="ghoroa-cell-items"><?php echo esc_html( implode( ', ', $items_str ) ); ?></td>
					<td><?php echo esc_html( $order->get_meta( '_ghoroa_delivery_area' ) ?: '—' ); ?></td>
					<td class="ghoroa-cell-total">৳<?php echo esc_html( number_format( (float) $order->get_total(), 0 ) ); ?></td>
					<td>
						<select class="ghoroa-rider-select" data-order-id="<?php echo esc_attr( $order_id ); ?>">
							<option value=""><?php esc_html_e( '— assign —', 'ghoroa-core' ); ?></option>
							<?php foreach ( $all_riders as $rider ) : ?>
								<option value="<?php echo esc_attr( $rider->ID ); ?>" <?php selected( $rider_id, $rider->ID ); ?>>
									<?php echo esc_html( $rider->display_name ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</td>
					<td>
						<span class="ghoroa-status-pill" style="background:<?php echo esc_attr( Order_Statuses::get_color( $status ) ); ?>22;color:<?php echo esc_attr( Order_Statuses::get_color( $status ) ); ?>;">
							<?php echo esc_html( Order_Statuses::get_label( $status ) ); ?>
						</span>
					</td>
					<td class="ghoroa-cell-action">
						<?php if ( $transition ) : ?>
						<button class="ghoroa-action-btn"
								data-order-id="<?php echo esc_attr( $order_id ); ?>"
								data-status="<?php echo esc_attr( $transition['next'] ); ?>">
							<?php echo esc_html( $transition['label'] ); ?>
						</button>
						<?php endif; ?>
						<?php if ( ! in_array( $status, [ 'ghoroa-cancelled', 'ghoroa-rejected' ], true ) ) : ?>
						<button class="ghoroa-action-btn ghoroa-action-cancel"
								data-order-id="<?php echo esc_attr( $order_id ); ?>"
								data-status="ghoroa-cancelled">
							<?php esc_html_e( 'Cancel', 'ghoroa-core' ); ?>
						</button>
						<?php endif; ?>
					</td>
				</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			</div>
			<?php endif; ?>
		</div><!-- .ghoroa-orders-panel -->

		<!-- Popular Items Sidebar -->
		<div class="ghoroa-sidebar">
			<div class="ghoroa-panel-header">
				<h2><?php esc_html_e( 'Popular Today', 'ghoroa-core' ); ?></h2>
			</div>
			<?php if ( empty( $popular ) ) : ?>
				<p class="ghoroa-empty-small"><?php esc_html_e( 'No data yet.', 'ghoroa-core' ); ?></p>
			<?php else : ?>
			<ol class="ghoroa-popular-list">
				<?php foreach ( $popular as $i => $item ) : ?>
				<li class="ghoroa-popular-item">
					<span class="ghoroa-popular-rank"><?php echo esc_html( $i + 1 ); ?></span>
					<span class="ghoroa-popular-name"><?php echo esc_html( $item->name ); ?></span>
					<span class="ghoroa-popular-qty">×<?php echo esc_html( $item->qty ); ?></span>
				</li>
				<?php endforeach; ?>
			</ol>
			<?php endif; ?>

			<!-- Quick links -->
			<div class="ghoroa-quick-links">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=ghoroa-analytics' ) ); ?>" class="ghoroa-quick-link">
					<?php esc_html_e( 'View Analytics →', 'ghoroa-core' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=ghoroa-zones' ) ); ?>" class="ghoroa-quick-link">
					<?php esc_html_e( 'Delivery Zones →', 'ghoroa-core' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=ghoroa-customers' ) ); ?>" class="ghoroa-quick-link">
					<?php esc_html_e( 'Customers →', 'ghoroa-core' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=product' ) ); ?>" class="ghoroa-quick-link">
					<?php esc_html_e( 'Menu Items →', 'ghoroa-core' ); ?>
				</a>
			</div>
		</div><!-- .ghoroa-sidebar -->

	</div><!-- .ghoroa-main-grid -->

</div><!-- .ghoroa-wrap -->
