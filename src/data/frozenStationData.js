/**
 * ═══════════════════════════════════════════════════════════════
 *  תחנת פרוזן יוגורט וגלידה — Sweet Station Pro
 *  מקור: הגדרות בעל העסק
 * ═══════════════════════════════════════════════════════════════
 */

// ── בסיסים ───────────────────────────────────────────────────────────────────
export const bases = [
  // פרוזן יוגורט
  { id:'base-fro-nat',  type:'frozen',  name:'פרוזן יוגורט טבעי',     nameEn:'Natural Frozen Yogurt',    emoji:'🫐', color:'blue',   price:{s:24,m:29,l:34}, costPerG:0.028 },
  { id:'base-fro-van',  type:'frozen',  name:'פרוזן וניל',             nameEn:'Vanilla Frozen Yogurt',    emoji:'🍦', color:'amber',  price:{s:24,m:29,l:34}, costPerG:0.030 },
  { id:'base-fro-str',  type:'frozen',  name:'פרוזן תות',              nameEn:'Strawberry Frozen Yogurt', emoji:'🍓', color:'rose',   price:{s:24,m:29,l:34}, costPerG:0.032 },
  { id:'base-fro-man',  type:'frozen',  name:'פרוזן מנגו',             nameEn:'Mango Frozen Yogurt',      emoji:'🥭', color:'amber',  price:{s:24,m:29,l:34}, costPerG:0.030 },
  { id:'base-fro-choc', type:'frozen',  name:'פרוזן שוקולד',           nameEn:'Chocolate Frozen Yogurt',  emoji:'🍫', color:'brown',  price:{s:26,m:31,l:36}, costPerG:0.035 },
  { id:'base-fro-pis',  type:'frozen',  name:'פרוזן פיסטוק',           nameEn:'Pistachio Frozen Yogurt',  emoji:'🌿', color:'green',  price:{s:29,m:34,l:39}, costPerG:0.040 },
  // יוגורט טרי
  { id:'base-yog-nat',  type:'yogurt',  name:'יוגורט יווני טבעי',      nameEn:'Natural Greek Yogurt',     emoji:'🥛', color:'blue',   price:{s:24,m:29,l:34}, costPerG:0.022 },
  { id:'base-yog-van',  type:'yogurt',  name:'יוגורט וניל',            nameEn:'Vanilla Yogurt',           emoji:'🍦', color:'amber',  price:{s:24,m:29,l:34}, costPerG:0.024 },
  { id:'base-yog-str',  type:'yogurt',  name:'יוגורט תות',             nameEn:'Strawberry Yogurt',        emoji:'🍓', color:'rose',   price:{s:24,m:29,l:34}, costPerG:0.025 },
  // גלידה קפואה
  { id:'base-ice-van',  type:'icecream',name:'גלידה וניל',              nameEn:'Vanilla Ice Cream',        emoji:'🍦', color:'amber',  price:{s:15,m:22,l:26}, costPerG:0.055 },
  { id:'base-ice-choc', type:'icecream',name:'גלידה שוקולד',           nameEn:'Chocolate Ice Cream',      emoji:'🍫', color:'brown',  price:{s:15,m:22,l:26}, costPerG:0.058 },
  { id:'base-ice-str',  type:'icecream',name:'גלידה תות',              nameEn:'Strawberry Ice Cream',     emoji:'🍓', color:'rose',   price:{s:15,m:22,l:26}, costPerG:0.058 },
  { id:'base-ice-pis',  type:'icecream',name:'גלידה פיסטוק',           nameEn:'Pistachio Ice Cream',      emoji:'🌿', color:'green',  price:{s:17,m:24,l:28}, costPerG:0.065 },
  { id:'base-ice-dub',  type:'icecream',name:'גלידת דובאי',            nameEn:'Dubai Ice Cream',          emoji:'⭐', color:'gold',   price:{s:22,m:30,l:35}, costPerG:0.075 },
]

// ── גדלים ─────────────────────────────────────────────────────────────────────
export const sizes = [
  { id:'s', label:'קטן', labelEn:'Small',  grams:150 },
  { id:'m', label:'בינוני', labelEn:'Medium', grams:220 },
  { id:'l', label:'גדול', labelEn:'Large',  grams:300 },
]

