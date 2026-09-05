<?php
/**
 * Title: Full menu by meal period
 * Slug: ghoroa/menu-by-category
 * Categories: ghoroa
 * Description: Breakfast, lunch, dinner and juice sections rendered from the menu CPT.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|80"}}},"backgroundColor":"dark","layout":{"type":"constrained","wideSize":"1280px"}} -->
<div class="wp-block-group alignfull has-dark-background-color has-background" style="padding-top:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80)">
	<!-- wp:ghoroa/menu-list {"category":"breakfast"} /-->

	<!-- wp:ghoroa/menu-list {"category":"lunch"} /-->

	<!-- wp:ghoroa/menu-list {"category":"dinner"} /-->

	<!-- wp:ghoroa/menu-list {"category":"juice"} /-->

	<!-- wp:ghoroa/menu-list {"category":"snacks"} /-->

	<!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"cream","style":{"spacing":{"margin":{"top":"var:preset|spacing|60"}}}} -->
	<p class="has-text-align-center has-cream-color has-text-color has-small-font-size" style="margin-top:var(--wp--preset--spacing--60)">Prices are in BDT and include VAT where applicable. Availability changes daily — call us to confirm.</p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
