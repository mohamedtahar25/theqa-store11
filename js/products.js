/* ==========================================================================
   THEQA — products.js
   المسؤولية: بيانات المنتجات، التصنيفات، وأسعار التوصيل حسب الولاية.
   لإضافة منتج جديد: أضف Object جديد داخل مصفوفة products بالأسفل.
   لتغيير سعر التوصيل: عدّل الأرقام داخل wilayaDelivery فقط.
   ========================================================================== */

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "electronics", label: "إلكترونيات" },
  { id: "fashion", label: "أزياء" },
  { id: "beauty", label: "تجميل" },
  { id: "accessories", label: "إكسسوارات" },
  { id: "other", label: "أخرى" },
];

/* عدّل، أضف أو احذف منتجات من هنا فقط. */
const products = [
  {
    id: 1,
    name: "جهاز تنظيف البشرة الاحترافي",
    price: 2500,
    oldPrice: 3000,
    image: "assets/images/product-01.svg",
    description:
      "جهاز عملي وسهل الاستخدام لتنظيف عميق للبشرة في المنزل، مناسب لجميع أنواع البشرة ويعمل بالشحن اللاسلكي.",
    category: "beauty",
    badge: "جديد",
  },
  {
    id: 2,
    name: "سماعات لاسلكية عازلة للضوضاء",
    price: 4900,
    oldPrice: 6200,
    image: "assets/images/product-02.svg",
    description:
      "صوت نقي وعزل ممتاز للضوضاء الخارجية، بطارية تدوم حتى 30 ساعة مع علبة شحن سريع.",
    category: "electronics",
    badge: "الأكثر مبيعًا",
  },
  {
    id: 3,
    name: "ساعة ذكية رياضية",
    price: 6500,
    oldPrice: null,
    image: "assets/images/product-03.svg",
    description:
      "تتبع دقيق للخطوات والنبضات والنوم، مقاومة للماء، متوافقة مع أندرويد و iOS.",
    category: "electronics",
    badge: "",
  },
  {
    id: 4,
    name: "حقيبة يد جلدية نسائية",
    price: 3200,
    oldPrice: 4000,
    image: "assets/images/product-04.svg",
    description: "تصميم أنيق وعصري، جلد ناعم عالي الجودة، مساحة داخلية واسعة.",
    category: "fashion",
    badge: "",
  },
  {
    id: 5,
    name: "نظارة شمسية كلاسيكية",
    price: 1800,
    oldPrice: 2200,
    image: "assets/images/product-05.svg",
    description: "حماية كاملة من الأشعة فوق البنفسجية بإطار خفيف الوزن.",
    category: "accessories",
    badge: "",
  },
  {
    id: 6,
    name: "مجموعة عناية بالبشرة (5 قطع)",
    price: 3900,
    oldPrice: 4800,
    image: "assets/images/product-06.svg",
    description: "غسول، تونر، سيروم، كريم مرطب وواقي شمس، لروتين عناية متكامل.",
    category: "beauty",
    badge: "عرض محدود",
  },
  {
    id: 7,
    name: "قميص رجالي قطن أصلي",
    price: 2100,
    oldPrice: null,
    image: "assets/images/product-07.svg",
    description: "قماش قطني مريح وتصميم كلاسيكي يناسب جميع المناسبات.",
    category: "fashion",
    badge: "",
  },
  {
    id: 8,
    name: "مكبر صوت بلوتوث محمول",
    price: 3500,
    oldPrice: 4200,
    image: "assets/images/product-08.svg",
    description: "صوت قوي ومقاوم للماء، مثالي للرحلات والمناسبات الخارجية.",
    category: "electronics",
    badge: "",
  },
  {
    id: 9,
    name: "سلسلة مفاتيح جلدية مطرزة",
    price: 700,
    oldPrice: 900,
    image: "assets/images/product-09.svg",
    description: "قطعة أنيقة بسيطة تضيف لمسة مميزة لمفاتيحك اليومية.",
    category: "accessories",
    badge: "",
  },
  {
    id: 10,
    name: "منظم مكتبي متعدد الاستخدامات",
    price: 1500,
    oldPrice: null,
    image: "assets/images/product-10.svg",
    description: "يساعدك على ترتيب أدواتك المكتبية بطريقة عملية وأنيقة.",
    category: "other",
    badge: "",
  },
];

