<?php
/**
 * Seed the menu CPT from Ghoroa_Menu_Transcribed.md.
 *
 * Run once against a staging install:
 *
 *   wp eval-file ghoroa-core/tools/seed-menu.php docs/Ghoroa_Menu_Transcribed.md
 *
 * Idempotent: an item is matched on its English name within a meal period, so
 * re-running updates prices instead of creating duplicates.
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	exit( "This script must be run through WP-CLI.\n" );
}

$source = $args[0] ?? '';

if ( '' === $source || ! is_readable( $source ) ) {
	WP_CLI::error( 'Pass a readable path to Ghoroa_Menu_Transcribed.md.' );
}

/**
 * Map the markdown headings onto taxonomy slugs.
 */
$heading_map = array(
	'breakfast' => 'breakfast',
	'lunch'     => 'lunch',
	'dinner'    => 'dinner',
	'juice'     => 'juice',
	'snack'     => 'snacks',
);

$lines    = file( $source, FILE_IGNORE_NEW_LINES );
$category = '';
$created  = 0;
$updated  = 0;
$skipped  = 0;

foreach ( $lines as $line ) {

	// Section heading, e.g. "## Lunch (দুপুরের খাবার)".
	if ( str_starts_with( $line, '## ' ) ) {
		$category = '';
		$heading  = strtolower( substr( $line, 3 ) );

		foreach ( $heading_map as $needle => $slug ) {
			if ( str_contains( $heading, $needle ) ) {
				$category = $slug;
				break;
			}
		}

		continue;
	}

	if ( '' === $category ) {
		continue;
	}

	// Table row: leading index, name, then one or two prices.
	if ( ! preg_match( '/^\s*(\d+)\s+(.+?)\s{2,}(.+)$/', $line, $m ) ) {
		continue;
	}

	$name   = ghoroa_seed_clean_name( $m[2] );
	$prices = preg_split( '/\s{2,}/', trim( $m[3] ) ) ?: array();

	if ( '' === $name || 'Item' === $name ) {
		continue;
	}

	$takeaway = ghoroa_seed_price( $prices[0] ?? '' );
	$eatin    = ghoroa_seed_price( $prices[1] ?? '' );

	if ( null === $takeaway && null === $eatin ) {
		++$skipped;
		WP_CLI::log( "Skipped (no readable price): {$name}" );
		continue;
	}

	$existing = get_posts(
		array(
			'post_type'      => 'ghoroa_menu_item',
			'post_status'    => 'any',
			'posts_per_page' => 1,
			'title'          => $name,
			'tax_query'      => array(
				array(
					'taxonomy' => 'ghoroa_menu_category',
					'field'    => 'slug',
					'terms'    => $category,
				),
			),
			'fields'         => 'ids',
		)
	);

	if ( $existing ) {
		$post_id = (int) $existing[0];
		++$updated;
	} else {
		$post_id = wp_insert_post(
			array(
				'post_type'   => 'ghoroa_menu_item',
				'post_status' => 'publish',
				'post_title'  => $name,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			WP_CLI::warning( "Could not create {$name}: " . $post_id->get_error_message() );
			continue;
		}

		wp_set_object_terms( $post_id, $category, 'ghoroa_menu_category' );
		++$created;
	}

	update_post_meta( $post_id, 'ghoroa_name_en', $name );
	update_post_meta( $post_id, 'ghoroa_available', true );

	if ( null !== $takeaway ) {
		update_post_meta( $post_id, 'ghoroa_price_takeaway', $takeaway );
	}

	if ( null !== $eatin ) {
		update_post_meta( $post_id, 'ghoroa_price_eatin', $eatin );
	}
}

WP_CLI::success( "Menu seeded — {$created} created, {$updated} updated, {$skipped} skipped." );

/**
 * Strip the transcriber's annotations from a dish name.
 *
 * The markdown carries notes like "(unclear)" and "(duplicate on menu)" that are
 * about the transcription, not the dish. Portion notes such as "(Quarter/Half/Full)"
 * are real menu information and must survive.
 *
 * @param string $raw Raw name cell.
 */
function ghoroa_seed_clean_name( string $raw ): string {
	$cleaned = preg_replace(
		'/\s*\((?:unclear|duplicate[^)]*|blurred[^)]*)\)/i',
		'',
		trim( $raw )
	);

	return trim( (string) $cleaned );
}

/**
 * Parse one price cell.
 *
 * The transcription marks unreadable prices with "---" or "(unclear)", and some
 * cells hold a "30 / 35" pair. Take the first number and let a human fix the rest
 * in the dashboard rather than guessing.
 *
 * @param string $cell Raw table cell.
 * @return float|null Price, or null when the cell holds no usable number.
 */
function ghoroa_seed_price( string $cell ): ?float {
	$cell = trim( $cell );

	if ( '' === $cell || str_contains( $cell, '---' ) || str_contains( $cell, 'unclear' ) ) {
		return null;
	}

	return preg_match( '/(\d+(?:\.\d+)?)/', $cell, $m ) ? (float) $m[1] : null;
}
