/**
 * Ghoroa Core — Admin JavaScript
 * Handles: status transitions, rider assignment, order auto-refresh, note saving.
 */

/* global ghoroaAdmin, jQuery */

(function ($) {
	'use strict';

	// ── Config ─────────────────────────────────────────────────────────────

	const { ajaxUrl, nonce, i18n } = ghoroaAdmin;
	const REFRESH_INTERVAL = 60 * 1000; // 60 seconds

	// ── Status transitions ──────────────────────────────────────────────────

	$(document).on('click', '.ghoroa-action-btn', function (e) {
		e.preventDefault();

		const $btn    = $(this);
		const orderId = $btn.data('order-id');
		const status  = $btn.data('status');

		if ($btn.hasClass('ghoroa-action-cancel')) {
			if (!window.confirm(i18n.confirmStatus)) return;
		}

		const originalText = $btn.text();
		$btn.addClass('ghoroa-loading').text(i18n.saving).prop('disabled', true);

		$.ajax({
			url: ajaxUrl,
			method: 'POST',
			data: {
				action:   'ghoroa_change_status',
				nonce:    nonce,
				order_id: orderId,
				status:   status,
			},
			success(res) {
				if (res.success) {
					const $row   = $btn.closest('.ghoroa-order-row');
					const $pill  = $row.find('.ghoroa-status-pill');

					// Update pill
					$pill.text(res.data.label);

					// Flash the row
					$row.addClass('ghoroa-row-updated');
					setTimeout(() => $row.removeClass('ghoroa-row-updated'), 2000);

					// For terminal statuses, dim the row action buttons
					const terminalStatuses = ['ghoroa-cancelled', 'ghoroa-rejected', 'ghoroa-delivered', 'ghoroa-completed'];
					if (terminalStatuses.includes(status)) {
						$row.find('.ghoroa-action-btn').remove();
					} else {
						$btn.text(originalText).prop('disabled', false).removeClass('ghoroa-loading');
					}

					// Refresh KPI counts
					updateKpiCounts();
				} else {
					showError($btn, originalText, res.data?.message || i18n.error);
				}
			},
			error() {
				showError($btn, originalText, i18n.error);
			},
		});
	});

	function showError($btn, originalText, message) {
		$btn.text(originalText).prop('disabled', false).removeClass('ghoroa-loading');
		alert(message);
	}

	// ── Rider assignment ────────────────────────────────────────────────────

	$(document).on('change', '.ghoroa-rider-select', function () {
		const $sel    = $(this);
		const orderId = $sel.data('order-id');
		const riderId = $sel.val();

		$.ajax({
			url: ajaxUrl,
			method: 'POST',
			data: {
				action:   'ghoroa_assign_rider',
				nonce:    nonce,
				order_id: orderId,
				rider_id: riderId,
			},
			success(res) {
				if (res.success) {
					// Brief visual confirmation
					$sel.css('border-color', '#6E7350');
					setTimeout(() => $sel.css('border-color', ''), 1500);
				}
			},
		});
	});

	// ── Note saving ─────────────────────────────────────────────────────────

	$(document).on('click', '.ghoroa-save-note-btn', function () {
		const $btn        = $(this);
		const $wrap       = $btn.closest('.ghoroa-note-wrap');
		const customerId  = $wrap.data('customer-id');
		const note        = $wrap.find('.ghoroa-note-field').val();
		const originalText = $btn.text();

		$btn.text(i18n.saving).prop('disabled', true);

		$.ajax({
			url: ajaxUrl,
			method: 'POST',
			data: {
				action:      'ghoroa_save_customer_note',
				nonce:       nonce,
				customer_id: customerId,
				note:        note,
			},
			success(res) {
				$btn.text(res.success ? i18n.saved : i18n.error).prop('disabled', false);
				setTimeout(() => $btn.text(originalText), 2000);
			},
			error() {
				$btn.text(i18n.error).prop('disabled', false);
				setTimeout(() => $btn.text(originalText), 2000);
			},
		});
	});

	// ── Auto-refresh ────────────────────────────────────────────────────────

	let refreshTimer = null;

	function startAutoRefresh() {
		if (!$('#ghoroa-orders-table').length) return;

		refreshTimer = setInterval(silentRefresh, REFRESH_INTERVAL);
	}

	function silentRefresh() {
		$.ajax({
			url: ajaxUrl,
			method: 'POST',
			data: {
				action: 'ghoroa_get_orders',
				nonce:  nonce,
			},
			success(res) {
				if (res.success) {
					// Update badge count
					$('#ghoroa-order-count').text(res.data.length);
					// For a full DOM update in Phase 2, we can re-render rows here
					// Phase 1: just flash a subtle indicator
					showRefreshIndicator();
				}
			},
		});
	}

	function showRefreshIndicator() {
		const $indicator = $('<span class="ghoroa-refresh-flash">●</span>');
		$indicator.css({
			position: 'fixed',
			bottom:   '20px',
			right:    '20px',
			fontSize: '20px',
			color:    '#6E7350',
			zIndex:   9999,
			opacity:  1,
			transition: 'opacity 1s ease',
		});
		$('body').append($indicator);
		setTimeout(() => $indicator.css('opacity', 0), 500);
		setTimeout(() => $indicator.remove(), 1500);
	}

	// Manual refresh button
	$(document).on('click', '#ghoroa-refresh-btn', function () {
		const $btn = $(this);
		$btn.addClass('ghoroa-loading');
		silentRefresh();
		setTimeout(() => $btn.removeClass('ghoroa-loading'), 1000);
	});

	// ── KPI count refresh ───────────────────────────────────────────────────

	function updateKpiCounts() {
		// Re-count from current DOM state (lightweight)
		const pending = $('.ghoroa-order-row[data-status*="new"], .ghoroa-order-row[data-status*="confirmed"], .ghoroa-order-row[data-status*="preparing"], .ghoroa-order-row[data-status*="ready"]').length;
		const delivering = $('.ghoroa-order-row[data-status="ghoroa-out-for-delivery"]').length;
		// These are live counts from the page — don't need AJAX for immediate feedback
		$('.ghoroa-kpi-pending .ghoroa-kpi-value').text(pending);
		$('.ghoroa-kpi-delivering .ghoroa-kpi-value').text(delivering);
	}

	// ── Availability quick-toggle (from product list column) ────────────────

	$(document).on('click', '.ghoroa-toggle-availability', function (e) {
		e.preventDefault();
		const $btn      = $(this);
		const productId = $btn.data('product-id');

		$.ajax({
			url: ajaxUrl,
			method: 'POST',
			data: {
				action:     'ghoroa_toggle_availability',
				nonce:      nonce,
				product_id: productId,
			},
			success(res) {
				if (res.success) {
					const isAvail = res.data.available === 'yes';
					$btn.closest('td').find('.ghoroa-avail-indicator')
						.text(isAvail ? '✓ Yes' : '✗ No')
						.css('color', isAvail ? '#6E7350' : '#A8461E');
				}
			},
		});
	});

	// ── Row highlight animation ─────────────────────────────────────────────

	if (!document.getElementById('ghoroa-row-style')) {
		const style = document.createElement('style');
		style.id    = 'ghoroa-row-style';
		style.textContent = `
			@keyframes ghoroaRowFlash {
				from { background: rgba(168,70,30,0.12); }
				to   { background: transparent; }
			}
			.ghoroa-row-updated td { animation: ghoroaRowFlash 1.5s ease forwards; }
		`;
		document.head.appendChild(style);
	}

	// ── Init ─────────────────────────────────────────────────────────────────

	$(function () {
		startAutoRefresh();
	});

})(jQuery);
