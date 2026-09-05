/**
 * Ghoroa Web Application — Shared App State & Store
 * Populated with 100% authentic transcribed menu data from Ghoroa Hotel & Restaurant.
 */

(function (window) {
    'use strict';

    const ZONES = [
        { id: 'dhanmondi', name_en: 'Dhanmondi (1-32)', name_bn: 'ধানমন্ডি (১-৩২)', fee: 60 },
        { id: 'gulshan', name_en: 'Gulshan 1 & 2', name_bn: 'গুলশান ১ ও ২', fee: 80 },
        { id: 'banani', name_en: 'Banani & DOHS', name_bn: 'বনানী ও ডিওএইচএস', fee: 80 },
        { id: 'mohammadpur', name_en: 'Mohammadpur & Japan Garden', name_bn: 'মোহাম্মদপুর ও জাপান গার্ডেন', fee: 60 },
        { id: 'mirpur', name_en: 'Mirpur (1, 2, 10, 11, 12)', name_bn: 'মিরপুর (১, ২, ১০, ১১, ১২)', fee: 70 }
    ];

    const REAL_GhoroaProducts = [
        // ── 1. BREAKFAST (সকালের নাস্তা) ──────────────────────────────────────
        {
            id: 'bf-1',
            name_en: 'Chicken Bhuna Khichuri',
            name_bn: 'চিকেন ভুনা খিচুড়ি',
            category: 'breakfast',
            takeaway: 300,
            eatin: 330,
            price: 300,
            image: 'assets/images/dish_3.png',
            desc_en: 'Aromatic khichuri served with rich chicken bhuna.',
            desc_bn: 'সুগন্ধি চাল ও ডালের ভুনা খিচুড়ির সাথে তুলতুলে মুরগির মাংস।',
            available: true
        },
        {
            id: 'bf-2',
            name_en: 'Chicken Leg Khichuri',
            name_bn: 'চিকেন লেগ খিচুড়ি',
            category: 'breakfast',
            takeaway: 280,
            eatin: 300,
            price: 280,
            image: 'assets/images/dish_1.png',
            desc_en: 'Special breakfast khichuri with fried chicken leg quarter.',
            desc_bn: 'ভাজা চিকেন লেগ কোয়ার্টার সহ গরম গরম খিচুড়ি।',
            available: true
        },
        {
            id: 'bf-3',
            name_en: 'Chicken Khichuri',
            name_bn: 'চিকেন খিচুড়ি',
            category: 'breakfast',
            takeaway: 200,
            eatin: 280,
            price: 200,
            image: 'assets/images/dish_3.png',
            desc_en: 'Traditional home-style chicken khichuri.',
            desc_bn: 'ঐতিহ্যবাহী ঘরোয়া চিকেন খিচুড়ি।',
            available: true
        },
        {
            id: 'bf-4',
            name_en: 'Parota',
            name_bn: 'পরোটা',
            category: 'breakfast',
            takeaway: 15,
            eatin: 20,
            price: 15,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Crispy layered flatbread.',
            desc_bn: 'মুচমুচে গরম পরোটা।',
            available: true
        },
        {
            id: 'bf-5',
            name_en: 'Vegetable Parota',
            name_bn: 'সবজি পরোটা',
            category: 'breakfast',
            takeaway: 15,
            eatin: 20,
            price: 15,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Flatbread stuffed with spiced seasonal vegetables.',
            desc_bn: 'সবজি পুর দেওয়া গরম পরোটা।',
            available: true
        },
        {
            id: 'bf-6',
            name_en: 'Special Dal',
            name_bn: 'বিশেষ ডাল',
            category: 'breakfast',
            takeaway: 30,
            eatin: 30,
            price: 30,
            image: 'assets/images/hero_bg.png',
            desc_en: 'Tempered lentil soup with spices and ghee.',
            desc_bn: 'বাগাড় দেওয়া ঘন মসুর ডাল।',
            available: true
        },
        {
            id: 'bf-7',
            name_en: 'Mixed Vegetables',
            name_bn: 'মিক্সড সবজি ভাজি',
            category: 'breakfast',
            takeaway: 30,
            eatin: 30,
            price: 30,
            image: 'assets/images/hero_bg.png',
            desc_en: 'Sautéed seasonal garden vegetables.',
            desc_bn: 'তাজা মরশুমি সবজি ভাজি।',
            available: true
        },
        {
            id: 'bf-8',
            name_en: 'Egg Fry / Poach',
            name_bn: 'ডিম ভাজি / পোচ',
            category: 'breakfast',
            takeaway: 30,
            eatin: 30,
            price: 30,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Pan-fried egg with onions and green chilies.',
            desc_bn: 'পেঁয়াজ-মরিচ দিয়ে মচমচে ডিম ভাজি।',
            available: true
        },
        {
            id: 'bf-9',
            name_en: 'Beef Bhuna',
            name_bn: 'গরুর ভুনা',
            category: 'breakfast',
            takeaway: 270,
            eatin: 320,
            price: 270,
            image: 'assets/images/dish_1.png',
            desc_en: 'Slow-cooked spiced beef gravy.',
            desc_bn: 'ধীর আঁচে রান্না করা মশলাদার গরুর মাংস।',
            available: true
        },
        {
            id: 'bf-10',
            name_en: 'Beef Kala Bhuna',
            name_bn: 'গরুর কালা ভুনা',
            category: 'breakfast',
            takeaway: 100,
            eatin: 160,
            price: 100,
            image: 'assets/images/dish_1.png',
            desc_en: 'Traditional Chittagong style dark roasted beef.',
            desc_bn: 'ঐতিহ্যবাহী চাটগাঁইয়া স্বাদের গরুর কালা ভুনা।',
            available: true
        },
        {
            id: 'bf-11',
            name_en: 'Chicken Kebab Fry',
            name_bn: 'চিকেন কাবাব ফ্রাই',
            category: 'breakfast',
            takeaway: 170,
            eatin: 200,
            price: 170,
            image: 'assets/images/dish_2.png',
            desc_en: 'Shallow fried marinated chicken kebab pieces.',
            desc_bn: 'মশলাদার তেলে ভাজা চিকেন কাবাব।',
            available: true
        },
        {
            id: 'bf-12',
            name_en: 'Singara / Samosa',
            name_bn: 'সিঙ্গাড়া / সমুচা',
            category: 'breakfast',
            takeaway: 15,
            eatin: 20,
            price: 15,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Crispy fried Bengali snack filled with potatoes & spices.',
            desc_bn: 'মচমচে সিঙ্গাড়া বা সমুচা।',
            available: true
        },

        // ── 2. LUNCH & DINNER MAINS (দুপুরের ও রাতের খাবার) ───────────────────
        {
            id: 'ln-1',
            name_en: 'Beef Bhuna Khichuri',
            name_bn: 'গরুর ভুনা খিচুড়ি',
            category: 'mains',
            takeaway: 300,
            eatin: 300,
            price: 300,
            image: 'assets/images/dish_1.png',
            desc_en: 'Ghoroa signature spiced bhuna khichuri served with rich beef bhuna.',
            desc_bn: 'ঘরোয়ার সিগনেচার ভুনা খিচুড়ির সাথে ঝাল ঝাল গরুর মাংস।',
            available: true
        },
        {
            id: 'ln-2',
            name_en: 'Kacchi Biryani',
            name_bn: 'কাচ্চি বিরিয়ানি',
            category: 'mains',
            takeaway: 300,
            eatin: 300,
            price: 300,
            image: 'assets/images/dish_3.png',
            desc_en: 'Famous Old Dhaka style kacchi biryani with tender mutton & potatoes.',
            desc_bn: 'পুরান ঢাকার বিখ্যাত নরম খাসির মাংস ও আলু দিয়ে তৈরি কাচ্চি বিরিয়ানি।',
            available: true
        },
        {
            id: 'ln-3',
            name_en: 'Chicken Biryani',
            name_bn: 'চিকেন বিরিয়ানি',
            category: 'mains',
            takeaway: 200,
            eatin: 260,
            price: 200,
            image: 'assets/images/dish_3.png',
            desc_en: 'Fragrant basmati rice cooked with succulent chicken.',
            desc_bn: 'সুগন্ধি চাল ও রসালো মুরগির মাংসের ঐতিহ্যবাহী বিরিয়ানি।',
            available: true
        },
        {
            id: 'ln-4',
            name_en: 'Beef Tehari',
            name_bn: 'গরুর তেহারি',
            category: 'mains',
            takeaway: 100,
            eatin: 125,
            price: 100,
            image: 'assets/images/hero_bg.png',
            desc_en: 'Mustard oil infused small-cut beef tehari cooked with green chilies.',
            desc_bn: 'খাটি সরিষার তেলে কাঁচা মরিচ দিয়ে রান্না করা গরুর তেহারি।',
            available: true
        },
        {
            id: 'ln-5',
            name_en: 'Beef Rezala',
            name_bn: 'গরুর রেজালা',
            category: 'mains',
            takeaway: 280,
            eatin: 330,
            price: 280,
            image: 'assets/images/dish_1.png',
            desc_en: 'Rich Mughlai curry cooked with yogurt and spices.',
            desc_bn: 'দই ও মিষ্টি মশলায় তৈরি রাজকীয় গরুর রেজালা।',
            available: true
        },
        {
            id: 'ln-6',
            name_en: 'Chicken Roast',
            name_bn: 'চিকেন রোস্ট',
            category: 'mains',
            takeaway: 170,
            eatin: 180,
            price: 170,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Golden fried chicken leg quarter simmered in thick onion & cashew gravy.',
            desc_bn: 'ঘন ক্ষীর ও বেরেস্তার ঝোলে সেদ্ধ করা শাহী চিকেন রোস্ট।',
            available: true
        },
        {
            id: 'ln-7',
            name_en: 'Beef Leg Roast',
            name_bn: 'গরুর লেগ রোস্ট / চাপ',
            category: 'mains',
            takeaway: 400,
            eatin: 500,
            price: 400,
            image: 'assets/images/dish_1.png',
            desc_en: 'Slow-roasted beef shank with rich spiced brown gravy.',
            desc_bn: 'ধীর আঁচে সেদ্ধ করা গরুর লেগ রোস্ট।',
            available: true
        },
        {
            id: 'ln-8',
            name_en: 'Beef Brain Fry (Mogoj)',
            name_bn: 'গরুর মগজ ফ্রাই',
            category: 'mains',
            takeaway: 400,
            eatin: 450,
            price: 400,
            image: 'assets/images/dish_2.png',
            desc_en: 'Richly spiced, scrambled beef brain cooked with onions and green chilies.',
            desc_bn: 'পেঁয়াজ ও মশলায় ভাজা সুস্বাদু গরুর মগজ।',
            available: true
        },
        {
            id: 'ln-9',
            name_en: 'Chicken Mosallam',
            name_bn: 'চিকেন মোসাল্লাম',
            category: 'mains',
            takeaway: 270,
            eatin: 320,
            price: 270,
            image: 'assets/images/dish_2.png',
            desc_en: 'Traditional whole chicken cooked in rich gravy.',
            desc_bn: 'ঐতিহ্যবাহী মশলাদার চিকেন মোসাল্লাম।',
            available: true
        },

        // ── 3. KEBABS, GRILLS & BREADS (কাবাব, তন্দুর ও নান) ─────────────────
        {
            id: 'kb-1',
            name_en: 'Grill Chicken (Quarter)',
            name_bn: 'গ্রিল চিকেন (কোয়ার্টার)',
            category: 'kebabs',
            takeaway: 150,
            eatin: 250,
            price: 150,
            image: 'assets/images/dish_2.png',
            desc_en: 'Charcoal grilled marinated chicken served with garlic sauce.',
            desc_bn: 'কয়লায় পোড়ানো মশলাদার গ্রিল চিকেন।',
            available: true
        },
        {
            id: 'kb-2',
            name_en: 'Beef Sheek Kebab',
            name_bn: 'গরুর শিক কাবাব',
            category: 'kebabs',
            takeaway: 180,
            eatin: 210,
            price: 180,
            image: 'assets/images/dish_1.png',
            desc_en: 'Minced beef marinated in roasted spices, grilled on skewers.',
            desc_bn: 'শিক পোড়ানো তুলতুলে গরুর মাংসের জুসি কাবাব।',
            available: true
        },
        {
            id: 'kb-3',
            name_en: 'Chicken Tikka Kebab',
            name_bn: 'চিকেন টিক্কা কাবাব',
            category: 'kebabs',
            takeaway: 220,
            eatin: 260,
            price: 220,
            image: 'assets/images/dish_2.png',
            desc_en: 'Boneless chicken cubes marinated in spicy yogurt and clay-oven baked.',
            desc_bn: 'তন্দুরে পোড়ানো মশলাদার চিকেন টিক্কা।',
            available: true
        },
        {
            id: 'kb-4',
            name_en: 'Gharoa Special Naan',
            name_bn: 'ঘরোয়া স্পেশাল নান',
            category: 'kebabs',
            takeaway: 70,
            eatin: 80,
            price: 70,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Soft, fluffy tandoori flatbread brushed with ghee.',
            desc_bn: 'তন্দুরে সেঁকা তুলতুলে নরম স্পেশাল নান।',
            available: true
        },
        {
            id: 'kb-5',
            name_en: 'Garlic Naan',
            name_bn: 'গার্লিক নান',
            category: 'kebabs',
            takeaway: 80,
            eatin: 100,
            price: 80,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Clay-oven baked naan brushed with garlic butter.',
            desc_bn: 'রসুন ও মাখন মাখানো গরম গার্লিক নান।',
            available: true
        },
        {
            id: 'kb-6',
            name_en: 'Garlic Cheese Naan',
            name_bn: 'গার্লিক চিজ নান',
            category: 'kebabs',
            takeaway: 80,
            eatin: 100,
            price: 80,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Freshly baked naan stuffed with melted cheese and minced garlic.',
            desc_bn: 'রসুন ও গলা চিজ ভরা সুস্বাদু নান।',
            available: true
        },
        {
            id: 'kb-7',
            name_en: 'Stuffed Naan',
            name_bn: 'স্টাফড নান',
            category: 'kebabs',
            takeaway: 100,
            eatin: 125,
            price: 100,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Tandoori naan stuffed with spicy potato & paneer filling.',
            desc_bn: 'মশলাদার পুর ভরা গরম স্টাফড নান।',
            available: true
        },

        // ── 4. DESSERTS & BEVERAGES (মিষ্টি ও পানীয়) ──────────────────────────
        {
            id: 'ds-1',
            name_en: 'Shahi Borhani (1 Litre)',
            name_bn: 'শাহী বোরহানি (১ লিটার)',
            category: 'desserts',
            takeaway: 200,
            eatin: 230,
            price: 200,
            image: 'assets/images/hero_bg.png',
            desc_en: 'Traditional yogurt drink blended with mint, mustard seeds, and spices.',
            desc_bn: 'পাচক মশলা ও টকদই দিয়ে তৈরি ঐতিহ্যবাহী বোরহানি।',
            available: true
        },
        {
            id: 'ds-2',
            name_en: 'Shahi Zafrani Firni',
            name_bn: 'শাহী জাফরানী ফিরনি',
            category: 'desserts',
            takeaway: 50,
            eatin: 60,
            price: 50,
            image: 'assets/images/feature_arch.png',
            desc_en: 'Rich clay-pot rice pudding garnished with saffron & nuts.',
            desc_bn: 'মাটির পাত্রে জমানো শাহী জাফরানি ফিরনি।',
            available: true
        },
        {
            id: 'ds-3',
            name_en: 'Special Royal Faluda',
            name_bn: 'স্পেশাল রয়্যাল ফালুদা',
            category: 'desserts',
            takeaway: 150,
            eatin: 180,
            price: 150,
            image: 'assets/images/dish_2.png',
            desc_en: 'Layered chilled dessert with ice cream, vermicelli, jelly, and nuts.',
            desc_bn: 'আইসক্রিম, নুডুলস, জেলি ও ড্রাই ফ্রুটস সমৃদ্ধ ঠাণ্ডা ফালুদা।',
            available: true
        },
        {
            id: 'ds-4',
            name_en: 'Sweet Lassi / Labang',
            name_bn: 'মিষ্টি লাচ্ছি / লাবাং',
            category: 'desserts',
            takeaway: 90,
            eatin: 90,
            price: 90,
            image: 'assets/images/hero_bg.png',
            desc_en: 'Chilled sweet yogurt drink.',
            desc_bn: 'ঠাণ্ডা মিষ্টি লাচ্ছি বা ঐতিহ্যবাহী লাবাং।',
            available: true
        },

        // ── 5. TK 200 FLOWER RICE (টাকা ২০০ ফুলের ভুনা) ──────────────────────
        {
            id: 'fl-1',
            name_en: 'Egg Bhuna Flower Rice',
            name_bn: 'ডিম ভুনা ফুলের ভাত',
            category: 'flower_rice',
            takeaway: 200,
            eatin: 200,
            price: 200,
            image: 'assets/images/dish_3.png',
            desc_en: 'Special aromatic flower rice served with spicy egg bhuna.',
            desc_bn: 'সুগন্ধি চালের ফুলের ভাতের সাথে ঝাল ডিম ভুনা।',
            available: true
        },
        {
            id: 'fl-2',
            name_en: 'Mutton Bhuna Flower Rice',
            name_bn: 'খাসির ভুনা ফুলের ভাত',
            category: 'flower_rice',
            takeaway: 200,
            eatin: 200,
            price: 200,
            image: 'assets/images/dish_3.png',
            desc_en: 'Special flower rice served with tender mutton bhuna.',
            desc_bn: 'ফুলের ভাতের সাথে তুলতুলে খাসির ভুনা।',
            available: true
        },
        {
            id: 'fl-3',
            name_en: 'Beef Bhuna Flower Rice',
            name_bn: 'গরুর ভুনা ফুলের ভাত',
            category: 'flower_rice',
            takeaway: 200,
            eatin: 200,
            price: 200,
            image: 'assets/images/dish_1.png',
            desc_en: 'Special flower rice served with rich spicy beef bhuna.',
            desc_bn: 'ফুলের ভাতের সাথে মশলাদার গরুর মাংস ভুনা।',
            available: true
        },
        {
            id: 'fl-4',
            name_en: 'Shrimp Bhuna Flower Rice',
            name_bn: 'চিংড়ি ভুনা ফুলের ভাত',
            category: 'flower_rice',
            takeaway: 200,
            eatin: 200,
            price: 200,
            image: 'assets/images/dish_2.png',
            desc_en: 'Special flower rice served with spicy prawn curry.',
            desc_bn: 'ফুলের ভাতের সাথে ঝাল চিংড়ি ভুনা।',
            available: true
        },
        {
            id: 'fl-5',
            name_en: 'Country Chicken Bhuna',
            name_bn: 'দেশি মুরগি ভুনা',
            category: 'flower_rice',
            takeaway: 100,
            eatin: 120,
            price: 100,
            image: 'assets/images/dish_1.png',
            desc_en: 'Traditional free-range country chicken curry.',
            desc_bn: 'ঐতিহ্যবাহী দেশি মুরগি ভুনা।',
            available: true
        }
    ];

    const SEEDED_ORDERS = [
        {
            id: 'GH-4401',
            date: 'Today, 19:42',
            customer: { name: 'Tamjid Hossain', phone: '+880 1711 000111', address: 'House 14, Road 5', area: 'dhanmondi' },
            items: [
                { name_en: 'Kacchi Biryani', qty: 2, price: 300 },
                { name_en: 'Shahi Borhani (1 Litre)', qty: 1, price: 200 }
            ],
            total: 860,
            fulfillment: 'delivery',
            deliveryFee: 60,
            status: 'ghoroa-out-for-delivery',
            rider: 'Md. Faisal'
        },
        {
            id: 'GH-4402',
            date: 'Today, 20:05',
            customer: { name: 'Nusrat Jahan', phone: '+880 1819 222333', address: 'Flat 4B, Road 11', area: 'banani' },
            items: [
                { name_en: 'Beef Bhuna Khichuri', qty: 1, price: 300 },
                { name_en: 'Beef Kala Bhuna', qty: 1, price: 100 }
            ],
            total: 480,
            fulfillment: 'delivery',
            deliveryFee: 80,
            status: 'ghoroa-preparing',
            rider: 'Unassigned'
        }
    ];

    // Store Class
    class GhoroaStore {
        constructor() {
            this.initStore();
        }

        initStore() {
            if (!localStorage.getItem('ghoroa_cart')) {
                localStorage.setItem('ghoroa_cart', JSON.stringify([]));
            }
            if (!localStorage.getItem('ghoroa_orders')) {
                localStorage.setItem('ghoroa_orders', JSON.stringify(SEEDED_ORDERS));
            }
            // Always ensure the real transcribed menu data is loaded into storage
            localStorage.setItem('ghoroa_products', JSON.stringify(REAL_GhoroaProducts));
        }

        // Cart methods
        getCart() {
            return JSON.parse(localStorage.getItem('ghoroa_cart') || '[]');
        }

        addToCart(productId) {
            const products = this.getProducts();
            const product = products.find(p => p.id === productId);
            if (!product) return;

            let cart = this.getCart();
            const existing = cart.find(item => item.id === productId);

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ ...product, qty: 1 });
            }

            localStorage.setItem('ghoroa_cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('ghoroa_cart_updated'));
        }

        updateCartQty(productId, delta) {
            let cart = this.getCart();
            const item = cart.find(i => i.id === productId);
            if (item) {
                item.qty += delta;
                if (item.qty <= 0) {
                    cart = cart.filter(i => i.id !== productId);
                }
            }
            localStorage.setItem('ghoroa_cart', JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('ghoroa_cart_updated'));
        }

        clearCart() {
            localStorage.setItem('ghoroa_cart', JSON.stringify([]));
            window.dispatchEvent(new CustomEvent('ghoroa_cart_updated'));
        }

        getCartCount() {
            return this.getCart().reduce((sum, i) => sum + i.qty, 0);
        }

        getCartSubtotal() {
            return this.getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
        }

        // Zones & Products
        getZones() { return ZONES; }
        getProducts() { return JSON.parse(localStorage.getItem('ghoroa_products') || JSON.stringify(REAL_GhoroaProducts)); }

        toggleProductAvailability(productId) {
            let products = this.getProducts();
            const prod = products.find(p => p.id === productId);
            if (prod) {
                prod.available = !prod.available;
                localStorage.setItem('ghoroa_products', JSON.stringify(products));
                window.dispatchEvent(new CustomEvent('ghoroa_products_updated'));
            }
        }

        // Orders
        getOrders() { return JSON.parse(localStorage.getItem('ghoroa_orders') || '[]'); }

        createOrder(orderData) {
            const orders = this.getOrders();
            const newOrder = {
                id: 'GH-' + Math.floor(1000 + Math.random() * 9000),
                date: 'Just now',
                ...orderData,
                status: 'ghoroa-new',
                rider: 'Unassigned'
            };
            orders.unshift(newOrder);
            localStorage.setItem('ghoroa_orders', JSON.stringify(orders));
            this.clearCart();
            return newOrder;
        }

        updateOrderStatus(orderId, newStatus) {
            let orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;
                localStorage.setItem('ghoroa_orders', JSON.stringify(orders));
                window.dispatchEvent(new CustomEvent('ghoroa_orders_updated'));
            }
        }

        assignRider(orderId, riderName) {
            let orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.rider = riderName;
                localStorage.setItem('ghoroa_orders', JSON.stringify(orders));
                window.dispatchEvent(new CustomEvent('ghoroa_orders_updated'));
            }
        }
    }

    window.GhoroaState = new GhoroaStore();

})(window);
