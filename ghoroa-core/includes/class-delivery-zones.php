<?php
/**
 * Delivery zones management for GHOROA.
 *
 * Stores zones in the wp_options table as a serialised array.
 * Each zone: name, areas (comma-separated string), flat fee (BDT).
 * Admin UI lets a manager add/edit/delete zones without writing code.
 *
 * Phase 2/3 ready: schema already supports areas array + fee;
 * distance-based fee calculation just replaces the fee lookup in Checkout_Fields.
 *
 * @package GhoroaCore
 */

namespace Ghoroa\Core;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Delivery_Zones {

	const OPTION_KEY = 'ghoroa_delivery_zones';
	const PAGE_SLUG  = 'ghoroa-zones';

	public static function init(): void {
		add_action( 'admin_menu', [ __CLASS__, 'register_menu' ] );
		add_action( 'admin_post_ghoroa_save_zone', [ __CLASS__, 'handle_save_zone' ] );
		add_action( 'admin_post_ghoroa_delete_zone', [ __CLASS__, 'handle_delete_zone' ] );

		// REST endpoint: get zones for checkout JS
		add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
	}

	// ─── Menu ────────────────────────────────────────────────────────────────

	public static function register_menu(): void {
		// Sub-page under Ghoroa parent (registered by Admin_Dashboard)
		add_submenu_page(
			'ghoroa-dashboard',
			__( 'Delivery Zones', 'ghoroa-core' ),
			__( 'Delivery Zones', 'ghoroa-core' ),
			'manage_woocommerce',
			self::PAGE_SLUG,
			[ __CLASS__, 'render_page' ]
		);
	}

	// ─── REST ────────────────────────────────────────────────────────────────

	public static function register_rest_routes(): void {
		register_rest_route( 'ghoroa/v1', '/zones', [
			'methods'             => 'GET',
			'callback'            => fn() => rest_ensure_response( self::get_all() ),
			'permission_callback' => '__return_true',
		] );
	}

	// ─── Data helpers ────────────────────────────────────────────────────────

	public static function get_all(): array {
		return get_option( self::OPTION_KEY, [] );
	}

	public static function get_fee_for_area( string $area_key ): float {
		foreach ( self::get_all() as $zone ) {
			if ( sanitize_key( $zone['name'] ) === $area_key ) {
				return (float) $zone['fee'];
			}
		}
		return 0.0;
	}

	// ─── CRUD handlers ───────────────────────────────────────────────────────

	public static function handle_save_zone(): void {
		check_admin_referer( 'ghoroa_save_zone' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ghoroa-core' ) );
		}

		$zones = self::get_all();
		$index = isset( $_POST['zone_index'] ) ? (int) $_POST['zone_index'] : -1;

		$zone = [
			'name'  => sanitize_text_field( $_POST['zone_name'] ?? '' ),
			'areas' => sanitize_textarea_field( $_POST['zone_areas'] ?? '' ),
			'fee'   => abs( (float) ( $_POST['zone_fee'] ?? 0 ) ),
		];

		if ( ! $zone['name'] ) {
			wp_redirect( add_query_arg( 'error', 'name_required', admin_url( 'admin.php?page=' . self::PAGE_SLUG ) ) );
			exit;
		}

		if ( $index >= 0 && isset( $zones[ $index ] ) ) {
			$zones[ $index ] = $zone;
		} else {
			$zones[] = $zone;
		}

		update_option( self::OPTION_KEY, $zones );
		wp_redirect( add_query_arg( 'saved', '1', admin_url( 'admin.php?page=' . self::PAGE_SLUG ) ) );
		exit;
	}

	public static function handle_delete_zone(): void {
		check_admin_referer( 'ghoroa_delete_zone' );
		if ( ! current_user_can( 'manage_woocommerce' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ghoroa-core' ) );
		}

		$index = (int) ( $_GET['zone_index'] ?? -1 );
		$zones = self::get_all();

		if ( isset( $zones[ $index ] ) ) {
			array_splice( $zones, $index, 1 );
			update_option( self::OPTION_KEY, $zones );
		}

		wp_redirect( admin_url( 'admin.php?page=' . self::PAGE_SLUG ) );
		exit;
	}

	// ─── Admin page ──────────────────────────────────────────────────────────

	public static function render_page(): void {
		$view = GHOROA_DIR . 'admin/views/zones.php';
		if ( file_exists( $view ) ) {
			include $view;
		}
	}
}
