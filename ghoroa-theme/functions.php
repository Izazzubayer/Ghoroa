/**
 * Ghoroa block theme.
 *
 * @package ghoroa
 */

declare( strict_types = 1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ghoroa_theme_setup(): void {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'html5', array( 'search-form', 'script', 'style', 'navigation-widgets' ) );
	load_theme_textdomain( 'ghoroa', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'ghoroa_theme_setup' );

function ghoroa_enqueue_styles(): void {
	$style = get_template_directory() . '/style.css';
	wp_enqueue_style(
		'ghoroa-style',
		get_stylesheet_uri(),
		array(),
		file_exists( $style ) ? (string) filemtime( $style ) : '1.1.0'
	);
}
add_action( 'wp_enqueue_scripts', 'ghoroa_enqueue_styles' );

function ghoroa_register_pattern_category(): void {
	register_block_pattern_category(
		'ghoroa',
		array( 'label' => __( 'Ghoroa', 'ghoroa' ) )
	);
}
add_action( 'init', 'ghoroa_register_pattern_category' );
