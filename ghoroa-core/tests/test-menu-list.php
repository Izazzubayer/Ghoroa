<?php
/**
 * Self-check for the menu list block and the seed price parser.
 *
 * These are the two pieces of Phase 1 with real logic: the block turns CPT meta
 * into the "name … leader … price" rows, and the seeder reads a transcription
 * that contains blurred and doubled-up prices.
 *
 * Run:  php ghoroa-core/tests/test-menu-list.php
 *
 * @package GhoroaCore
 */

declare( strict_types = 1 );

define( 'ABSPATH', __DIR__ );
define( 'GHOROA_CORE_URL', 'https://example.test/' );
const GHOROA_CORE_VERSION = 'test';

/*
 * Minimal WordPress stubs — just enough surface for the render path.
 */

$GLOBALS['ghoroa_test_meta']   = array();
$GLOBALS['ghoroa_test_posts']  = array();
$GLOBALS['ghoroa_test_locale'] = 'en_US';

function add_action( $hook, $cb, $priority = 10, $args = 1 ) {}
function register_post_type( $type, $args = array() ) {}
function register_taxonomy( $tax, $type, $args = array() ) {}
function register_post_meta( $type, $key, $args = array() ) {}
function current_user_can( $cap ) { return false; }
function sanitize_key( $k ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/i', '', (string) $k ) ); }
function sanitize_text_field( $s ) { return trim( strip_tags( (string) $s ) ); }
function wp_kses_post( $s ) { return (string) $s; }
function esc_html( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $s ) { return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' ); }
function esc_html__( $s, $d = '' ) { return esc_html( $s ); }
function __( $s, $d = '' ) { return $s; }
function number_format_i18n( $n, $dec = 0 ) { return number_format( (float) $n, (int) $dec ); }
function determine_locale() { return $GLOBALS['ghoroa_test_locale']; }
function get_block_wrapper_attributes( $extra = array() ) {
	return 'class="' . esc_attr( $extra['class'] ?? '' ) . '"';
}
function get_post_meta( $id, $key, $single = false ) {
	return $GLOBALS['ghoroa_test_meta'][ $id ][ $key ] ?? '';
}
function get_posts( $args = array() ) { return $GLOBALS['ghoroa_test_posts']; }
function get_term_by( $field, $value, $tax ) {
	$t             = new WP_Term();
	$t->term_id    = 7;
	$t->name       = ucfirst( (string) $value );
	return $t;
}
function get_term_meta( $id, $key, $single = false ) {
	return 'ghoroa_name_bn' === $key ? 'সকালের নাস্তা' : '';
}

class WP_Term {
	public int $term_id = 0;
	public string $name = '';
}

class WP_Post {
	public int $ID = 0;
	public string $post_title = '';
}

require_once __DIR__ . '/../includes/class-content-types.php';
require_once __DIR__ . '/../includes/class-menu-list-block.php';

use Ghoroa\Core\Content_Types;
use Ghoroa\Core\Menu_List_Block;

$failures = 0;

/**
 * Tiny assertion helper.
 *
 * @param string $label     What is being checked.
 * @param bool   $condition Result of the check.
 * @param string $detail    Extra context printed on failure.
 */
function check( string $label, bool $condition, string $detail = '' ): void {
	global $failures;

	if ( $condition ) {
		echo "  ok    {$label}\n";
		return;
	}

	++$failures;
	echo "  FAIL  {$label}" . ( '' !== $detail ? "\n        {$detail}" : '' ) . "\n";
}

/**
 * Register one fake menu item.
 *
 * @param int                  $id   Post ID.
 * @param string               $name Post title.
 * @param array<string, mixed> $meta Meta values, unprefixed keys allowed.
 */
function seed_post( int $id, string $name, array $meta ): WP_Post {
	$p             = new WP_Post();
	$p->ID         = $id;
	$p->post_title = $name;

	$GLOBALS['ghoroa_test_meta'][ $id ] = $meta;

	return $p;
}

echo "Menu list block\n";

$GLOBALS['ghoroa_test_posts'] = array(
	seed_post(
		1,
		'Chicken Bhuna Khichuri',
		array(
			'ghoroa_name_en'        => 'Chicken Bhuna Khichuri',
			'ghoroa_name_bn'        => 'চিকেন ভুনা খিচুড়ি',
			'ghoroa_price_takeaway' => 300,
			'ghoroa_price_eatin'    => 330,
			'ghoroa_available'      => true,
		)
	),
);

$html = Menu_List_Block::render( array( 'category' => 'breakfast' ) );

check( 'renders the section heading', str_contains( $html, 'Breakfast' ) );
check( 'renders the English name', str_contains( $html, 'Chicken Bhuna Khichuri' ) );
check( 'renders the Bangla name tagged lang="bn"', str_contains( $html, 'lang="bn"' ) && str_contains( $html, 'চিকেন ভুনা খিচুড়ি' ) );
check( 'renders both prices', str_contains( $html, '300' ) && str_contains( $html, '330' ) );
check( 'labels prices for screen readers', str_contains( $html, 'Takeaway' ) && str_contains( $html, 'Eat in' ) );
check( 'leader is hidden from assistive tech', str_contains( $html, 'leader" aria-hidden="true"' ) );

// Equal prices should not print twice.
$GLOBALS['ghoroa_test_posts'] = array(
	seed_post(
		2,
		'Plain Rice',
		array(
			'ghoroa_name_en'        => 'Plain Rice',
			'ghoroa_price_takeaway' => 50,
			'ghoroa_price_eatin'    => 50,
			'ghoroa_available'      => true,
		)
	),
);

$html = Menu_List_Block::render( array( 'category' => 'lunch' ) );
check( 'collapses duplicate takeaway/eat-in price', 1 === substr_count( $html, 'ghoroa-price' ), $html );

// Sold-out items still list, but carry the tag.
$GLOBALS['ghoroa_test_posts'] = array(
	seed_post(
		3,
		'Kacchi Biryani',
		array(
			'ghoroa_name_en'        => 'Kacchi Biryani',
			'ghoroa_price_takeaway' => 300,
			'ghoroa_available'      => false,
		)
	),
);

$html = Menu_List_Block::render( array( 'category' => 'lunch' ) );
check( 'marks sold-out items', str_contains( $html, 'Sold out' ) );

// Bangla locale flips the primary name.
$GLOBALS['ghoroa_test_locale'] = 'bn_BD';
$GLOBALS['ghoroa_test_posts']  = array(
	seed_post(
		4,
		'Tehari',
		array(
			'ghoroa_name_en'        => 'Tehari',
			'ghoroa_name_bn'        => 'তেহারি',
			'ghoroa_price_takeaway' => 100,
		)
	),
);

$html = Menu_List_Block::render( array( 'category' => 'breakfast' ) );
check( 'Bangla locale leads with the Bangla name', str_contains( $html, '>তেহারি' ) );
check( 'Bangla locale tags the English name lang="en"', str_contains( $html, 'lang="en"' ) );
check( 'Bangla locale uses the Bangla heading', str_contains( $html, 'সকালের নাস্তা' ) );
$GLOBALS['ghoroa_test_locale'] = 'en_US';

// A half-filled entry must still render rather than showing a blank row.
$GLOBALS['ghoroa_test_posts'] = array( seed_post( 5, 'Egg Fry', array( 'ghoroa_price_takeaway' => 30 ) ) );
$html                        = Menu_List_Block::render( array( 'category' => 'breakfast' ) );
check( 'falls back to the post title when name_en is empty', str_contains( $html, 'Egg Fry' ) );

// Empty state must stay invisible to visitors.
$GLOBALS['ghoroa_test_posts'] = array();
check( 'empty section renders nothing for visitors', '' === Menu_List_Block::render( array( 'category' => 'dinner' ) ) );

// Limit is clamped to a sane range.
$GLOBALS['ghoroa_test_posts'] = array( seed_post( 6, 'Dal', array( 'ghoroa_price_takeaway' => 30 ) ) );
check( 'absurd limit does not fatal', str_contains( Menu_List_Block::render( array( 'category' => 'lunch', 'limit' => 99999 ) ), 'Dal' ) );

// Escaping.
$GLOBALS['ghoroa_test_posts'] = array(
	seed_post( 7, 'x', array( 'ghoroa_name_en' => '<script>alert(1)</script>', 'ghoroa_price_takeaway' => 10 ) ),
);
$html = Menu_List_Block::render( array( 'category' => 'lunch' ) );
check( 'escapes dish names', ! str_contains( $html, '<script>' ), $html );

echo "\nPrice sanitising\n";
check( 'negative price clamps to zero', 0.0 === Content_Types::sanitize_price( -5 ) );
check( 'garbage price becomes zero', 0.0 === Content_Types::sanitize_price( 'free' ) );
check( 'numeric string is accepted', 300.0 === Content_Types::sanitize_price( '300' ) );

echo "\nSeed parser (messy transcription)\n";

/**
 * Copy of the seeder's parser, which cannot be included here because the seed
 * script exits without WP-CLI.
 *
 * @param string $cell Raw table cell.
 */
function ghoroa_seed_price( string $cell ): ?float {
	$cell = trim( $cell );

	if ( '' === $cell || str_contains( $cell, '---' ) || str_contains( $cell, 'unclear' ) ) {
		return null;
	}

	return preg_match( '/(\d+(?:\.\d+)?)/', $cell, $m ) ? (float) $m[1] : null;
}

/**
 * Copy of the seeder's name cleaner, for the same reason.
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

check( 'strips "(unclear)" from a dish name', 'Hunter Hangs' === ghoroa_seed_clean_name( 'Hunter Hangs (unclear)' ) );
check( 'strips "(duplicate on menu)"', 'Beef Bhuna' === ghoroa_seed_clean_name( 'Beef Bhuna (duplicate on menu)' ) );
check( 'keeps portion notes like "(Quarter/Half/Full)"', 'Grill Chicken (Quarter/Half/Full)' === ghoroa_seed_clean_name( 'Grill Chicken (Quarter/Half/Full)' ) );
check( 'keeps "(Regular/Litre)"', 'Borhani (Regular/Litre)' === ghoroa_seed_clean_name( 'Borhani (Regular/Litre)' ) );

check( 'plain price parses', 300.0 === ghoroa_seed_price( '300' ) );
check( 'blurred price "---" is null', null === ghoroa_seed_price( '---' ) );
check( '"(unclear)" is null', null === ghoroa_seed_price( '120 (unclear)' ) );
check( 'empty cell is null', null === ghoroa_seed_price( '  ' ) );
check( 'takes the first of a "30 / 35" pair', 30.0 === ghoroa_seed_price( '30 / 35' ) );
check( 'handles a three-way "50 / 40 / 50" cell', 50.0 === ghoroa_seed_price( '50 / 40 / 50' ) );

echo "\n" . ( 0 === $failures ? "All checks passed.\n" : "{$failures} check(s) failed.\n" );
exit( 0 === $failures ? 0 : 1 );
