<?php
/**
 * Title: Feast
 * Slug: ghoroa/feast
 * Categories: ghoroa
 * Description: Forest feast section matching React Feast.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"className":"ghoroa-feast","style":{"spacing":{"padding":{"top":"var:preset|spacing|0","bottom":"var:preset|spacing|0"}}}} -->
<div class="wp-block-group ghoroa-feast">
	<svg class="ghoroa-feast__lattice" aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none">
		<defs>
			<path id="ghoroa-arches" d="M50 90V40a20 20 0 0 1 0 0 20 20 0 0 1 0 0z" />
		</defs>
		<pattern id="ghoroa-arch-pattern" width="72" height="72" patternUnits="userSpaceOnUse">
			<path d="M36 66V30a18 18 0 0 1 0 0 18 18 0 0 1 0 0zM6 66V36a30 30 0 0 1 60 0v30" fill="none" stroke="currentColor" stroke-width="1" />
		</pattern>
		<rect width="100%" height="100%" fill="url(#ghoroa-arch-pattern)" />
	</svg>
	<div class="ghoroa-feast__grid">
		<div>
			<p class="ghoroa-eyebrow">The feast</p>
			<h2 class="ghoroa-feast__title">Cooked for a crowd,<br />the way Dhaka does it.</h2>
			<p class="ghoroa-feast__body">Kacchi biryani is sealed in the pot and baked until the rice takes the meat's perfume. Nothing about it is quick, and that is exactly the point.</p>
			<ul class="ghoroa-feast__list">
				<li>Whole-cut mutton, aged chinigura rice</li>
				<li>Spices ground the morning of service</li>
				<li>Sealed dough lid — opened at the table</li>
			</ul>
			<a class="ghoroa-btn" href="/menu/">Browse the menu</a>
		</div>
		<div class="ghoroa-feast__photo">
			<img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>" alt="Kacchi biryani plated with roast chicken and whole spices" />
			<img class="ghoroa-feast__inset" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/kitchen.jpg' ) ); ?>" alt="Beef curry served in a copper karahi with fresh naan" />
		</div>
	</div>
</div>
<!-- /wp:group -->
