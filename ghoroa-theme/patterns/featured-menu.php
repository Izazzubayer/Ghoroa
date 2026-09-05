<?php
/**
 * Title: Featured dishes
 * Slug: ghoroa/featured-menu
 * Categories: ghoroa
 * Description: A short taste of the menu on the home page, pulled live from the menu CPT.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"backgroundColor":"dark","layout":{"type":"constrained","wideSize":"1280px"}} -->
<div class="wp-block-group alignfull has-dark-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
	<!-- wp:paragraph {"align":"center","style":{"typography":{"textTransform":"uppercase","letterSpacing":"0.2em","fontWeight":"600"}},"textColor":"gold-deep","fontSize":"small"} -->
	<p class="has-text-align-center has-gold-deep-color has-text-color has-small-font-size" style="font-weight:600;letter-spacing:0.2em;text-transform:uppercase">From the kitchen</p>
	<!-- /wp:paragraph -->

	<!-- wp:heading {"textAlign":"center","textColor":"cream","fontSize":"xx-large"} -->
	<h2 class="wp-block-heading has-text-align-center has-cream-color has-text-color has-xx-large-font-size">A few things we are known for</h2>
	<!-- /wp:heading -->

	<!-- wp:spacer {"height":"var:preset|spacing|50"} -->
	<div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:ghoroa/menu-list {"featuredOnly":true,"limit":6,"showHeading":false} /-->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|60"}}}} -->
	<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--60)">
		<!-- wp:button {"className":"is-style-outline","style":{"border":{"color":"var:preset|color|gold-deep","width":"1px"}},"textColor":"gold"} -->
		<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-gold-color has-text-color wp-element-button" href="/menu/">See the full menu</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
