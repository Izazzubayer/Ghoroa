/**
 * Ghoroa front-end interactions.
 *
 * - Fixed dark header that solidifies on scroll.
 * - Mobile nav toggle.
 * - FAQ accordion (aria-expanded / inert).
 *
 * No build step. Plain JS against the DOM.
 */
( function () {
	'use strict';

	function setupNav() {
		var header = document.querySelector( '.ghoroa-header' );
		if ( ! header ) return;

		// Mobile nav is not a WordPress block — inject from theme.js so the CSS matches.
		var navList = document.querySelector( '.ghoroa-nav' );
		var mobileNav = document.querySelector( '.ghoroa-nav__mobile' );
		if ( ! navList || ! mobileNav ) {
			// Inject a mobile sheet for the five IA links.
			var links = [
				{ href: '/', label: 'Home' },
				{ href: '/menu/', label: 'Menu' },
				{ href: '/about/', label: 'About' },
				{ href: '/locations/', label: 'Locations' },
				{ href: '/contact/', label: 'Contact' },
			];
			mobileNav = document.createElement( 'div' );
			mobileNav.className = 'ghoroa-nav__mobile';
			mobileNav.innerHTML =
				'<nav aria-label="Mobile"><ul class="ghoroa-nav ghoroa-nav__list">' +
				links
					.map( function ( l ) {
						return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
					} )
					.join( '' ) +
				'</ul></nav>';
			header.appendChild( mobileNav );
			// Insert a hamburger after the nav.
			var toggle = document.createElement( 'button' );
			toggle.type = 'button';
			toggle.className = 'ghoroa-mobile-toggle';
			toggle.setAttribute( 'aria-expanded', 'false' );
			toggle.setAttribute( 'aria-label', 'Open menu' );
			toggle.innerHTML = '<span aria-hidden="true">☰</span>';
			header.querySelector( '.ghoroa-header__inner' ).appendChild( toggle );
		}

		var toggle = document.querySelector( '.ghoroa-mobile-toggle' );
		var mobile = document.querySelector( '.ghoroa-nav__mobile' );

		function setSolid() {
			var y = window.scrollY || window.pageYOffset;
			header.classList.toggle( 'is-scrolled', y > 40 );
		}
		setSolid();
		window.addEventListener( 'scroll', setSolid, { passive: true } );

		if ( ! toggle || ! mobile ) return;

		toggle.addEventListener( 'click', function () {
			mobile.classList.toggle( 'is-open' );
			header.classList.toggle( 'is-open', mobile.classList.contains( 'is-open' ) );
			toggle.setAttribute( 'aria-expanded', mobile.classList.contains( 'is-open' ) ? 'true' : 'false' );
		} );

		mobile.querySelectorAll( 'a' ).forEach( function ( link ) {
			link.addEventListener( 'click', function () {
				mobile.classList.remove( 'is-open' );
				header.classList.remove( 'is-open' );
				toggle.setAttribute( 'aria-expanded', 'false' );
			} );
		} );
	}

	function setupFaq() {
		var root = document.querySelector( '.ghoroa-faq' );
		if ( ! root ) return;

		root.querySelectorAll( '.ghoroa-faq__item button' ).forEach( function ( btn ) {
			btn.addEventListener( 'click', function () {
				var item = btn.closest( '.ghoroa-faq__item' );
				var open = item.classList.contains( 'is-open' );
				root.querySelectorAll( '.ghoroa-faq__item' ).forEach( function ( el ) {
					el.classList.remove( 'is-open' );
					el.querySelector( 'button' ).setAttribute( 'aria-expanded', 'false' );
				} );
				if ( ! open ) {
					item.classList.add( 'is-open' );
					btn.setAttribute( 'aria-expanded', 'true' );
				}
			} );
		} );
	}

	function init() {
		setupNav();
		setupFaq();
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
