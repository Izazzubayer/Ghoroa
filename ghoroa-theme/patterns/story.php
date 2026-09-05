<?php
/**
 * Title: Story
 * Slug: ghoroa/story
 * Categories: ghoroa
 * Description: Parchment story section matching React Story.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"className":"ghoroa-story","style":{"spacing":{"padding":{"top":"var:preset|spacing|0","bottom":"var:preset|spacing|0"}}}} -->
<div class="wp-block-group ghoroa-story">
	<div class="ghoroa-story__grid">
		<div>
			<p class="ghoroa-eyebrow ghoroa-eyebrow--terracotta">Our story</p>
			<h2 class="ghoroa-story__title">A home.<br />A heritage.<br />A legacy.</h2>
			<div class="ghoroa-story__body">
				<p>Ghoroa brings the soul of Bengal to your table. Inspired by traditional recipes passed down through generations, we celebrate the rich flavours, warm hospitality, and timeless culture of Bangladesh.</p>
				<p>Every dish begins the way it always has — spices ground fresh, mustard oil in the pan, and the patience to wait for the first bubble.</p>
			</div>
			<a class="ghoroa-btn ghoroa-btn--solid" href="/menu/">Discover our story</a>
			<dl class="ghoroa-story__stats">
				<div><dd><span>40+</span><span>Years of recipes</span></dd></div>
				<div><dd><span>117</span><span>Dishes served</span></dd></div>
				<div><dd><span>1</span><span>Kitchen, no shortcuts</span></dd></div>
			</dl>
		</div>
		<div class="ghoroa-arch">
			<svg aria-hidden class="ghoroa-arch__finial" width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><path d="M7 0l3 5-3 4-3-4z"/><rect x="6.4" y="8" width="1.2" height="10"/></svg>
			<figure class="ghoroa-arch__frame"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/kitchen.jpg' ) ); ?>" alt="The Ghoroa dining room, warmly lit at dusk"/></figure>
		</div>
	</div>
</div>
<!-- /wp:group -->
