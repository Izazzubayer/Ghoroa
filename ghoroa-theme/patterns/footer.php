<?php
/**
 * Title: Footer
 * Slug: ghoroa/footer
 * Categories: ghoroa
 * Description: Site footer matching React Footer.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"className":"ghoroa-footer","style":{"spacing":{"padding":{"top":"var:preset|spacing|0","bottom":"var:preset|spacing|0"}}}} -->
<footer class="wp-block-group ghoroa-footer">
	<div class="ghoroa-footer__inner">
		<div class="ghoroa-footer__grid">
			<div class="ghoroa-footer__brand">
				<a href="/"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/logo-with-wordmark-dark.svg' ) ); ?>" alt="Ghoroa" class="ghoroa-footer__brand-logo" width="200" height="56"/></a>
				<p>Bangladeshi home cooking, served the way it was meant to be — unhurried, generous, and full of memory.</p>
			</div>
			<nav class="ghoroa-footer__cols" aria-label="Footer">
				<div class="ghoroa-footer__col">
					<h3>Explore</h3>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/about/">Our Story</a></li>
						<li><a href="/#feast">The Feast</a></li>
						<li><a href="/menu/">Menu</a></li>
					</ul>
				</div>
				<div class="ghoroa-footer__col">
					<h3>Visit</h3>
					<ul>
						<li><a href="/contact/">Reservations</a></li>
						<li><a href="https://wa.me/8801711223344">Order on WhatsApp</a></li>
						<li><a href="tel:+8801711223344">Call us</a></li>
					</ul>
				</div>
				<div class="ghoroa-footer__col">
					<h3>Legal</h3>
					<ul>
						<li><a href="/faq/">FAQ</a></li>
						<li><a href="/privacy-policy/">Privacy</a></li>
						<li><a href="/terms/">Terms</a></li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="ghoroa-footer__bottom">
			<p>© <?php echo (int) date( 'Y' ); ?> Ghoroa. All rights reserved.</p>
			<ul>
				<li><a href="https://instagram.com">Instagram</a></li>
				<li><a href="https://facebook.com">Facebook</a></li>
			</ul>
		</div>
	</div>
</footer>
<!-- /wp:group -->