/*
  أسعار التوصيل لكل الولايات الجزائرية الـ58.
  home  = التوصيل إلى باب المنزل
  office = التوصيل إلى مكتب التوصيل
  لتعديل الأسعار: غيّر الأرقام فقط، الأسماء يجب أن تبقى كما هي.
*/
const wilayaDelivery = {
  "01 - أدرار": { home: 1200, office: 900 },
  "02 - الشلف": { home: 700, office: 500 },
  "03 - الأغواط": { home: 800, office: 600 },
  "04 - أم البواقي": { home: 700, office: 500 },
  "05 - باتنة": { home: 700, office: 500 },
  "06 - بجاية": { home: 650, office: 450 },
  "07 - بسكرة": { home: 800, office: 600 },
  "08 - بشار": { home: 1200, office: 900 },
  "09 - البليدة": { home: 500, office: 350 },
  "10 - البويرة": { home: 600, office: 400 },
  "11 - تمنراست": { home: 1600, office: 1300 },
  "12 - تبسة": { home: 800, office: 600 },
  "13 - تلمسان": { home: 800, office: 600 },
  "14 - تيارت": { home: 700, office: 500 },
  "15 - تيزي وزو": { home: 600, office: 400 },
  "16 - الجزائر": { home: 400, office: 300 },
  "17 - الجلفة": { home: 800, office: 600 },
  "18 - جيجل": { home: 700, office: 500 },
  "19 - سطيف": { home: 700, office: 500 },
  "20 - سعيدة": { home: 800, office: 600 },
  "21 - سكيكدة": { home: 700, office: 500 },
  "22 - سيدي بلعباس": { home: 800, office: 600 },
  "23 - عنابة": { home: 750, office: 550 },
  "24 - قالمة": { home: 750, office: 550 },
  "25 - قسنطينة": { home: 700, office: 500 },
  "26 - المدية": { home: 600, office: 400 },
  "27 - مستغانم": { home: 750, office: 550 },
  "28 - المسيلة": { home: 700, office: 500 },
  "29 - معسكر": { home: 800, office: 600 },
  "30 - ورقلة": { home: 1000, office: 800 },
  "31 - وهران": { home: 800, office: 600 },
  "32 - البيض": { home: 1000, office: 800 },
  "33 - إليزي": { home: 1800, office: 1500 },
  "34 - برج بوعريريج": { home: 650, office: 450 },
  "35 - بومرداس": { home: 500, office: 350 },
  "36 - الطارف": { home: 800, office: 600 },
  "37 - تندوف": { home: 1800, office: 1500 },
  "38 - تيسمسيلت": { home: 700, office: 500 },
  "39 - الوادي": { home: 1000, office: 800 },
  "40 - خنشلة": { home: 800, office: 600 },
  "41 - سوق أهراس": { home: 800, office: 600 },
  "42 - تيبازة": { home: 500, office: 350 },
  "43 - ميلة": { home: 700, office: 500 },
  "44 - عين الدفلى": { home: 650, office: 450 },
  "45 - النعامة": { home: 1100, office: 900 },
  "46 - عين تموشنت": { home: 800, office: 600 },
  "47 - غرداية": { home: 1000, office: 800 },
  "48 - غليزان": { home: 750, office: 550 },
  "49 - تيميمون": { home: 1500, office: 1200 },
  "50 - برج باجي مختار": { home: 1900, office: 1600 },
  "51 - أولاد جلال": { home: 900, office: 700 },
  "52 - بني عباس": { home: 1500, office: 1200 },
  "53 - إن صالح": { home: 1700, office: 1400 },
  "54 - إن قزام": { home: 1900, office: 1600 },
  "55 - تقرت": { home: 1000, office: 800 },
  "56 - جانت": { home: 1900, office: 1600 },
  "57 - المغير": { home: 1000, office: 800 },
  "58 - المنيعة": { home: 1100, office: 900 },
};

/* روابط التواصل الاجتماعي — عدّلها بروابطك الحقيقية */
const SOCIAL_LINKS = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  whatsapp: "https://wa.me/213000000000",
};

/*
  رابط Google Apps Script (Web App) الذي يستقبل الطلبات ويكتبها في Google Sheet.
  احصل عليه من: Extensions > Apps Script > Deploy > New deployment > Web app
  (راجع ملف google-apps-script.gs لكود المستلم الكامل وشرح الخطوات).
  اترك القيمة فارغة "" إذا لا تريد إرسال الطلبات لشيت حاليًا.
*/
const GOOGLE_SHEET_URL = "";
