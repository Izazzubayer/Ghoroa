/**
 * Ghoroa — Menu page renderer
 */
(function () {
  'use strict';

  const CATEGORY_NAMES = {
    breakfast: { en: 'Breakfast', bn: 'সকালের নাস্তা' },
    mains: { en: 'Lunch & Dinner', bn: 'দুপুর ও রাত' },
    kebabs: { en: 'Kebabs & Breads', bn: 'কাবাব ও নান' },
    desserts: { en: 'Desserts & Drinks', bn: 'মিষ্টি ও পানীয়' },
    flower_rice: { en: 'Tk 200 Flower Rice', bn: '২০০ টাকা ফুলের ভাত' },
  };

  const CATEGORY_ORDER = ['breakfast', 'mains', 'kebabs', 'desserts', 'flower_rice'];

  const FALLBACK_IMAGES = {
    breakfast: 'assets/images/food/khichuri.jpg',
    mains: 'assets/images/food/curry.jpg',
    kebabs: 'assets/images/food/biryani.jpg',
    desserts: 'assets/images/food/juice.jpg',
    flower_rice: 'assets/images/food/thali.jpg',
  };

  const BROKEN_IMAGE_PATTERN = /dish_|hero_bg|feature_arch/;

  let currentViewMode = localStorage.getItem('ghoroa_view_mode') || 'list';

  function getImage(product) {
    const img = product.image || '';
    if (img && !BROKEN_IMAGE_PATTERN.test(img)) return img;
    return FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.mains;
  }

  function formatPrice(value) {
    if (value == null || value === '') return '—';
    return '৳' + value;
  }

  function renderListRow(product) {
    const takeaway = product.takeaway ?? product.price;
    const eatin = product.eatin;
    const eatInLine = eatin && eatin !== takeaway
      ? `<p class="menu-price-sub"><span class="lang-en">Eat in ${formatPrice(eatin)}</span><span class="lang-bn">এখানে ${formatPrice(eatin)}</span></p>`
      : '';

    return `
      <li class="menu-item">
        <div>
          <h3 class="menu-item-name">
            <span class="lang-en">${product.name_en}</span>
            <span class="lang-bn">${product.name_bn}</span>
          </h3>
          <p class="menu-item-alt">
            <span class="lang-en">${product.name_bn}</span>
            <span class="lang-bn">${product.name_en}</span>
          </p>
          ${product.desc_en ? `
          <p class="menu-item-desc">
            <span class="lang-en">${product.desc_en}</span>
            <span class="lang-bn">${product.desc_bn || ''}</span>
          </p>` : ''}
        </div>
        <div class="menu-prices">
          <p class="menu-price-main">${formatPrice(takeaway)}</p>
          ${eatInLine}
        </div>
      </li>`;
  }

  function renderGridCard(product) {
    const takeaway = product.takeaway ?? product.price;
    const img = getImage(product);

    return `
      <article class="menu-item">
        <img src="${img}" alt="${product.name_en}" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:4px;margin-bottom:0.55rem;">
        <div>
          <h3 class="menu-item-name">
            <span class="lang-en">${product.name_en}</span>
            <span class="lang-bn">${product.name_bn}</span>
          </h3>
          <p class="menu-item-alt">
            <span class="lang-en">${product.name_bn}</span>
            <span class="lang-bn">${product.name_en}</span>
          </p>
          ${product.desc_en ? `
          <p class="menu-item-desc">
            <span class="lang-en">${product.desc_en}</span>
            <span class="lang-bn">${product.desc_bn || ''}</span>
          </p>` : ''}
        </div>
        <p class="menu-price-main">${formatPrice(takeaway)}</p>
      </article>`;
  }

  function renderMenu(categoryFilter, searchQuery) {
    const container = document.getElementById('menuContainer');
    const resultsEl = document.getElementById('menuResults');
    if (!container || !window.GhoroaState) return;

    const products = window.GhoroaState.getProducts();
    const q = (searchQuery || '').trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesSearch =
        !q ||
        p.name_en.toLowerCase().includes(q) ||
        (p.name_bn && p.name_bn.includes(searchQuery.trim()));
      return matchesCat && matchesSearch && p.available !== false;
    });

    if (resultsEl) {
      resultsEl.textContent = filtered.length
        ? `${filtered.length} item${filtered.length === 1 ? '' : 's'}`
        : '';
    }

    if (!filtered.length) {
      container.innerHTML = `
        <div class="menu-empty">
          <span class="lang-en">Nothing matched that search.</span>
          <span class="lang-bn">কিছু পাওয়া যায়নি।</span>
        </div>`;
      return;
    }

    const grouped = {};
    filtered.forEach((p) => {
      const cat = p.category || 'mains';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    const cats = categoryFilter === 'all'
      ? CATEGORY_ORDER.filter((k) => grouped[k])
      : [categoryFilter];

    let html = '';

    cats.forEach((catKey) => {
      const items = grouped[catKey];
      if (!items) return;
      const catTitle = CATEGORY_NAMES[catKey] || { en: catKey, bn: catKey };

      html += `
        <section class="menu-section" id="cat-${catKey}">
          <div class="menu-section-head">
            <h2 class="menu-section-title">
              <span class="lang-en">${catTitle.en}</span>
              <span class="lang-bn">${catTitle.bn}</span>
            </h2>
            <span class="menu-section-count">${items.length}</span>
          </div>`;

      if (currentViewMode === 'grid') {
        html += `<div class="menu-grid">${items.map(renderGridCard).join('')}</div>`;
      } else {
        html += `<ul class="menu-list">${items.map(renderListRow).join('')}</ul>`;
      }

      html += '</section>';
    });

    container.innerHTML = html;
  }

  function getActiveCategory() {
    return document.querySelector('.menu-cat.active')?.dataset.cat || 'all';
  }

  function getSearchQuery() {
    return document.getElementById('menuSearch')?.value || '';
  }

  function updateViewToggleUI() {
    const gridBtn = document.getElementById('viewGridBtn');
    const listBtn = document.getElementById('viewListBtn');
    if (!gridBtn || !listBtn) return;
    gridBtn.classList.toggle('active', currentViewMode === 'grid');
    listBtn.classList.toggle('active', currentViewMode === 'list');
    gridBtn.setAttribute('aria-pressed', String(currentViewMode === 'grid'));
    listBtn.setAttribute('aria-pressed', String(currentViewMode === 'list'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateViewToggleUI();
    renderMenu('all', '');

    document.querySelectorAll('.menu-cat').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.menu-cat').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderMenu(btn.dataset.cat, getSearchQuery());
      });
    });

    document.getElementById('menuSearch')?.addEventListener('input', (e) => {
      renderMenu(getActiveCategory(), e.target.value);
    });

    document.getElementById('viewGridBtn')?.addEventListener('click', () => {
      currentViewMode = 'grid';
      localStorage.setItem('ghoroa_view_mode', 'grid');
      updateViewToggleUI();
      renderMenu(getActiveCategory(), getSearchQuery());
    });

    document.getElementById('viewListBtn')?.addEventListener('click', () => {
      currentViewMode = 'list';
      localStorage.setItem('ghoroa_view_mode', 'list');
      updateViewToggleUI();
      renderMenu(getActiveCategory(), getSearchQuery());
    });
  });

  window.GhoroaMenu = { renderMenu };
})();
