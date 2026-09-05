<?php
/**
 * Ghoroa settings admin screen (phone, WhatsApp, hours, socials, Order Now, secrets).
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register admin menu and save handlers for ghoroa_settings.
 */
final class Settings_Admin {

	public const OPTION = 'ghoroa_settings';

	/**
	 * Boot.
	 */
	public static function init(): void {
		add_action( 'admin_menu', array( self::class, 'menu' ) );
		add_action( 'admin_init', array( self::class, 'register_settings' ) );
	}

	/**
	 * Add Settings → Ghoroa.
	 */
	public static function menu(): void {
		add_options_page(
			__( 'Ghoroa Settings', 'ghoroa-core' ),
			__( 'Ghoroa', 'ghoroa-core' ),
			'manage_options',
			'ghoroa-settings',
			array( self::class, 'render' )
		);
	}

	/**
	 * Register form fields.
	 */
	public static function register_settings(): void {
		register_setting(
			self::OPTION,
			self::OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'default'           => array(),
			)
		);
	}

	/**
	 * Render the settings form.
	 */
	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$options = get_option( self::OPTION, array() );
		?>
		<div class="wrap">
			<h1><?php echo esc_html__( 'Ghoroa Settings', 'ghoroa-core' ); ?></h1>
			<form method="post" action="options.php">
				<?php settings_fields( self::OPTION ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="ghoroa_phone"><?php echo esc_html__( 'Phone', 'ghoroa-core' ); ?></label></th>
						<td><input type="text" name="ghoroa_settings[phone]" id="ghoroa_phone" class="regular-text" value="<?php echo esc_attr( (string) ( $options['phone'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_whatsapp"><?php echo esc_html__( 'WhatsApp number (digits)', 'ghoroa-core' ); ?></label></th>
						<td><input type="text" name="ghoroa_settings[whatsapp]" id="ghoroa_whatsapp" class="regular-text" value="<?php echo esc_attr( (string) ( $options['whatsapp'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_order_now"><?php echo esc_html__( 'Order Now URL (Phase 1 WhatsApp / Phase 2 Rosuii)', 'ghoroa-core' ); ?></label></th>
						<td><input type="url" name="ghoroa_settings[order_now]" id="ghoroa_order_now" class="regular-text" value="<?php echo esc_attr( (string) ( $options['order_now'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_hours"><?php echo esc_html__( 'Hours', 'ghoroa-core' ); ?></label></th>
						<td><input type="text" name="ghoroa_settings[hours]" id="ghoroa_hours" class="regular-text" value="<?php echo esc_attr( (string) ( $options['hours'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_address"><?php echo esc_html__( 'Address', 'ghoroa-core' ); ?></label></th>
						<td><input type="text" name="ghoroa_settings[address]" id="ghoroa_address" class="regular-text" value="<?php echo esc_attr( (string) ( $options['address'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_email"><?php echo esc_html__( 'Contact email', 'ghoroa-core' ); ?></label></th>
						<td><input type="email" name="ghoroa_settings[email]" id="ghoroa_email" class="regular-text" value="<?php echo esc_attr( (string) ( $options['email'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_tagline"><?php echo esc_html__( 'Homepage tagline (EN)', 'ghoroa-core' ); ?></label></th>
						<td><input type="text" name="ghoroa_settings[tagline]" id="ghoroa_tagline" class="large-text" value="<?php echo esc_attr( (string) ( $options['tagline'] ?? '' ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_about"><?php echo esc_html__( 'About copy (EN)', 'ghoroa-core' ); ?></label></th>
						<td><textarea name="ghoroa_settings[about]" id="ghoroa_about" class="large-text" rows="5"><?php echo esc_textarea( (string) ( $options['about'] ?? '' ) ); ?></textarea></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_instagram"><?php echo esc_html__( 'Instagram URL', 'ghoroa-core' ); ?></label></th>
						<td><input type="url" name="ghoroa_settings[social][instagram]" id="ghoroa_instagram" class="regular-text" value="<?php echo esc_attr( (string) ( ( $options['social']['instagram'] ?? '' ) ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_facebook"><?php echo esc_html__( 'Facebook URL', 'ghoroa-core' ); ?></label></th>
						<td><input type="url" name="ghoroa_settings[social][facebook]" id="ghoroa_facebook" class="regular-text" value="<?php echo esc_attr( (string) ( ( $options['social']['facebook'] ?? '' ) ) ); ?>" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_revalidate_secret"><?php echo esc_html__( 'Revalidation secret (Next.js)', 'ghoroa-core' ); ?></label></th>
						<td><input type="password" name="ghoroa_settings[revalidate_secret]" id="ghoroa_revalidate_secret" class="regular-text" value="<?php echo esc_attr( (string) ( $options['revalidate_secret'] ?? '' ) ); ?>" autocomplete="new-password" /></td>
					</tr>
					<tr>
						<th scope="row"><label for="ghoroa_preview_secret"><?php echo esc_html__( 'Draft preview secret', 'ghoroa-core' ); ?></label></th>
						<td><input type="password" name="ghoroa_settings[preview_secret]" id="ghoroa_preview_secret" class="regular-text" value="<?php echo esc_attr( (string) ( $options['preview_secret'] ?? '' ) ); ?>" autocomplete="new-password" /></td>
					</tr>
				</table>
				<?php submit_button( __( 'Save settings', 'ghoroa-core' ) ); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Sanitize options.
	 *
	 * @param mixed $input Input.
	 * @return array<string, mixed>
	 */
	public static function sanitize( mixed $input ): array {
		if ( ! is_array( $input ) ) {
			return array();
		}
		$social = (array) ( $input['social'] ?? array() );
		return array(
			'phone'            => sanitize_text_field( (string) ( $input['phone'] ?? '' ) ),
			'whatsapp'         => sanitize_text_field( (string) ( $input['whatsapp'] ?? '' ) ),
			'order_now'        => esc_url_raw( (string) ( $input['order_now'] ?? '' ) ),
			'hours'            => sanitize_text_field( (string) ( $input['hours'] ?? '' ) ),
			'address'          => sanitize_text_field( (string) ( $input['address'] ?? '' ) ),
			'email'            => sanitize_email( (string) ( $input['email'] ?? '' ) ),
			'tagline'          => sanitize_text_field( (string) ( $input['tagline'] ?? '' ) ),
			'about'            => sanitize_textarea_field( (string) ( $input['about'] ?? '' ) ),
			'social'           => array(
				'instagram' => esc_url_raw( (string) ( $social['instagram'] ?? '' ) ),
				'facebook'  => esc_url_raw( (string) ( $social['facebook'] ?? '' ) ),
			),
			'revalidate_secret' => sanitize_text_field( (string) ( $input['revalidate_secret'] ?? '' ) ),
			'preview_secret'    => sanitize_text_field( (string) ( $input['preview_secret'] ?? '' ) ),
		);
	}
}
