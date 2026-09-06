/* ==========================================================================
   THEQA — main.js
   المسؤولية: عرض المنتجات، البحث، الفلاتر، الترتيب، التنقل، Product Modal.
   ========================================================================== */

const state = {
  search: "",
  category: "all",
  sort: "newest",
};

function getFilteredProducts() {
  let list = [...products];

  if (state.category !== "all") {
    list = list.filter((p) => p.category === state.category);
  }

  if (state.search.trim() !== "") {
    const q = state.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (state.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      break;
    default:
      list.sort((a, b) => b.id - a.id); // الأحدث
  }

  return list;
}

function renderProductCard(product) {
  const oldPriceHtml = product.oldPrice
    ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>`
    : "";
  const badgeHtml = product.badge
    ? `<span class="product-badge">${product.badge}</span>`
    : "";

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-media" data-action="open-modal">
        ${badgeHtml}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h3 class="product-name" data-action="open-modal">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-prices">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${oldPriceHtml}
        </div>
        <div class="product-actions">
          <button class="btn btn-outline" data-action="add-cart">أضف للسلة</button>
          <button class="btn btn-primary" data-action="order-now">اطلب الآن</button>
        </div>
      </div>
    </article>`;
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const list = getFilteredProducts();

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>لا توجد نتائج</h3>
        <p>جرّب كلمة بحث مختلفة أو غيّر الفلتر المختار.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(renderProductCard).join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    const id = Number(card.dataset.id);
    card.querySelectorAll('[data-action="open-modal"]').forEach((el) =>
      el.addEventListener("click", () => openProductModal(id))
    );
    card.querySelector('[data-action="add-cart"]')?.addEventListener("click", () => {
      Cart.add(id, 1);
    });
    card.querySelector('[data-action="order-now"]')?.addEventListener("click", () => {
      Cart.buyNow(id, 1);
      window.location.href = "checkout.html";
    });
  });
}

function renderFilterChips() {
  const container = document.getElementById("filterChips");
  if (!container) return;
  container.innerHTML = CATEGORIES.map(
    (cat) =>
      `<button type="button" class="filter-chip${cat.id === state.category ? " active" : ""}" data-cat="${cat.id}">${cat.label}</button>`
  ).join("");

  container.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      renderFilterChips();
      renderProductGrid();
    });
  });
}

/* ---------- Product Modal ---------- */
let modalQty = 1;
let currentModalProductId = null;

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  currentModalProductId = productId;
  modalQty = 1;

  const modal = document.getElementById("productModal");
  if (!modal) return;

  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.name;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalPrice").textContent = formatPrice(product.price);

  const oldPriceEl = document.getElementById("modalOldPrice");
  if (product.oldPrice) {
    oldPriceEl.textContent = formatPrice(product.oldPrice);
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }

  const badgeEl = document.getElementById("modalBadge");
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.style.display = "inline-block";
  } else {
    badgeEl.style.display = "none";
  }

  document.getElementById("modalQty").textContent = modalQty;

  modal.classList.add("is-open");
  document.getElementById("overlay")?.classList.add("is-visible");
  document.body.style.overflow = "hidden";

  trackMetaEvent("ViewContent", {
    content_name: product.name,
    content_ids: [product.id],
    content_type: "product",
    value: product.price,
    currency: "DZD",
  });
  trackTikTokEvent("ViewContent", {
    content_name: product.name,
    content_id: String(product.id),
    value: product.price,
    currency: "DZD",
  });
}

function closeProductModal() {
  document.getElementById("productModal")?.classList.remove("is-open");
  document.getElementById("overlay")?.classList.remove("is-visible");
  document.body.style.overflow = "";
}

/* ---------- التنقل في الهاتف ---------- */
function closeMobileNav() {
  document.getElementById("mobileNav")?.classList.remove("is-open");
  document.getElementById("hamburgerBtn")?.classList.remove("is-active");
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilterChips();
  renderProductGrid();

  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderProductGrid();
  });

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProductGrid();
  });

  /* Hamburger menu */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  hamburgerBtn?.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("is-active");
    document.getElementById("mobileNav")?.classList.toggle("is-open");
  });
  document.querySelectorAll("#mobileNav a").forEach((link) =>
    link.addEventListener("click", closeMobileNav)
  );

  /* Product modal events */
  document.getElementById("modalClose")?.addEventListener("click", closeProductModal);
  document.getElementById("modalBackdrop")?.addEventListener("click", closeProductModal);

  document.getElementById("modalQtyMinus")?.addEventListener("click", () => {
    if (modalQty > 1) modalQty -= 1;
    document.getElementById("modalQty").textContent = modalQty;
  });
  document.getElementById("modalQtyPlus")?.addEventListener("click", () => {
    modalQty += 1;
    document.getElementById("modalQty").textContent = modalQty;
  });
  document.getElementById("modalAddCart")?.addEventListener("click", () => {
    if (currentModalProductId != null) {
      Cart.add(currentModalProductId, modalQty);
      closeProductModal();
    }
  });
  document.getElementById("modalOrderNow")?.addEventListener("click", () => {
    if (currentModalProductId != null) {
      Cart.buyNow(currentModalProductId, modalQty);
      window.location.href = "checkout.html";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProductModal();
      closeCartDrawer();
      closeMobileNav();
    }
  });

  /* روابط التواصل من products.js */
  document.querySelectorAll("[data-social]").forEach((el) => {
    const key = el.dataset.social;
    if (SOCIAL_LINKS[key]) el.href = SOCIAL_LINKS[key];
  });
});
