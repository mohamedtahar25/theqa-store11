/* ==========================================================================
   THEQA — cart.js
   المسؤولية: إدارة السلة (إضافة/حذف/كمية)، الحفظ في localStorage،
   عرض Cart Drawer، وحساب المجاميع.
   ملاحظة: هذا إصدار Front-End فقط، السلة تُحفظ محليًا في المتصفح
   ولا يتم إرسالها إلى أي خادم حقيقي.
   ========================================================================== */

const CART_STORAGE_KEY = "theqa_cart_v1";

const Cart = {
  items: [],

  load() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      this.items = raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("تعذر قراءة السلة من التخزين المحلي:", err);
      this.items = [];
    }
  },

  save() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (err) {
      console.error("تعذر حفظ السلة:", err);
    }
  },

  add(productId, qty = 1, options = {}) {
    const { silent = false } = options;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existing = this.items.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: productId, qty });
    }
    this.save();
    this.render();

    if (!silent) {
      showToast(`تمت إضافة "${product.name}" إلى السلة`);
      openCartDrawer();
    }

    trackMetaEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price * qty,
      currency: "DZD",
    });
    trackTikTokEvent("AddToCart", {
      content_name: product.name,
      content_id: String(product.id),
      quantity: qty,
      value: product.price * qty,
      currency: "DZD",
    });
  },

  /*
    "اطلب الآن" — طلب مباشر لمنتج واحد فقط، منفصل عن محتوى السلة الحالي.
    يستبدل محتوى السلة بهذا المنتج فقط (بدون Toast ولا فتح Drawer)
    حتى تكون صفحة Checkout مباشرة وبسيطة للزبون.
  */
  buyNow(productId, qty = 1) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    this.items = [{ id: productId, qty }];
    this.save();
    this.render();

    trackMetaEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price * qty,
      currency: "DZD",
    });
    trackTikTokEvent("AddToCart", {
      content_name: product.name,
      content_id: String(product.id),
      quantity: qty,
      value: product.price * qty,
      currency: "DZD",
    });
  },

  remove(productId) {
    this.items = this.items.filter((i) => i.id !== productId);
    this.save();
    this.render();
  },

  increase(productId) {
    const item = this.items.find((i) => i.id === productId);
    if (item) item.qty += 1;
    this.save();
    this.render();
  },

  decrease(productId) {
    const item = this.items.find((i) => i.id === productId);
    if (!item) return;
    item.qty -= 1;
    if (item.qty <= 0) {
      this.remove(productId);
      return;
    }
    this.save();
    this.render();
  },

  clear() {
    this.items = [];
    this.save();
    this.render();
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  subtotal() {
    return this.items.reduce((sum, i) => {
      const product = products.find((p) => p.id === i.id);
      return product ? sum + product.price * i.qty : sum;
    }, 0);
  },

  detailedItems() {
    return this.items
      .map((i) => {
        const product = products.find((p) => p.id === i.id);
        if (!product) return null;
        return { ...product, qty: i.qty, lineTotal: product.price * i.qty };
      })
      .filter(Boolean);
  },

  render() {
    updateCartCount();
    renderCartDrawer();
  },
};

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const count = Cart.count();
  el.textContent = count;
  el.style.display = count > 0 ? "flex" : "none";
}

function formatPrice(value) {
  return `${value.toLocaleString("ar-DZ")} DA`;
}

function renderCartDrawer() {
  const container = document.getElementById("cartItems");
  const subtotalEl = document.getElementById("cartSubtotal");
  if (!container || !subtotalEl) return;

  const items = Cart.detailedItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>سلتك فارغة حاليًا 🛒</p>
        <p>أضف منتجات لتظهر هنا.</p>
      </div>`;
    subtotalEl.textContent = formatPrice(0);
    const checkoutBtn = document.getElementById("goToCheckout");
    if (checkoutBtn) checkoutBtn.setAttribute("disabled", "true");
    return;
  }

  const checkoutBtn = document.getElementById("goToCheckout");
  if (checkoutBtn) checkoutBtn.removeAttribute("disabled");

  container.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="qty-control">
            <button type="button" data-action="decrease" aria-label="إنقاص الكمية">−</button>
            <span>${item.qty}</span>
            <button type="button" data-action="increase" aria-label="زيادة الكمية">+</button>
          </div>
        </div>
        <button type="button" class="remove-item" data-action="remove">حذف</button>
      </div>`
    )
    .join("");

  subtotalEl.textContent = formatPrice(Cart.subtotal());

  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.closest(".cart-item").dataset.id);
      const action = e.target.dataset.action;
      if (action === "increase") Cart.increase(id);
      if (action === "decrease") Cart.decrease(id);
      if (action === "remove") Cart.remove(id);
    });
  });
}

function openCartDrawer() {
  document.getElementById("cartDrawer")?.classList.add("is-open");
  document.getElementById("overlay")?.classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  document.getElementById("cartDrawer")?.classList.remove("is-open");
  document.getElementById("overlay")?.classList.remove("is-visible");
  document.body.style.overflow = "";
}

function showToast(message, type = "success") {
  const containerEl = document.getElementById("toastContainer");
  if (!containerEl) return;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  toast.textContent = message;
  containerEl.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* تهيئة السلة عند تحميل أي صفحة */
document.addEventListener("DOMContentLoaded", () => {
  Cart.load();
  Cart.render();

  document.getElementById("cartToggle")?.addEventListener("click", openCartDrawer);
  document.getElementById("drawerClose")?.addEventListener("click", closeCartDrawer);
  document.getElementById("overlay")?.addEventListener("click", () => {
    closeCartDrawer();
    closeProductModal();
    closeMobileNav();
  });

  document.getElementById("goToCheckout")?.addEventListener("click", () => {
    if (Cart.items.length === 0) return;
    window.location.href = "checkout.html";
  });
});
