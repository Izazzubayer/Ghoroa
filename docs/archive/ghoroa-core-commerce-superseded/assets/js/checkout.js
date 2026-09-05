/**
 * Ghoroa Core — Checkout JavaScript
 * Handles: fulfillment type toggle, area/fee display, cache-safe nonce fetch.
 */

/* global ghoroaCheckout, jQuery */

(function ($) {
	'use strict';

	const { ajaxUrl, restUrl, currency, i18n } = ghoroaCheckout;

	// ── Fulfillment type toggle ─────────────────────────────────────────────

	function initFulfillmentToggle() {
		const $select    = $('#ghoroa_fulfillment_type');
		const $addrFields = $('#ghoroa-delivery-address-fields');

		if (!$select.length) return;

		function toggleAddressFields(val) {
			if (val === 'pickup') {
				$addrFields.addClass('ghoroa-hidden');
				$addrFields.find('select, input, textarea').prop('required', false);
			} else {
				$addrFields.removeClass('ghoroa-hidden');
			}
		}

		// Initial state
		toggleAddressFields($select.val());

		$select.on('change', function () {
			toggleAddressFields($(this).val());
			updateDeliveryFeeDisplay();
		});
	}

	// ── Area change → show delivery fee note ───────────────────────────────

	function initAreaFeeDisplay() {
		const $areaSelect = $('#ghoroa_delivery_area');
		if (!$areaSelect.length) return;

		// Fetch zones from REST endpoint
		$.getJSON(restUrl + '/zones', function (zones) {
			$areaSelect.on('change', function () {
				const selectedKey = $(this).val();
				const zone        = zones.find(z => slugify(z.name) === selectedKey);

				let $note = $('#ghoroa-delivery-fee-note');
				if (!$note.length) {
					$note = $('<p id="ghoroa-delivery-fee-note"></p>').insertAfter($areaSelect);
				}

				if (zone && zone.fee > 0) {
					$note.text('Delivery fee for this area: ৳' + zone.fee);
				} else if (zone && zone.fee === 0) {
					$note.text(i18n.free + ' ' + i18n.deliveryFee);
				} else {
					$note.text('');
				}
			});
		});
	}

	function updateDeliveryFeeDisplay() {
		const $select = $('#ghoroa_fulfillment_type');
		const $note   = $('#ghoroa-delivery-fee-note');
		if ($select.val() === 'pickup' && $note.length) {
			$note.text('');
		}
	}

	// ── Simple slugify (matches PHP sanitize_key) ──────────────────────────

	function slugify(str) {
		return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	}

	// ── Cache-safe nonce retrieval ─────────────────────────────────────────
	// WooCommerce normally injects nonces into cached HTML; we fetch them
	// fresh from a REST endpoint that's excluded from full-page cache.

	function refreshNonce() {
		if (!window.wc_checkout_params) return;

		$.getJSON(restUrl + '/nonce', function (data) {
			if (data && data.nonce) {
				// Update the global nonce WooCommerce uses for AJAX calls
				wc_checkout_params.nonce = data.nonce;
			}
		});
	}

	// ── Init ─────────────────────────────────────────────────────────────────

	$(function () {
		initFulfillmentToggle();
		initAreaFeeDisplay();

		// Refresh nonce once on page load to handle cached pages
		refreshNonce();

		// Phone number formatting hint (not enforced — server validates)
		$('#billing_phone').on('blur', function () {
			const val = $(this).val().replace(/\s+/g, '');
			if (val.length > 0 && !val.startsWith('+880') && !val.startsWith('01')) {
				// Subtle hint only — not an error
				$(this).css('border-color', '#A9824E');
			} else {
				$(this).css('border-color', '');
			}
		});
	});

})(jQuery);
