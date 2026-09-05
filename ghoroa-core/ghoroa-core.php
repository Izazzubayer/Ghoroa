<?php
/**
 * Plugin Name:       Ghoroa Core
 * Plugin URI:        https://ghoroa.com
 * Description:       Presence module for Ghoroa — menu, locations and FAQ content types with bilingual EN/BN fields. Phase 1 is display only; ordering and POS live in Rosuii from Phase 2.
 * Version:           2.0.0
 * Requires at least: 6.5
 * Requires PHP:      8.2
 * Author:            Pixel Mango Studio
 * Author URI:        https://pixelmango.studio
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ghoroa-core
 * Domain Path:       /languages
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const GHOROA_CORE_VERSION = '2.0.0';

define( 'GHOROA_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'GHOROA_CORE_URL', plugin_dir_url( __FILE__ ) );

/**
 * Boot the presence module.
 *
 * Phase 1 deliberately has no WooCommerce dependency: the menu is display-only
 * content, not products. The commerce classes this plugin used to load were
 * superseded by Rosuii and now live in
 * docs/archive/ghoroa-core-commerce-superseded/.
 */
function ghoroa_core_init(): void {
	load_plugin_textdomain( 'ghoroa-core', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

	require_once GHOROA_CORE_DIR . 'includes/class-content-types.php';
	require_once GHOROA_CORE_DIR . 'includes/class-menu-list-block.php';
	require_once GHOROA_CORE_DIR . 'includes/class-headless.php';
	require_once GHOROA_CORE_DIR . 'includes/class-settings-admin.php';

	Ghoroa\Core\Content_Types::init();
	Ghoroa\Core\Menu_List_Block::init();
	Ghoroa\Core\Headless::init();
	Ghoroa\Core\Settings_Admin::init();
}
add_action( 'plugins_loaded', 'ghoroa_core_init' );

/**
 * Register content types on activation so their rewrite rules exist immediately.
 */
function ghoroa_core_activate(): void {
	require_once GHOROA_CORE_DIR . 'includes/class-content-types.php';

	Ghoroa\Core\Content_Types::register_post_types();
	Ghoroa\Core\Content_Types::register_taxonomy();
	Ghoroa\Core\Content_Types::seed_menu_categories();

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'ghoroa_core_activate' );

/**
 * Clear rewrite rules on deactivation. Content is left untouched.
 */
function ghoroa_core_deactivate(): void {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'ghoroa_core_deactivate' );