// ── קטגוריות תוספות ───────────────────────────────────────────────────────────
export const toppingCategories = [
  { id:'dry',    label:'יבש וקראנצ\'י',   labelEn:'Dry & Crunchy',   emoji:'🌾' },
  { id:'fresh',  label:'פירות טריים',      labelEn:'Fresh Fruits',    emoji:'🍓' },
  { id:'frozen', label:'פירות קפואים',     labelEn:'Frozen Fruits',   emoji:'❄️' },
  { id:'sauce',  label:'רוטב וקרם',        labelEn:'Sauces & Creams', emoji:'🍯' },
  { id:'candy',  label:'ממתקים וקישוט',   labelEn:'Candy & Decor',   emoji:'🍬' },
  { id:'special',label:'תוספות מיוחדות',  labelEn:'Specials',        emoji:'✨' },
]

// ── כל התוספות ────────────────────────────────────────────────────────────────
export const toppings = [

  // ── יבש וקראנצ'י ──────────────────────────────────────────────────────────
  { id:'top-gran-nat',  cat:'dry',    name:'גרנולה טבעית',         nameEn:'Natural Granola',          price:3,  cost:0.8,  emoji:'🌾', popular:true  },
  { id:'top-gran-choc', cat:'dry',    name:'גרנולה שוקולד',        nameEn:'Chocolate Granola',        price:3,  cost:1.0,  emoji:'🍫'               },
  { id:'top-corn-fl',   cat:'dry',    name:'קורנפלקס',              nameEn:'Corn Flakes',              price:2,  cost:0.5,  emoji:'🌽', popular:true  },
  { id:'top-oreo',      cat:'dry',    name:'פירורי אוראו',          nameEn:'Oreo Crumbles',            price:4,  cost:1.2,  emoji:'🍪', popular:true  },
  { id:'top-lotus',     cat:'dry',    name:'קרמבל לוטוס',           nameEn:'Lotus Crumble',            price:4,  cost:1.3,  emoji:'🍪', popular:true  },
  { id:'top-wafer',     cat:'dry',    name:'פירורי ופל',            nameEn:'Wafer Crumbles',           price:3,  cost:0.7,  emoji:'🧇'               },
  { id:'top-alm-sl',   cat:'dry',    name:'שקדים פרוסים קלויים',  nameEn:'Toasted Sliced Almonds',   price:4,  cost:1.5,  emoji:'🌰'               },
  { id:'top-pist-cr',  cat:'dry',    name:'פיסטוק קצוץ',           nameEn:'Crushed Pistachio',        price:5,  cost:2.0,  emoji:'🌿', popular:true  },
  { id:'top-pec-car',  cat:'dry',    name:'פקאן קרמל',             nameEn:'Caramel Pecan',            price:5,  cost:2.2,  emoji:'🌰'               },
  { id:'top-coc-fl',   cat:'dry',    name:'פתיתי קוקוס קלויים',   nameEn:'Toasted Coconut Flakes',   price:3,  cost:0.9,  emoji:'🥥'               },
  { id:'top-brownie',  cat:'dry',    name:'פירורי בראוני',         nameEn:'Brownie Crumbles',         price:4,  cost:1.8,  emoji:'🍫'               },
  { id:'top-kataifi',  cat:'dry',    name:'קדאיף קלוי',            nameEn:'Toasted Kataifi',          price:5,  cost:2.0,  emoji:'✨', popular:true  },
  { id:'top-halva',    cat:'dry',    name:'פירורי חלווה',          nameEn:'Halva Crumbles',           price:4,  cost:1.2,  emoji:'🌿'               },

  // ── פירות טריים ──────────────────────────────────────────────────────────
  { id:'top-str-fr',   cat:'fresh',  name:'תות טרי חתוך',          nameEn:'Fresh Strawberry',         price:5,  cost:2.5,  emoji:'🍓', popular:true  },
  { id:'top-ban-fr',   cat:'fresh',  name:'בננה טרייה',            nameEn:'Fresh Banana',             price:3,  cost:0.8,  emoji:'🍌'               },
  { id:'top-kiwi-fr',  cat:'fresh',  name:'קיווי טרי',             nameEn:'Fresh Kiwi',               price:4,  cost:2.0,  emoji:'🥝'               },
  { id:'top-man-fr',   cat:'fresh',  name:'מנגו טרי',              nameEn:'Fresh Mango',              price:5,  cost:2.8,  emoji:'🥭', popular:true  },
  { id:'top-pine-fr',  cat:'fresh',  name:'אננס טרי',              nameEn:'Fresh Pineapple',          price:4,  cost:1.8,  emoji:'🍍'               },
  { id:'top-blue-fr',  cat:'fresh',  name:'אוכמניות טריות',        nameEn:'Fresh Blueberries',        price:6,  cost:3.5,  emoji:'🫐', popular:true  },
  { id:'top-rasp-fr',  cat:'fresh',  name:'פטל טרי',               nameEn:'Fresh Raspberries',        price:6,  cost:3.5,  emoji:'🍇'               },

  // ── פירות קפואים ─────────────────────────────────────────────────────────
  { id:'top-str-frz',  cat:'frozen', name:'תות קפוא',              nameEn:'Frozen Strawberry',        price:4,  cost:1.5,  emoji:'🍓', popular:true  },
  { id:'top-blue-frz', cat:'frozen', name:'אוכמניות קפואות',       nameEn:'Frozen Blueberries',       price:4,  cost:2.0,  emoji:'🫐', popular:true  },
  { id:'top-rasp-frz', cat:'frozen', name:'פטל קפוא',              nameEn:'Frozen Raspberry',         price:4,  cost:2.0,  emoji:'🍇'               },
  { id:'top-man-frz',  cat:'frozen', name:'מנגו קפוא',             nameEn:'Frozen Mango',             price:4,  cost:1.8,  emoji:'🥭', popular:true  },
  { id:'top-pine-frz', cat:'frozen', name:'אננס קפוא',             nameEn:'Frozen Pineapple',         price:3,  cost:1.2,  emoji:'🍍'               },
  { id:'top-lychee-frz',cat:'frozen',name:"ליצ'י קפוא",           nameEn:'Frozen Lychee',            price:5,  cost:2.5,  emoji:'🌸', popular:true  },
  { id:'top-pass-frz', cat:'frozen', name:'פסיפלורה קפואה',        nameEn:'Frozen Passion Fruit',     price:5,  cost:2.8,  emoji:'🌺'               },
  { id:'top-cher-frz', cat:'frozen', name:'דובדבן קפוא',           nameEn:'Frozen Cherry',            price:4,  cost:2.0,  emoji:'🍒'               },

  // ── רוטב וקרם ────────────────────────────────────────────────────────────
  { id:'top-choc-s',   cat:'sauce',  name:'רוטב שוקולד מריר',      nameEn:'Dark Chocolate Sauce',     price:3,  cost:0.8,  emoji:'🍫', popular:true  },
  { id:'top-wchoc-s',  cat:'sauce',  name:'רוטב שוקולד לבן',       nameEn:'White Chocolate Sauce',    price:3,  cost:0.9,  emoji:'🤍', popular:true  },
  { id:'top-mchoc-s',  cat:'sauce',  name:'רוטב שוקולד חלב',       nameEn:'Milk Chocolate Sauce',     price:3,  cost:0.85, emoji:'🍫', popular:true  },
  { id:'top-car-s',    cat:'sauce',  name:'רוטב קרמל',             nameEn:'Caramel Sauce',            price:3,  cost:0.8,  emoji:'🍯', popular:true  },
  { id:'top-salt-car', cat:'sauce',  name:'רוטב קרמל מלוח',        nameEn:'Salted Caramel Sauce',     price:4,  cost:1.0,  emoji:'🧂', popular:true  },
  { id:'top-bagel-s',  cat:'sauce',  name:'רוטב ביגלה מלוח',       nameEn:'Salted Bagel Sauce',       price:4,  cost:1.2,  emoji:'🥨', popular:true  },
  { id:'top-pist-s',   cat:'sauce',  name:'רוטב פיסטוק',           nameEn:'Pistachio Sauce',          price:4,  cost:1.5,  emoji:'🌿', popular:true  },
  { id:'top-lotus-s',  cat:'sauce',  name:'רוטב לוטוס',            nameEn:'Lotus Sauce',              price:4,  cost:1.2,  emoji:'🍪', popular:true  },
  { id:'top-bueno-s',  cat:'sauce',  name:'רוטב קינדר בואנו',      nameEn:'Kinder Bueno Sauce',       price:5,  cost:2.0,  emoji:'🍫', popular:true  },
  { id:'top-nutella',  cat:'sauce',  name:'נוטלה',                 nameEn:'Nutella',                  price:4,  cost:1.5,  emoji:'🍫', popular:true  },
  { id:'top-honey',    cat:'sauce',  name:'דבש',                   nameEn:'Honey',                    price:3,  cost:1.0,  emoji:'🍯'               },
  { id:'top-con-milk', cat:'sauce',  name:'ריבת חלב (דולסה)',      nameEn:'Dulce de Leche',           price:4,  cost:1.2,  emoji:'🥛', popular:true  },
  { id:'top-str-s',    cat:'sauce',  name:'קולי תות',              nameEn:'Strawberry Coulis',        price:4,  cost:1.5,  emoji:'🍓'               },
  { id:'top-man-s',    cat:'sauce',  name:'קולי מנגו',             nameEn:'Mango Coulis',             price:4,  cost:1.8,  emoji:'🥭'               },
  { id:'top-rasp-s',   cat:'sauce',  name:'קולי פטל',              nameEn:'Raspberry Coulis',         price:4,  cost:1.8,  emoji:'🍇'               },
  { id:'top-cream-ch', cat:'sauce',  name:'קרם גבינה',             nameEn:'Cream Cheese',             price:4,  cost:1.8,  emoji:'🧀'               },
  { id:'top-lemon-c',  cat:'sauce',  name:'קרד לימון',             nameEn:'Lemon Curd',               price:4,  cost:1.6,  emoji:'🍋'               },
  { id:'top-tahini',   cat:'sauce',  name:'טחינה מתוקה',           nameEn:'Sweet Tahini',             price:4,  cost:1.0,  emoji:'🌿'               },
  { id:'top-rose-s',   cat:'sauce',  name:'סירופ מי ורדים',        nameEn:'Rose Water Syrup',         price:3,  cost:0.8,  emoji:'🌹'               },
  { id:'top-maple',    cat:'sauce',  name:'סירופ מייפל',           nameEn:'Maple Syrup',              price:4,  cost:1.4,  emoji:'🍁'               },

  // ── ממתקים וקישוט ─────────────────────────────────────────────────────────
  { id:'top-sprink',   cat:'candy',  name:'ספרינקלס צבעוני',       nameEn:'Rainbow Sprinkles',        price:2,  cost:0.4,  emoji:'🌈', popular:true  },
  { id:'top-sprink-ch',cat:'candy',  name:'ספרינקלס שוקולד',       nameEn:'Chocolate Sprinkles',      price:2,  cost:0.4,  emoji:'🍫'               },
  { id:'top-m-and-m',  cat:'candy',  name:"M&M'S",                  nameEn:"M&M'S",                    price:5,  cost:2.0,  emoji:'🔴', popular:true  },
  { id:'top-kit-kat',  cat:'candy',  name:'קיט-קט',                nameEn:'Kit-Kat',                  price:5,  cost:2.5,  emoji:'🍫'               },
  { id:'top-kinder',   cat:'candy',  name:'קינדר בואנו',           nameEn:'Kinder Bueno',             price:6,  cost:3.0,  emoji:'🍫', popular:true  },
  { id:'top-haribo',   cat:'candy',  name:'הריבו',                 nameEn:'Haribo Gummies',           price:4,  cost:1.5,  emoji:'🐻'               },
  { id:'top-marsh',    cat:'candy',  name:'מרשמלו',                nameEn:'Marshmallow',              price:3,  cost:0.8,  emoji:'☁️'               },
  { id:'top-pop-rock', cat:'candy',  name:'סוסים מתפרצים',         nameEn:'Popping Candy',            price:4,  cost:1.5,  emoji:'💥', popular:true  },
  { id:'top-choc-ch',  cat:'candy',  name:'שברי שוקולד',           nameEn:'Chocolate Chips',          price:3,  cost:1.0,  emoji:'🍫'               },
  { id:'top-wafer-st', cat:'candy',  name:'מקל ופר',               nameEn:'Wafer Stick',              price:2,  cost:0.5,  emoji:'🪄'               },
  { id:'top-edible-fl',cat:'candy',  name:'פרחים אכילים',          nameEn:'Edible Flowers',           price:5,  cost:2.0,  emoji:'🌸'               },

  // ── תוספות מיוחדות ────────────────────────────────────────────────────────
  { id:'top-dub-knf',  cat:'special',name:'קדאיף דובאי + פיסטוק', nameEn:'Dubai Kataifi + Pistachio',price:8,  cost:3.5,  emoji:'⭐', popular:true  },
  { id:'top-rose-pet', cat:'special',name:'עלי ורד מגובשים',       nameEn:'Crystallized Rose Petals', price:5,  cost:2.0,  emoji:'🌹'               },
  { id:'top-gold-leaf',cat:'special',name:'עלי זהב 23K',          nameEn:'23K Gold Leaf',            price:10, cost:5.0,  emoji:'✨'               },
  { id:'top-mochi',    cat:'special',name:'מוצ\'י',                nameEn:"Mochi",                    price:6,  cost:2.5,  emoji:'🍡', popular:true  },
  { id:'top-cheesec',  cat:'special',name:'פירורי עוגת גבינה',    nameEn:'Cheesecake Crumble',       price:5,  cost:2.0,  emoji:'🍰', popular:true  },
  { id:'top-tiramisu', cat:'special',name:'פירורי טירמיסו',        nameEn:'Tiramisu Crumble',         price:5,  cost:2.2,  emoji:'☕'               },
  { id:'top-hum-pist', cat:'special',name:'חומוס פיסטוק',         nameEn:'Pistachio Hummus',         price:6,  cost:2.5,  emoji:'🌿'               },
  { id:'top-lychee-jl',cat:'special',name:"ג'לי ליצ'י",           nameEn:'Lychee Jelly',             price:5,  cost:2.0,  emoji:'🌸', popular:true  },
  { id:'top-coco-jl',  cat:'special',name:"ג'לי קוקוס",           nameEn:'Coconut Jelly',            price:5,  cost:1.8,  emoji:'🥥'               },
  { id:'top-basil-s',  cat:'special',name:'שנטד בסיל',            nameEn:'Basil Whipped',            price:5,  cost:2.0,  emoji:'🌿'               },
]

