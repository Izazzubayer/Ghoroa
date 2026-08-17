/**
 * Ghoroa Web Application — Slide-over Cart Drawer Component
 * Automatically mounts a slide-over cart panel on any page.
 */

(function () {
    'use strict';

    function injectCartDrawerHTML() {
        if (document.getElementById('ghoroaCartDrawer')) return;

        const drawerHTML = `
        <!-- Cart Drawer Backdrop -->
        <div id="cartBackdrop" class="fixed inset-0 bg-g-espresso/60 z-[90] opacity-0 pointer-events-none transition-opacity duration-300"></div>

        <!-- Cart Slide-Over Panel -->
        <div id="ghoroaCartDrawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-[#FBF6EE] z-[100] translate-x-full transition-transform duration-300 ease-out shadow-2xl flex flex-col border-l border-g-brass/20">
            <!-- Header -->
            <div class="p-6 bg-g-espresso text-g-sand flex justify-between items-center border-b border-g-brass/20">
                <div class="flex items-center gap-3">
                    <i class="ph ph-shopping-bag text-2xl text-g-clay"></i>
                    <h3 class="text-xl font-fraunces">
                        <span class="lang-en">Your Cart</span>
                        <span class="lang-bn">আপনার কার্ট</span>
                    </h3>
                </div>
                <button id="closeCartBtn" class="w-8 h-8 rounded-full bg-g-sand/10 hover:bg-g-sand/20 flex items-center justify-center text-g-sand transition-colors">
                    <i class="ph ph-x text-lg"></i>
                </button>
            </div>

            <!-- Items List -->
            <div id="cartItemsList" class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-g-espresso/10">
                <!-- Injected via JS -->
            </div>

            <!-- Footer Summary -->
            <div class="p-6 bg-g-sand/40 border-t border-g-espresso/10 space-y-4">
                <div class="flex justify-between items-center text-g-espresso font-fraunces text-xl">
                    <span>
                        <span class="lang-en">Subtotal</span>
                        <span class="lang-bn">উপমোট</span>
                    </span>
                    <span id="cartSubtotalVal" class="text-g-rust font-bold">৳0</span>
                </div>
                <p class="text-xs text-g-espresso/60 italic">
                    <span class="lang-en">Delivery fees calculated at checkout based on area.</span>
                    <span class="lang-bn">চেকআউটে এলাকা নির্বাচন অনুযায়ী ডেলিভারি চার্জ যোগ হবে।</span>
                </p>
                <a id="cartCheckoutBtn" href="checkout.html" class="block w-full text-center bg-g-rust text-white py-3.5 rounded-md font-semibold text-lg hover:bg-orange-800 transition-colors shadow-md">
                    <span class="lang-en">Proceed to Checkout</span>
                    <span class="lang-bn">অর্ডার সম্পন্ন করুন</span>
                </a>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }

    function renderCartDrawer() {
        const cart = window.GhoroaState.getCart();
        const listContainer = document.getElementById('cartItemsList');
        const subtotalEl = document.getElementById('cartSubtotalVal');
        const countBadges = document.querySelectorAll('.cart-count-badge');

        // Update count badges
        const count = window.GhoroaState.getCartCount();
        countBadges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        });

        if (!listContainer) return;

        if (cart.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-16 text-g-espresso/60 space-y-3">
                    <i class="ph ph-basket text-5xl text-g-clay"></i>
                    <p class="font-fraunces text-lg">
                        <span class="lang-en">Your cart is empty</span>
                        <span class="lang-bn">আপনার কার্ট খালি</span>
                    </p>
                    <a href="menu.html" class="inline-block text-g-rust underline text-sm">
                        <span class="lang-en">Browse our delicious menu</span>
                        <span class="lang-bn">আমাদের মেনু দেখুন</span>
                    </a>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = '৳0';
            return;
        }

        let html = '';
        cart.forEach(item => {
            html += `
                <div class="pt-4 first:pt-0 flex items-center gap-4">
                    <img src="${item.image}" alt="${item.name_en}" class="w-16 h-16 rounded-md object-cover border border-g-brass/20">
                    <div class="flex-1">
                        <h4 class="font-fraunces text-base text-g-espresso">
                            <span class="lang-en">${item.name_en}</span>
                            <span class="lang-bn">${item.name_bn}</span>
                        </h4>
                        <div class="text-g-rust font-semibold text-sm">৳${item.price}</div>
                    </div>
                    <div class="flex items-center gap-2 border border-g-espresso/20 rounded-md p-1 bg-white">
                        <button class="cart-minus-btn w-6 h-6 flex items-center justify-center text-g-espresso hover:bg-g-sand rounded" data-id="${item.id}">-</button>
                        <span class="text-sm font-semibold w-4 text-center">${item.qty}</span>
                        <button class="cart-plus-btn w-6 h-6 flex items-center justify-center text-g-espresso hover:bg-g-sand rounded" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = html;
        if (subtotalEl) subtotalEl.textContent = '৳' + window.GhoroaState.getCartSubtotal();
    }

    function toggleCartDrawer(open) {
        const drawer = document.getElementById('ghoroaCartDrawer');
        const backdrop = document.getElementById('cartBackdrop');
        if (!drawer || !backdrop) return;

        if (open) {
            drawer.classList.remove('translate-x-full');
            backdrop.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            drawer.classList.add('translate-x-full');
            backdrop.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    // Attach Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
        injectCartDrawerHTML();
        renderCartDrawer();

        // Listen for global store updates
        window.addEventListener('ghoroa_cart_updated', renderCartDrawer);

        // Click handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('#openCartBtn') || e.target.closest('.open-cart-trigger')) {
                e.preventDefault();
                toggleCartDrawer(true);
            }
            if (e.target.closest('#closeCartBtn') || e.target.id === 'cartBackdrop') {
                toggleCartDrawer(false);
            }
            if (e.target.closest('.cart-plus-btn')) {
                const id = e.target.closest('.cart-plus-btn').dataset.id;
                window.GhoroaState.updateCartQty(id, 1);
            }
            if (e.target.closest('.cart-minus-btn')) {
                const id = e.target.closest('.cart-minus-btn').dataset.id;
                window.GhoroaState.updateCartQty(id, -1);
            }
            if (e.target.closest('.add-to-cart-btn')) {
                const id = e.target.closest('.add-to-cart-btn').dataset.id;
                window.GhoroaState.addToCart(id);
                toggleCartDrawer(true);
            }
        });
    });

})();
