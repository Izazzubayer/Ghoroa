<?php
/**
 * Title: Reserve
 * Slug: ghoroa/reserve
 * Categories: ghoroa
 * Description: Reservations CTA matching React Reserve.
 *
 * @package ghoroa
 */

?>
<!-- wp:group {"className":"ghoroa-reserve","style":{"spacing":{"padding":{"top":"var:preset|spacing|0","bottom":"var:preset|spacing|0"}}}} -->
<div class="wp-block-group ghoroa-reserve">
	<svg class="ghoroa-reserve__svg" aria-hidden viewBox="0 0 760 420" fill="none">
		<?php for ( $i = 0; $i < 4; $i++ ) : ?>
			<?php
			$path = sprintf(
				'M%d 420V%d a%d %d 0 0 1 %d 0V420',
				(int) ( 80 + $i * 52 ),
				(int) ( 200 - $i * 34 ),
				(int) ( 300 - $i * 52 ),
				(int) ( 300 - $i * 52 ),
				(int) ( 600 - $i * 104 )
			);
			?>
			<path d="<?php echo esc_attr( $path ); ?>" stroke="currentColor" stroke-width="1" opacity="<?php echo esc_attr( (string) ( 1 - $i * 0.2 ) ); ?>" />
		<?php endfor; ?>
	</svg>
	<div class="ghoroa-reserve__inner">
		<p class="ghoroa-eyebrow">Reservations</p>
		<h2 class="ghoroa-reserve__title">Join us at the table.</h2>
		<p class="ghoroa-reserve__body">Whether it's a quiet dinner or a family gathering, we'll keep a seat warm. Call ahead for parties of six or more.</p>
		<div class="ghoroa-hero__meta" style="justify-content:center">
			<a class="ghoroa-btn" href="tel:+8801711223344">Call to reserve</a>
			<a class="ghoroa-eyebrow" href="https://wa.me/8801711223344" style="font-size:0.7rem;color:var(--wp--preset--color--cream);text-decoration:none;border:1px solid color-mix(in srgb, var(--wp--preset--color--cream) 30%, transparent);padding:0.75rem 1.5rem">Order on WhatsApp</a>
		</div>
		<dl class="ghoroa-reserve__grid">
			<div>
				<dt>Hours</dt>
				<dd>Daily · 12:00 – 23:00</dd>
			</div>
			<div>
				<dt>Call</dt>
				<dd>+880 1711 223344</dd>
			</div>
			<div>
				<dt>Find us</dt>
				<dd>Gulshan 2, Dhaka</dd>
			</div>
		</dl>
	</div>
</div>
<!-- /wp:group -->
