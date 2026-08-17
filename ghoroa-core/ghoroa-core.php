<?php
/**
 * Plugin Name:       Ghoroa Core
 * Plugin URI:        https://ghoroa.com
 * Description:       Direct ordering platform for GHOROA — custom WooCommerce extensions for order management, delivery zones, rider assignment, customer records, analytics, and bilingual support.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Pixel Mango Studio
 * Author URI:        https://pixelmango.studio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ghoroa-core
 * Domain Path:       /languages
 *
 * @package GhoroaCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ─── Constants ────────────────────────────────────────────────────────────────
define( 'GHOROA_VERSION',  '1.0.0' );
define( 'GHOROA_DIR',      plugin_dir_path( __FILE__ ) );
define( 'GHOROA_URL',      plugin_dir_url( __FILE__ ) );
define( 'GHOROA_BASENAME', plugin_basename( __FILE__ ) );

// ─── WooCommerce dependency check ────────────────────────────────────────────
add_action( 'admin_notices', 'ghoroa_wc_missing_notice' );
function ghoroa_wc_missing_notice(): void {
	if ( class_exists( 'WooCommerce' ) ) {
		return;
	}
	echo '<div class="error"><p><strong>' . esc_html__( 'Ghoroa Core', 'ghoroa-core' ) . '</strong> ' .
	     esc_html__( 'requires WooCommerce to be installed and active.', 'ghoroa-core' ) . '</p></div>';
}

/**
 * Initialise the plugin after WooCommerce is loaded.
 */
add_action( 'plugins_loaded', 'ghoroa_init', 20 );
function ghoroa_init(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}

	// Load text domain
	load_plugin_textdomain(
		'ghoroa-core',
		false,
		dirname( GHOROA_BASENAME ) . '/languages'
	);

	// ── Include all core classes ──────────────────────────────────────────────
	$classes = [
		'class-order-statuses',
		'class-checkout-fields',
		'class-delivery-zones',
		'class-rider-assignment',
		'class-customer-records',
		'class-menu-availability',
		'class-bilingual',
		'class-notifications',
		'class-admin-dashboard',
		'class-analytics',
	];

	foreach ( $classes as $class ) {
		$file = GHOROA_DIR . 'includes/' . $class . '.php';
		if ( file_exists( $file ) ) {
			require_once $file;
		}
	}

	// ── Boot each class ───────────────────────────────────────────────────────
	Ghoroa\Core\Order_Statuses::init();
	Ghoroa\Core\Checkout_Fields::init();
	Ghoroa\Core\Delivery_Zones::init();
	Ghoroa\Core\Rider_Assignment::init();
	Ghoroa\Core\Customer_Records::init();
	Ghoroa\Core\Menu_Availability::init();
	Ghoroa\Core\Bilingual::init();
	Ghoroa\Core\Notifications::init();
	Ghoroa\Core\Admin_Dashboard::init();
	Ghoroa\Core\Analytics::init();
}

// ─── Activation hook ─────────────────────────────────────────────────────────
register_activation_hook( __FILE__, 'ghoroa_activate' );
function ghoroa_activate(): void {
	// Seed WooCommerce product categories (bilingual)
	$categories = [
		[ 'slug' => 'breakfast',  'name_en' => 'Breakfast',   'name_bn' => 'সকালের নাস্তা' ],
		[ 'slug' => 'lunch',      'name_en' => 'Lunch',       'name_bn' => 'দুপুরের খাবার' ],
		[ 'slug' => 'dinner',     'name_en' => 'Dinner',      'name_bn' => 'রাতের খাবার' ],
		[ 'slug' => 'kebabs',     'name_en' => 'Kebabs',      'name_bn' => 'কাবাব' ],
		[ 'slug' => 'rice',       'name_en' => 'Rice',        'name_bn' => 'ভাত' ],
		[ 'slug' => 'desserts',   'name_en' => 'Desserts',    'name_bn' => 'মিষ্টি' ],
		[ 'slug' => 'drinks',     'name_en' => 'Drinks',      'name_bn' => 'পানীয়' ],
	];

	foreach ( $categories as $cat ) {
		$existing = get_term_by( 'slug', $cat['slug'], 'product_cat' );
		if ( ! $existing ) {
			$term = wp_insert_term( $cat['name_en'], 'product_cat', [ 'slug' => $cat['slug'] ] );
			if ( ! is_wp_error( $term ) ) {
				update_term_meta( $term['term_id'], '_ghoroa_name_bn', $cat['name_bn'] );
			}
		}
	}

	// Create the ghoroa_rider user role
	add_role(
		'ghoroa_rider',
		__( 'Ghoroa Rider', 'ghoroa-core' ),
		[
			'read'         => true,
			'edit_posts'   => false,
			'delete_posts' => false,
		]
	);

	// Seed example Dhaka delivery zones
	$zones = [
		[ 'name' => 'Dhanmondi',     'areas' => 'Dhanmondi 1-32',       'fee' => 60 ],
		[ 'name' => 'Gulshan',       'areas' => 'Gulshan 1, Gulshan 2',  'fee' => 80 ],
		[ 'name' => 'Banani',        'areas' => 'Banani, DOHS',          'fee' => 80 ],
		[ 'name' => 'Mohammadpur',   'areas' => 'Mohammadpur, Adabor',   'fee' => 60 ],
		[ 'name' => 'Mirpur',        'areas' => 'Mirpur 1-14, Pallabi',  'fee' => 70 ],
	];

	$existing_zones = get_option( 'ghoroa_delivery_zones', [] );
	if ( empty( $existing_zones ) ) {
		update_option( 'ghoroa_delivery_zones', $zones );
	}

	flush_rewrite_rules();
}

// ─── Deactivation hook ───────────────────────────────────────────────────────
register_deactivation_hook( __FILE__, 'ghoroa_deactivate' );
function ghoroa_deactivate(): void {
	flush_rewrite_rules();
}
