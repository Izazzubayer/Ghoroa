<?php
/**
 * Ghoroa Admin — Delivery Zones
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$zones = Ghoroa\Core\Delivery_Zones::get_all();
$edit_index = isset( $_GET['edit'] ) ? (int) $_GET['edit'] : -1;
$edit_zone  = ( $edit_index >= 0 && isset( $zones[ $edit_index ] ) ) ? $zones[ $edit_index ] : null;
$saved      = ! empty( $_GET['saved'] );
$error      = sanitize_text_field( $_GET['error'] ?? '' );
?>
<div class="wrap ghoroa-wrap">

	<header class="ghoroa-header">
		<div class="ghoroa-header-inner">
			<div class="ghoroa-logo">
				<span class="ghoroa-logo-en">Ghoroa</span>
				<span class="ghoroa-logo-bn">ঘরোয়া</span>
			</div>
			<div class="ghoroa-header-meta">
				<span class="ghoroa-page-title"><?php esc_html_e( 'Delivery Zones', 'ghoroa-core' ); ?></span>
			</div>
		</div>
	</header>

	<?php if ( $saved ) : ?>
	<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Zone saved successfully.', 'ghoroa-core' ); ?></p></div>
	<?php endif; ?>
	<?php if ( 'name_required' === $error ) : ?>
	<div class="notice notice-error is-dismissible"><p><?php esc_html_e( 'Zone name is required.', 'ghoroa-core' ); ?></p></div>
	<?php endif; ?>

	<div class="ghoroa-zones-grid">

		<!-- Zone list -->
		<div class="ghoroa-panel ghoroa-zones-list">
			<div class="ghoroa-panel-header">
				<h2><?php esc_html_e( 'Active Zones', 'ghoroa-core' ); ?></h2>
			</div>

			<?php if ( empty( $zones ) ) : ?>
			<p class="ghoroa-empty-small"><?php esc_html_e( 'No zones yet. Add one using the form.', 'ghoroa-core' ); ?></p>
			<?php else : ?>
			<table class="ghoroa-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Zone', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Areas', 'ghoroa-core' ); ?></th>
						<th><?php esc_html_e( 'Fee (BDT)', 'ghoroa-core' ); ?></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
				<?php foreach ( $zones as $i => $zone ) : ?>
				<tr>
					<td><strong><?php echo esc_html( $zone['name'] ); ?></strong></td>
					<td><?php echo esc_html( $zone['areas'] ); ?></td>
					<td>৳<?php echo esc_html( $zone['fee'] ); ?></td>
					<td class="ghoroa-row-actions">
						<a href="<?php echo esc_url( add_query_arg( [ 'page' => 'ghoroa-zones', 'edit' => $i ], admin_url( 'admin.php' ) ) ); ?>" class="ghoroa-btn-sm">
							<?php esc_html_e( 'Edit', 'ghoroa-core' ); ?>
						</a>
						<a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=ghoroa_delete_zone&zone_index=' . $i ), 'ghoroa_delete_zone' ) ); ?>"
						   class="ghoroa-btn-sm ghoroa-btn-danger"
						   onclick="return confirm('<?php esc_attr_e( 'Delete this zone?', 'ghoroa-core' ); ?>')">
							<?php esc_html_e( 'Delete', 'ghoroa-core' ); ?>
						</a>
					</td>
				</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
			<?php endif; ?>
		</div>

		<!-- Add / Edit form -->
		<div class="ghoroa-panel ghoroa-zone-form">
			<div class="ghoroa-panel-header">
				<h2><?php echo $edit_zone ? esc_html__( 'Edit Zone', 'ghoroa-core' ) : esc_html__( 'Add Zone', 'ghoroa-core' ); ?></h2>
			</div>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<?php wp_nonce_field( 'ghoroa_save_zone' ); ?>
				<input type="hidden" name="action" value="ghoroa_save_zone">
				<?php if ( $edit_zone ) : ?>
				<input type="hidden" name="zone_index" value="<?php echo esc_attr( $edit_index ); ?>">
				<?php endif; ?>

				<div class="ghoroa-field">
					<label for="zone_name"><?php esc_html_e( 'Zone Name', 'ghoroa-core' ); ?> <span class="required">*</span></label>
					<input type="text" id="zone_name" name="zone_name"
						   value="<?php echo esc_attr( $edit_zone['name'] ?? '' ); ?>"
						   placeholder="e.g. Dhanmondi" required class="regular-text">
				</div>

				<div class="ghoroa-field">
					<label for="zone_areas"><?php esc_html_e( 'Covered Areas', 'ghoroa-core' ); ?></label>
					<textarea id="zone_areas" name="zone_areas" rows="3" class="large-text"
							  placeholder="Dhanmondi 1-32, Jigatola…"><?php echo esc_textarea( $edit_zone['areas'] ?? '' ); ?></textarea>
					<p class="description"><?php esc_html_e( 'Comma-separated list of neighbourhoods or roads.', 'ghoroa-core' ); ?></p>
				</div>

				<div class="ghoroa-field">
					<label for="zone_fee"><?php esc_html_e( 'Flat Delivery Fee (BDT)', 'ghoroa-core' ); ?></label>
					<input type="number" id="zone_fee" name="zone_fee" min="0" step="5"
						   value="<?php echo esc_attr( $edit_zone['fee'] ?? '' ); ?>"
						   placeholder="60" class="small-text">
				</div>

				<div class="ghoroa-field-actions">
					<button type="submit" class="ghoroa-btn-primary">
						<?php echo $edit_zone ? esc_html__( 'Update Zone', 'ghoroa-core' ) : esc_html__( 'Add Zone', 'ghoroa-core' ); ?>
					</button>
					<?php if ( $edit_zone ) : ?>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=ghoroa-zones' ) ); ?>" class="ghoroa-btn-sm">
						<?php esc_html_e( 'Cancel', 'ghoroa-core' ); ?>
					</a>
					<?php endif; ?>
				</div>
			</form>
		</div>

	</div>
</div>
