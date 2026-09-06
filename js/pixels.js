/* ==========================================================================
   THEQA — pixels.js
   المسؤولية: دوال مساعدة آمنة لإرسال أحداث التتبع لبيكسل Meta و TikTok.
   الكود الأساسي لكل بيكسل موجود داخل <head> في كل صفحة HTML.
   هذا الملف فقط يستدعي fbq()/ttq() بأمان دون كسر الموقع إذا:
   - لم يُضبط Pixel ID بعد
   - المتصفح يحظر أدوات التتبع (Ad Blocker)
   ========================================================================== */

function trackMetaEvent(eventName, params) {
  if (typeof fbq === "function") {
    try {
      fbq("track", eventName, params || {});
    } catch (err) {
      console.error("Meta Pixel error:", err);
    }
  }
}

function trackTikTokEvent(eventName, params) {
  if (typeof ttq !== "undefined" && ttq && typeof ttq.track === "function") {
    try {
      ttq.track(eventName, params || {});
    } catch (err) {
      console.error("TikTok Pixel error:", err);
    }
  }
}
