<?php
/**
 * Title: Home hero
 * Slug: ghoroa/hero
 * Categories: ghoroa
 * Description: Full-bleed hero matching design/prototype-react Hero.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"className":"ghoroa-hero","style":{"spacing":{"padding":{"top":"var:preset|spacing|0","bottom":"var:preset|spacing|0"}}}} -->
<div class="wp-block-group ghoroa-hero">
	<img class="ghoroa-hero__bg" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.jpg' ) ); ?>" alt="" />
	<div class="ghoroa-hero__scrim" aria-hidden="true"></div>
	<div class="ghoroa-hero__content">
		<div class="ghoroa-hero__inner">
			<p class="ghoroa-eyebrow">
				<span aria-hidden="true" class="ghoroa-eyebrow__rule"></span>
				Bangladeshi heritage restaurant
			</p>
			<h1 class="ghoroa-hero__title">Authentic flavours.<br />Timeless tradition.</h1>
			<p class="ghoroa-hero__lead">Rooted in heritage. Made for today. Experience the true taste of Bangladesh in every bite.</p>
			<div class="ghoroa-hero__meta">
				<a class="ghoroa-btn" href="/menu/">Explore our menu</a>
				<a class="ghoroa-eyebrow" href="/about/" style="font-size:0.7rem;color:color-mix(in srgb, var(--wp--preset--color--cream) 70%, transparent);text-decoration:underline;letter-spacing:0.16em;">Our story</a>
			</div>
		</div>
	</div>
	<div class="ghoroa-hero__scroll" aria-hidden="true">
		<span>Scroll</span>
		<span class="ghoroa-hero__scroll-line"></span>
	</div>
</div>
<!-- /wp:group -->
