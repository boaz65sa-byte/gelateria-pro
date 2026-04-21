/**
 * ═══════════════════════════════════════════════════════════════
 *  The Sweet Station — תפריט דו-לשוני
 *  ניתן לערוך את כל הנתונים כאן, או דרך ממשק העריכה באפליקציה.
 * ═══════════════════════════════════════════════════════════════
 */

export const menuSections = [
  {
    id: 'soft-serve',
    en: 'American Soft-Serve',
    he: 'גלידת סופט אמריקאית',
    badgeEn: 'Premium Base',
    badgeHe: 'בסיס פרמיום',
    color: 'amber',
    emoji: '🍦',
    items: [
      {
        id: 'ss1', en: 'Classic Vanilla Bean', he: 'וניל בורבון קלאסי',
        descEn: 'Madagascar bourbon vanilla, organic cream base, waffle cone',
        descHe: 'וניל בורבון מדגסקר, בסיס שמנת אורגנית, קורנט וופל',
        price: 42, cost: 28, tags: ['veg'], allergens: 'חלב, גלוטן',
      },
      {
        id: 'ss2', en: 'Midnight Dark Chocolate', he: 'שוקולד מריר חצות',
        descEn: '70% Valrhona cacao, ganache drip, cocoa tuile',
        descHe: 'קאקאו ולרונה 70%, ריבוע גנאש, טויל קקאו',
        price: 48, cost: 31, tags: ['sig', 'hot'], allergens: 'חלב',
      },
      {
        id: 'ss3', en: 'Salted Caramel Praline', he: 'קרמל מלוח ופרלין',
        descEn: 'Fleur de sel, house-made caramel, candied pecans, toffee brittle',
        descHe: 'פלר דה סל, קרמל בית, פקאן מסוכר, ברייטל טופי',
        price: 52, cost: 33, tags: ['sig'], allergens: 'חלב, אגוזים',
      },
      {
        id: 'ss4', en: "Matcha Ceremonial", he: "מאצ'ה טקסי",
        descEn: 'Ceremonial grade matcha, white chocolate pearls, yuzu zest',
        descHe: "מאצ'ה דרגת טקס, פנינות שוקולד לבן, גרידת יוזו",
        price: 55, cost: 36, tags: ['new', 'veg'], allergens: 'חלב',
      },
    ],
  },
  {
    id: 'signature',
    en: 'Signature Creations',
    he: 'יצירות חתימה',
    badgeEn: "Chef's Table",
    badgeHe: 'שולחן השף',
    color: 'purple',
    emoji: '⭐',
    items: [
      {
        id: 'sc1', en: 'The Dubai Gold', he: 'הדובאי גולד',
        descEn: 'Kataifi nest, pistachio cream, milk chocolate drip, 23K gold leaf, rose water mist',
        descHe: 'קדאיף, קרם פיסטוק, שוקולד חלב, עלי זהב 23K, ערפל מי ורדים',
        price: 89, cost: 52, tags: ['sig', 'hot'], allergens: 'חלב, גלוטן, אגוזים',
      },
      {
        id: 'sc2', en: 'Strawberry Sakura', he: 'תות ושקמה',
        descEn: 'Miyazaki strawberry compote, sakura gel, champagne sorbet, edible flower crown',
        descHe: "קומפוט תות מיאזאקי, ג'ל שקמה, סורבה שמפניה, כתר פרחים אכילים",
        price: 72, cost: 44, tags: ['sig', 'new'], allergens: 'חלב',
      },
      {
        id: 'sc3', en: 'Pistachio Royale', he: 'פיסטוק רויאל',
        descEn: 'Iranian pistachio mousse, baklava crumble, honey tuile, rosewater foam',
        descHe: 'מוס פיסטוק איראני, פירורי בקלווה, טויל דבש, קצף מי ורדים',
        price: 78, cost: 48, tags: ['sig'], allergens: 'חלב, גלוטן, אגוזים',
      },
      {
        id: 'sc4', en: 'The Obsidian', he: 'האובסידיאן',
        descEn: 'Activated charcoal base, lychee caviar, black sesame praline, edible silver',
        descHe: "בסיס פחם פעיל, קוויאר ליצ'י, פרלין שומשום שחור, כסף אכיל",
        price: 82, cost: 50, tags: ['sig', 'hot'], allergens: 'חלב',
      },
    ],
  },
  {
    id: 'live-station',
    en: 'The Live Station',
    he: 'תחנת החי',
    badgeEn: 'À la Minute',
    badgeHe: 'הכנה חיה',
    color: 'teal',
    emoji: '🥞',
    items: [
      {
        id: 'ls1', en: 'Classic Crêpe Suzette', he: 'קרפ סוזט קלאסי',
        descEn: 'Grand Marnier flambé, candied orange zest, crème fraîche, micro herbs',
        descHe: 'פלמבה גראן מרנייה, קליפת תפוז מסוכרת, קרם פרש, מיקרו עשבים',
        price: 58, cost: 35, tags: ['sig'], allergens: 'חלב, גלוטן, ביצים',
      },
      {
        id: 'ls2', en: 'Mini Pancake Tower', he: 'מגדל מיני פנקייקס',
        descEn: 'Japanese soufflé style, berry coulis, mascarpone, maple dust',
        descHe: 'סגנון סופלה יפני, קולי פירות יער, מסקרפונה, אבקת מייפל',
        price: 62, cost: 37, tags: ['hot'], allergens: 'חלב, גלוטן, ביצים',
      },
      {
        id: 'ls3', en: 'Nutella Banana Royale', he: 'נוטלה בננה רויאל',
        descEn: 'Organic banana, house Nutella, candied hazelnuts, cream chantilly',
        descHe: 'בננה אורגנית, נוטלה בית, אגוזי לוז מסוכרים, קרם שאנטיי',
        price: 55, cost: 32, tags: [], allergens: 'חלב, גלוטן, ביצים, אגוזים',
      },
      {
        id: 'ls4', en: 'Dubai Crêpe', he: 'קרפ דובאי',
        descEn: 'Kataifi, pistachio butter, white chocolate ganache, gold dust — live assembly',
        descHe: 'קדאיף, חמאת פיסטוק, גנאש שוקולד לבן, אבקת זהב — הרכבה חיה',
        price: 75, cost: 46, tags: ['sig', 'hot', 'new'], allergens: 'חלב, גלוטן, ביצים, אגוזים',
      },
    ],
  },
  {
    id: 'froyo',
    en: 'Frozen Yogurt',
    he: 'יוגורט קפוא',
    badgeEn: 'Live Culture',
    badgeHe: 'תרביות חיות',
    color: 'blue',
    emoji: '🫐',
    items: [
      {
        id: 'fy1', en: 'Natural Greek Base', he: 'בסיס יווני טבעי',
        descEn: 'Strained whole-milk yogurt, honey drizzle, granola, seasonal berries',
        descHe: 'יוגורט יווני מסונן, ניגר דבש, גרנולה, פירות יער עונתיים',
        price: 38, cost: 22, tags: ['veg'], allergens: 'חלב',
      },
      {
        id: 'fy2', en: 'Tropical Mango Passion', he: 'מנגו פסיפלורה טרופי',
        descEn: 'Alphonso mango purée, passion fruit curd, toasted coconut, lime zest',
        descHe: 'פירה מנגו אלפונסו, קרד פסיפלורה, קוקוס קלוי, גרידת ליים',
        price: 48, cost: 28, tags: ['veg', 'new'], allergens: 'חלב',
      },
      {
        id: 'fy3', en: 'Berry Cheesecake', he: "ברי צ'יזקייק",
        descEn: 'Mixed berry compote, graham cracker crumble, cream cheese swirl',
        descHe: 'קומפוט פירות יער מעורב, פירורי גרהם, ערבול גבינת שמנת',
        price: 52, cost: 30, tags: ['hot'], allergens: 'חלב, גלוטן',
      },
      {
        id: 'fy4', en: 'Pistachio & Rose', he: 'פיסטוק וורד',
        descEn: 'Pistachio praline, rose petal jam, halva crumble, edible flowers',
        descHe: 'פרלין פיסטוק, ריבת עלי ורד, פירורי חלווה, פרחים אכילים',
        price: 58, cost: 34, tags: ['sig', 'veg'], allergens: 'חלב, אגוזים',
      },
    ],
  },
  {
    id: 'juice',
    en: 'The Juice Bar',
    he: 'בר מיצים',
    badgeEn: 'Cold Press',
    badgeHe: 'כבישה קרה',
    color: 'green',
    emoji: '🥤',
    items: [
      {
        id: 'jb1', en: 'Green Goddess', he: 'האלה הירוקה',
        descEn: 'Cold-press cucumber, spinach, green apple, ginger, lemon',
        descHe: "מלפפון, תרד, תפוח ירוק, ג'ינג'ר, לימון — כבישה קרה",
        price: 42, cost: 24, tags: ['veg'], allergens: 'ללא',
      },
      {
        id: 'jb2', en: 'Beet Elixir', he: 'אליקסיר סלק',
        descEn: 'Beetroot, carrot, orange, turmeric, black pepper — anti-inflammatory',
        descHe: 'סלק, גזר, תפוז, כורכום, פלפל שחור — אנטי דלקתי',
        price: 45, cost: 25, tags: ['veg', 'hot'], allergens: 'ללא',
      },
      {
        id: 'jb3', en: 'Citrus Burst', he: 'פיצוץ הדרים',
        descEn: 'Blood orange, pink grapefruit, clementine, mint, tajín rim',
        descHe: 'תפוז דם, אשכולית ורוד, קלמנטינה, נענע, שפת טחין',
        price: 40, cost: 22, tags: ['veg'], allergens: 'ללא',
      },
      {
        id: 'jb4', en: 'Signature Pink Lychee', he: "ליצ'י ורוד חתימה",
        descEn: 'Lychee, dragon fruit, rose water, sparkling, edible flower',
        descHe: "ליצ'י, פרי דרקון, מי ורדים, מבעבע, פרח אכיל",
        price: 52, cost: 28, tags: ['sig', 'new'], allergens: 'ללא',
      },
      {
        id: 'jb5', en: 'Classic Watermelon Mint', he: 'אבטיח נענע קלאסי',
        descEn: 'Fresh watermelon, spearmint, lime, pink himalayan salt',
        descHe: 'אבטיח טרי, נענע ירוקה, ליים, מלח הימלאיה ורוד',
        price: 38, cost: 20, tags: ['veg'], allergens: 'ללא',
      },
      {
        id: 'jb6', en: 'Almond Pistachio Milk', he: 'חלב שקדים פיסטוק',
        descEn: 'House-made nut milk, date syrup, cardamom, cinnamon — dairy-free',
        descHe: 'חלב אגוזים בית, סירופ תמרים, הל, קינמון — ללא חלב',
        price: 48, cost: 26, tags: ['veg', 'sig'], allergens: 'אגוזים',
      },
    ],
  },
]

export const TAG_META = {
  sig: { en: 'Signature', he: 'חתימה' },
  veg: { en: 'Plant-based', he: 'צמחי' },
  new: { en: 'Seasonal', he: 'עונתי' },
  hot: { en: 'Trending', he: 'טרנד' },
}

export const SECTION_COLORS = {
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-700',  badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200', bar: 'bg-amber-400' },
  purple: { bg: 'bg-violet-50 dark:bg-violet-900/20',border: 'border-violet-200 dark:border-violet-700',badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200',bar: 'bg-violet-400' },
  teal:   { bg: 'bg-emerald-50 dark:bg-emerald-900/20',border:'border-emerald-200 dark:border-emerald-700',badge:'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',bar:'bg-emerald-400'},
  blue:   { bg: 'bg-sky-50 dark:bg-sky-900/20',       border:'border-sky-200 dark:border-sky-700',        badge:'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200',         bar:'bg-sky-400'    },
  green:  { bg: 'bg-lime-50 dark:bg-lime-900/20',     border:'border-lime-200 dark:border-lime-700',      badge:'bg-lime-100 dark:bg-lime-900/40 text-lime-800 dark:text-lime-200',     bar:'bg-lime-400'   },
}