// ── קומבינות מוגדרות מראש ─────────────────────────────────────────────────────
export const signatureCombos = [
  {
    id:'combo-dubai',
    name:'קערת הדובאי',
    nameEn:'The Dubai Bowl',
    emoji:'⭐',
    baseId:'base-fro-nat',
    size:'m',
    toppingIds:['top-dub-knf','top-pist-s','top-rose-pet'],
    price:52,
    tags:['sig','hot'],
    description:'פרוזן יוגורט טבעי עם קדאיף דובאי, רוטב פיסטוק ועלי ורד מגובשים',
  },
  {
    id:'combo-berry',
    name:'פצצת פירות יער',
    nameEn:'Berry Explosion',
    emoji:'🫐',
    baseId:'base-fro-van',
    size:'m',
    toppingIds:['top-blue-frz','top-str-fr','top-rasp-frz','top-str-s'],
    price:44,
    tags:['veg','new'],
    description:'פרוזן וניל עם אוכמניות, תות, פטל קפוא ורוטב תות',
  },
  {
    id:'combo-coco',
    name:'גן עדן קוקוס',
    nameEn:'Coconut Paradise',
    emoji:'🥥',
    baseId:'base-fro-man',
    size:'m',
    toppingIds:['top-man-frz','top-coc-fl','top-pass-frz','top-coco-jl'],
    price:46,
    tags:['veg'],
    description:'פרוזן מנגו עם מנגו קפוא, קוקוס קלוי, פסיפלורה וג\'לי קוקוס',
  },
  {
    id:'combo-choc',
    name:'חלום שוקולד',
    nameEn:'Chocolate Dream',
    emoji:'🍫',
    baseId:'base-fro-choc',
    size:'m',
    toppingIds:['top-brownie','top-nutella','top-kinder','top-marsh'],
    price:48,
    tags:['hot','sig'],
    description:'פרוזן שוקולד עם פירורי בראוני, נוטלה, קינדר ומרשמלו',
  },
  {
    id:'combo-health',
    name:'קערת בריאות',
    nameEn:'Wellness Bowl',
    emoji:'🌿',
    baseId:'base-yog-nat',
    size:'l',
    toppingIds:['top-gran-nat','top-blue-fr','top-str-fr','top-honey'],
    price:42,
    tags:['veg'],
    description:'יוגורט יווני עם גרנולה טבעית, אוכמניות ותות טריים ודבש',
  },
]

// ── כמויות לגדלים ────────────────────────────────────────────────────────────
export const sizeGrams = { s:150, m:220, l:300 }

// ── צבעים לבסיסים ────────────────────────────────────────────────────────────
export const baseColors = {
  blue:   'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300',
  amber:  'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300',
  rose:   'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300',
  green:  'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
  brown:  'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  gold:   'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
}

export const baseTypes = {
  frozen:   { label:'פרוזן יוגורט', labelEn:'Frozen Yogurt', emoji:'🍧' },
  yogurt:   { label:'יוגורט טרי',   labelEn:'Fresh Yogurt',  emoji:'🥛' },
  icecream: { label:'גלידה',        labelEn:'Ice Cream',      emoji:'🍦' },
}
