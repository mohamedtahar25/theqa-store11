/* ==========================================================================
   THEQA — checkout.js
   المسؤولية: نموذج الطلب، التحقق من الحقول، حساب سعر التوصيل حسب الولاية،
   ملخص الطلب، توليد رقم الطلب، وعرض نافذة التأكيد.
   تنويه: هذا إصدار Front-End فقط. الطلب لا يُرسل إلى أي خادم أو قاعدة بيانات،
   ويُعرض هنا فقط كمحاكاة لتجربة الشراء (localStorage للسلة فقط).
   ========================================================================== */

function populateWilayaSelect() {
  const select = document.getElementById("wilaya");
  if (!select) return;
  const options = Object.keys(wilayaDelivery)
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
  select.innerHTML = `<option value="">اختر الولاية</option>${options}`;
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkoutItems");
  const items = Cart.detailedItems();

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p style="color: var(--color-grey-400);">سلتك فارغة. عد إلى المتجر لإضافة منتجات.</p>`;
    document.getElementById("confirmOrderBtn")?.setAttribute("disabled", "true");
  } else {
    container.innerHTML = items
      .map(
        (item) => `
        <div class="summary-line">
          <span>${item.name} × ${item.qty}</span>
          <span>${formatPrice(item.lineTotal)}</span>
        </div>`
      )
      .join("");
    document.getElementById("confirmOrderBtn")?.removeAttribute("disabled");
  }

  updateTotals();
}

function getSelectedDeliveryType() {
  const checked = document.querySelector('input[name="deliveryType"]:checked');
  return checked ? checked.value : "home";
}

function updateTotals() {
  const subtotal = Cart.subtotal();
  const wilaya = document.getElementById("wilaya")?.value;
  const deliveryType = getSelectedDeliveryType();

  let deliveryFee = 0;
  if (wilaya && wilayaDelivery[wilaya]) {
    deliveryFee = wilayaDelivery[wilaya][deliveryType] ?? 0;
  }

  document.getElementById("summarySubtotal").textContent = formatPrice(subtotal);
  document.getElementById("summaryDelivery").textContent =
    wilaya ? formatPrice(deliveryFee) : "—";
  document.getElementById("summaryTotal").textContent = formatPrice(subtotal + deliveryFee);
}

function validateField(fieldId, isValid) {
  const group = document.getElementById(fieldId)?.closest(".form-group");
  if (!group) return;
  group.classList.toggle("has-error", !isValid);
}

const ALGERIA_PHONE_REGEX = /^(0)(5|6|7)[0-9]{8}$/;

function validateCheckoutForm() {
  let valid = true;

  const fullName = document.getElementById("fullName");
  if (!fullName.value.trim()) {
    validateField("fullName", false);
    valid = false;
  } else {
    validateField("fullName", true);
  }

  const phone = document.getElementById("phone");
  if (!ALGERIA_PHONE_REGEX.test(phone.value.trim())) {
    validateField("phone", false);
    valid = false;
  } else {
    validateField("phone", true);
  }

  const wilaya = document.getElementById("wilaya");
  if (!wilaya.value) {
    validateField("wilaya", false);
    valid = false;
  } else {
    validateField("wilaya", true);
  }

  const commune = document.getElementById("commune");
  if (!commune.value.trim()) {
    validateField("commune", false);
    valid = false;
  } else {
    validateField("commune", true);
  }

  return valid;
}

function generateOrderId() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `THEQA-${year}-${random}`;
}

function sendOrderToGoogleSheet(order) {
  if (!GOOGLE_SHEET_URL) return; // لم يُضبط الرابط بعد — يُتخطى بصمت

  const itemsText = order.items
    .map((item) => `${item.name} × ${item.qty} (${formatPrice(item.lineTotal)})`)
    .join(" | ");

  const payload = {
    orderId: order.id,
    name: order.customer.name,
    phone: order.customer.phone,
    wilaya: order.customer.wilaya,
    commune: order.customer.commune,
    deliveryType: order.deliveryType === "home" ? "باب المنزل" : "مكتب التوصيل",
    notes: order.customer.notes,
    itemsText,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
  };

  /*
    mode: "no-cors" لازم هنا لأن Google Apps Script لا يرسل ترويسات CORS.
    هذا يعني أننا لا نقدر نقرأ رد الخادم، لكن الطلب يصل ويُكتب في الشيت بنجاح.
    أي خطأ هنا هو خطأ شبكة فقط (بدون إنترنت مثلاً) ولا يمنع باقي عملية الطلب.
  */
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  }).catch((err) => {
    console.error("تعذر إرسال الطلب إلى Google Sheet:", err);
  });
}

function showOrderConfirmation(order) {
  document.getElementById("confirmOrderId").textContent = order.id;
  document.getElementById("confirmTotal").textContent = formatPrice(order.total);
  document.getElementById("confirmDeliveryType").textContent =
    order.deliveryType === "home" ? "باب المنزل" : "مكتب التوصيل";

  document.getElementById("confirmModal")?.classList.add("is-open");
  document.getElementById("overlay")?.classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

document.addEventListener("DOMContentLoaded", () => {
  Cart.load();
  populateWilayaSelect();
  renderCheckoutSummary();

  if (Cart.items.length > 0) {
    const subtotal = Cart.subtotal();
    trackMetaEvent("InitiateCheckout", { value: subtotal, currency: "DZD" });
    trackTikTokEvent("InitiateCheckout", { value: subtotal, currency: "DZD" });
  }

  document.getElementById("wilaya")?.addEventListener("change", updateTotals);

  document.querySelectorAll('input[name="deliveryType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".delivery-option").forEach((opt) =>
        opt.classList.toggle("active", opt.querySelector("input").checked)
      );
      updateTotals();
    });
  });

  document.getElementById("checkoutForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (Cart.items.length === 0) {
      showToast("سلتك فارغة، أضف منتجات أولًا", "error");
      return;
    }

    if (!validateCheckoutForm()) {
      showToast("يرجى تصحيح الحقول المطلوبة", "error");
      return;
    }

    const wilaya = document.getElementById("wilaya").value;
    const deliveryType = getSelectedDeliveryType();
    const deliveryFee = wilayaDelivery[wilaya][deliveryType];
    const subtotal = Cart.subtotal();

    const order = {
      id: generateOrderId(),
      customer: {
        name: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        wilaya,
        commune: document.getElementById("commune").value.trim(),
        notes: document.getElementById("notes").value.trim(),
      },
      deliveryType,
      deliveryFee,
      subtotal,
      total: subtotal + deliveryFee,
      items: Cart.detailedItems(),
    };

    /* يرسل بيانات الطلب إلى Google Sheet إذا كان الرابط مضبوطًا */
    sendOrderToGoogleSheet(order);

    trackMetaEvent("Purchase", { value: order.total, currency: "DZD" });
    trackTikTokEvent("CompletePayment", { value: order.total, currency: "DZD" });

    showOrderConfirmation(order);
    Cart.clear();
    document.getElementById("checkoutForm").reset();
  });

  document.getElementById("backToShop")?.addEventListener("click", () => {
    window.location.href = "products.html";
  });
});
