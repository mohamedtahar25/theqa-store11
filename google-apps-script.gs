/*
  THEQA — كود استقبال الطلبات في Google Sheets
  =============================================
  طريقة التركيب:
  1. افتح الشيت الذي أنشأته لاستقبال الطلبات.
  2. من القائمة: Extensions > Apps Script
  3. احذف أي كود موجود، والصق هذا الكود كاملاً.
  4. احفظ (Ctrl+S أو أيقونة الحفظ).
  5. اضغط Deploy > New deployment.
  6. اختر النوع: Web app.
     - Execute as: Me
     - Who has access: Anyone
  7. اضغط Deploy، وافق على الصلاحيات المطلوبة (حساب Google الخاص بك).
  8. انسخ الرابط الذي يظهر لك (Web app URL) — هذا هو الرابط الذي تضعه
     في ملف js/products.js داخل GOOGLE_SHEET_URL.
*/

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.orderId || "",
      data.name || "",
      data.phone || "",
      data.wilaya || "",
      data.commune || "",
      data.address || "",
      data.deliveryType || "",
      data.notes || "",
      data.itemsText || "",
      data.subtotal || 0,
      data.deliveryFee || 0,
      data.total || 0,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
