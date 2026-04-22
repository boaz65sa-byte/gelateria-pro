/**
 * ═══════════════════════════════════════════════════════════════
 *  Sweet Station — תפריט מלא
 *  מקור: תפריט Yogo's + תוספות בעל העסק
 * ═══════════════════════════════════════════════════════════════
 *
 * כל מנה מכילה:
 *  id, name, nameEn, category, price, description
 *  ingredients: [{ name, qty, unit, costPerUnit }]
 *   → costPerUnit = עלות ל-יחידה (₪) — ניתן לעדכן
 *  overheadPct: % תקורה (חשמל, שכר, שכ"ד) — ברירת מחדל 35%
 *  active: מוצג בתפריט?
 *  tags: ['new','hot','veg','sig']
 */

const genId = () => `item-${Math.random().toString(36).slice(2,9)}`

export const menuCategories = [
  { id:'waffle',    label:'וופל בלגי',           labelEn:'Belgian Waffle',      emoji:'🧇' },
  { id:'pancake',   label:'פנקייק',               labelEn:'Pancake',             emoji:'🥞' },
  { id:'crepe',     label:'קרפ צרפתי',            labelEn:'French Crêpe',        emoji:'🫓' },
  { id:'world',     label:'קינוחים מסביב לעולם', labelEn:'Desserts Around World',emoji:'🌍' },
  { id:'icecream',  label:'גלידה',                labelEn:'Ice Cream',           emoji:'🍦' },
  { id:'premium',   label:'גלידות פרימיום',       labelEn:'Premium Ice Cream',   emoji:'⭐' },
  { id:'yogurt',    label:'יוגורט',               labelEn:'Yogurt',              emoji:'🥛' },
  { id:'frozen',    label:'פרוזן יוגורט',         labelEn:'Frozen Yogurt',       emoji:'🍧' },
  { id:'trendy',    label:'פינת טרנדים BIG & GIG',labelEn:'Trendy Corner',       emoji:'🎯' },
  { id:'coco',      label:'קוקו סדרה',            labelEn:'Coco Series',         emoji:'🥥' },
  { id:'deals',     label:"Yogo's Deals",          labelEn:"Yogo's Deals",        emoji:'🎉' },
  { id:'drinks',    label:'משקאות',               labelEn:'Drinks',              emoji:'☕' },
]

// Default overhead %
const OVH = 35

export const defaultMenuItems = [

  // ══════════════════════════════════════════════
  //  וופל בלגי
  // ══════════════════════════════════════════════
  {
    id:'waf-1', category:'waffle', active:true, tags:['hot'],
    name:'וופל בהרכבה אישית', nameEn:'Build Your Own Waffle',
    price:47, overheadPct:OVH,
    description:'וופל בלגי עם 3 תוספות לבחירה, מוגש עם כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת וופל',   qty:120, unit:'g',   costPerUnit:0.018},
      {name:'כדור גלידה',   qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',         qty:30,  unit:'g',   costPerUnit:0.04},
      {name:'תוספת ×3',     qty:3,   unit:'יח׳', costPerUnit:1.5},
    ],
  },
  {
    id:'waf-2', category:'waffle', active:true, tags:['sig'],
    name:'וופל אצבעות לואקר', nameEn:'Waffle Loacker',
    price:52, overheadPct:OVH,
    description:'וופל בלגי עם קרם לואקר, אצבעות לואקר, קרם אגוזי לוז, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת וופל',   qty:120, unit:'g',   costPerUnit:0.018},
      {name:'קרם לואקר',   qty:40,  unit:'g',   costPerUnit:0.09},
      {name:'אצבעות לואקר',qty:30,  unit:'g',   costPerUnit:0.12},
      {name:'קרם אגוזים',  qty:20,  unit:'g',   costPerUnit:0.08},
      {name:'כדור גלידה',  qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',        qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'waf-3', category:'waffle', active:true, tags:['hot'],
    name:'וופל אוראו הרשיז', nameEn:'Waffle Oreo Hershey\'s',
    price:49, overheadPct:OVH,
    description:'וופל בלגי עם רוטב הרשיז, עוגיות אוראו, קרם שוקולד לבן, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת וופל',    qty:120, unit:'g',   costPerUnit:0.018},
      {name:'רוטב הרשיז',    qty:35,  unit:'g',   costPerUnit:0.08},
      {name:'עוגיות אוראו',  qty:30,  unit:'g',   costPerUnit:0.07},
      {name:'קרם שוקולד לבן',qty:25,  unit:'g',   costPerUnit:0.09},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'waf-4', category:'waffle', active:true, tags:['sig','hot'],
    name:'וופל בננה לוטי', nameEn:'Lottie Banana Waffle',
    price:69, overheadPct:OVH,
    description:'וופל בלגי עם שוקולד לבן, שברי פקאן מסוכרים, בצק פילאס במילוי בננות מקורמלות, קרם פטיסייר, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת וופל',    qty:120, unit:'g',   costPerUnit:0.018},
      {name:'שוקולד לבן',    qty:30,  unit:'g',   costPerUnit:0.09},
      {name:'פקאן מסוכר',    qty:25,  unit:'g',   costPerUnit:0.14},
      {name:'בצק פילאס',     qty:50,  unit:'g',   costPerUnit:0.07},
      {name:'בננה',          qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'קרם פטיסייר',   qty:40,  unit:'g',   costPerUnit:0.05},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'waf-5', category:'waffle', active:true, tags:['sig'],
    name:'וופל קרם בורלה', nameEn:'Waffle Cream Brulée',
    price:59, overheadPct:OVH,
    description:'וופל בלגי עם רוטב שוקולד לבן וורוטב פיסטוק, שברי פיסטוק, קרם בורלה, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת וופל',    qty:120, unit:'g',   costPerUnit:0.018},
      {name:'שוקולד לבן',    qty:25,  unit:'g',   costPerUnit:0.09},
      {name:'רוטב פיסטוק',   qty:25,  unit:'g',   costPerUnit:0.12},
      {name:'שברי פיסטוק',   qty:20,  unit:'g',   costPerUnit:0.16},
      {name:'קרם בורלה',     qty:45,  unit:'g',   costPerUnit:0.07},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },

  // ══════════════════════════════════════════════
  //  פנקייק
  // ══════════════════════════════════════════════
  {
    id:'pan-1', category:'pancake', active:true, tags:[],
    name:'פנקייק בהרכבה אישית', nameEn:'Build Your Own Pancake',
    price:57, overheadPct:OVH,
    description:'2 פנקייק שמנמנים עם 3 תוספות לבחירה, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
      {name:'תוספת ×3',      qty:3,   unit:'יח׳', costPerUnit:1.5},
    ],
  },
  {
    id:'pan-2', category:'pancake', active:true, tags:['sig'],
    name:'פנקייק אלפחורס', nameEn:'Pancake Alfajores',
    price:67, overheadPct:OVH,
    description:'2 פנקייק שמנמנים, קרם שוקולד לבן, זוג עוגיות אלפחורס, ריבת חלב ומוקוס קלוי, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'קרם שוקולד לבן',qty:35,  unit:'g',   costPerUnit:0.09},
      {name:'עוגיות אלפחורס',qty:40,  unit:'g',   costPerUnit:0.11},
      {name:'ריבת חלב',      qty:30,  unit:'g',   costPerUnit:0.06},
      {name:'קוקוס קלוי',    qty:10,  unit:'g',   costPerUnit:0.05},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'pan-3', category:'pancake', active:true, tags:['hot'],
    name:'פנקייק ביגלה מלוח', nameEn:'Pancake Salted Bagel',
    price:72, overheadPct:OVH,
    description:'2 פנקייק שמנמנים, רוטב ביגלה מלוח, שברי ביגלה וקרם אגוזי לוז, קרם משולש ביגלה מלוח, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'רוטב ביגלה',    qty:35,  unit:'g',   costPerUnit:0.08},
      {name:'ביגלה שברים',   qty:25,  unit:'g',   costPerUnit:0.06},
      {name:'קרם אגוזים',    qty:30,  unit:'g',   costPerUnit:0.08},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'pan-4', category:'pancake', active:true, tags:[],
    name:'פנקייק לוטוס', nameEn:'Pancake Lotus',
    price:59, overheadPct:OVH,
    description:'2 פנקייק שמנמנים, גנאש שוקולד לבן, עוגיות לוטוס וקרמבל לוטוס, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'גנאש שוקולד לבן',qty:35, unit:'g',   costPerUnit:0.09},
      {name:'עוגיות לוטוס',  qty:35,  unit:'g',   costPerUnit:0.09},
      {name:'קרמבל לוטוס',   qty:20,  unit:'g',   costPerUnit:0.08},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'pan-5', category:'pancake', active:true, tags:['sig','hot'],
    name:'פנקייק פררו רושה', nameEn:'Pancake Ferrero Rocher',
    price:72, overheadPct:OVH,
    description:'2 פנקייק שמנמנים, רוטב פררו רושה, שברי אגוזים מסוכרים, קרם אגוזי לוז, פררו רושה כדור ענקי, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'רוטב פררו',     qty:35,  unit:'g',   costPerUnit:0.11},
      {name:'אגוזי לוז',     qty:25,  unit:'g',   costPerUnit:0.13},
      {name:'קרם נוגה',      qty:30,  unit:'g',   costPerUnit:0.08},
      {name:'פררו רושה',     qty:1,   unit:'יח׳', costPerUnit:3.5},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },

  // ══════════════════════════════════════════════
  //  קרפ צרפתי
  // ══════════════════════════════════════════════
  {
    id:'crp-1', category:'crepe', active:true, tags:[],
    name:'קרפ בהרכבה אישית', nameEn:'Build Your Own Crêpe',
    price:20, overheadPct:OVH,
    description:'קרפ עם 2 רטבים לבחירה ותוספת אחת לבחירה',
    ingredients:[
      {name:'בלילת קרפ',    qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'רטב ×2',       qty:2,   unit:'יח׳', costPerUnit:1.0},
      {name:'תוספת ×1',     qty:1,   unit:'יח׳', costPerUnit:1.2},
    ],
  },
  {
    id:'crp-2', category:'crepe', active:true, tags:[],
    name:'קרפ צרפתי קלאסי', nameEn:'Classic French Crêpe',
    price:22, overheadPct:OVH,
    description:'קרפ עם סוכר, לימון סחוט וקינמון',
    ingredients:[
      {name:'בלילת קרפ',    qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'סוכר',         qty:15,  unit:'g',   costPerUnit:0.005},
      {name:'לימון',        qty:20,  unit:'g',   costPerUnit:0.01},
      {name:'קינמון',       qty:2,   unit:'g',   costPerUnit:0.02},
    ],
  },
  {
    id:'crp-3', category:'crepe', active:true, tags:['sig'],
    name:'קרפ כנאפה', nameEn:'Knafeh Crêpe',
    price:62, overheadPct:OVH,
    description:'קרפ עם רוטב שוקולד לבן, שברי פיסטוק, בתוכו מונח כנאפה חם',
    ingredients:[
      {name:'בלילת קרפ',    qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'שוקולד לבן',   qty:25,  unit:'g',   costPerUnit:0.09},
      {name:'פיסטוק טחון',  qty:20,  unit:'g',   costPerUnit:0.16},
      {name:'כנאפה',        qty:90,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',         qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'crp-4', category:'crepe', active:true, tags:['hot'],
    name:'קרפ בננה לוטי', nameEn:'Banana Lottie Crêpe',
    price:52, overheadPct:OVH,
    description:'קרפ עם רוטב שוקולד אגוזים, בננות, ריבת חלב, שוקולד לבן, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת קרפ',    qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'נוטלה',        qty:35,  unit:'g',   costPerUnit:0.065},
      {name:'בננה',         qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'ריבת חלב',     qty:25,  unit:'g',   costPerUnit:0.06},
      {name:'שוקולד לבן',   qty:20,  unit:'g',   costPerUnit:0.09},
      {name:'כדור גלידה',   qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',         qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'crp-5', category:'crepe', active:true, tags:['sig'],
    name:'קרפ רול דאבל מקופלת', nameEn:'Double Folded Roll Crêpe',
    price:52, overheadPct:OVH,
    description:'קרפ עם רוטב שוקולד אגוזים, שוקולד לבן, מקופלת חומה ולבנה, כדור גלידה וקצפת',
    ingredients:[
      {name:'בלילת קרפ',    qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'נוטלה',        qty:30,  unit:'g',   costPerUnit:0.065},
      {name:'שוקולד לבן',   qty:25,  unit:'g',   costPerUnit:0.09},
      {name:'מקופלת',       qty:15,  unit:'g',   costPerUnit:0.08},
      {name:'כדור גלידה',   qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',         qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },

  // ══════════════════════════════════════════════
  //  קינוחים מסביב לעולם
  // ══════════════════════════════════════════════
  {
    id:'wld-1', category:'world', active:true, tags:[],
    name:'עוגה אישית', nameEn:'Personal Cake',
    price:25, overheadPct:OVH,
    description:'עוגה אישית לבחירה',
    ingredients:[{name:'עוגה',qty:120,unit:'g',costPerUnit:0.055}],
  },
  {
    id:'wld-2', category:'world', active:true, tags:['hot'],
    name:'כנאפה תורקי אינטייו', nameEn:'Turkish Knafeh',
    price:25, overheadPct:OVH,
    description:'כנאפה תורקי עם פיסטוק וסירופ מי סוכר, תוספת כדור גלידה ₪7',
    ingredients:[
      {name:'כנאפה',         qty:150, unit:'g',   costPerUnit:0.05},
      {name:'פיסטוק טחון',   qty:15,  unit:'g',   costPerUnit:0.16},
      {name:'סירופ סוכר',    qty:20,  unit:'ml',  costPerUnit:0.02},
    ],
  },
  {
    id:'wld-3', category:'world', active:true, tags:[],
    name:'קוקי גלידה', nameEn:'Ice Cream Cookie',
    price:32, overheadPct:OVH,
    description:'זוג עוגיות קוקי, כדור גלידה, קצפת ותוספת לבחירה',
    ingredients:[
      {name:'עוגיית קוקי',   qty:2,   unit:'יח׳', costPerUnit:2.2},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'wld-4', category:'world', active:true, tags:['sig'],
    name:'בננה לוטי', nameEn:'Banana Lottie',
    price:49, overheadPct:OVH,
    description:'מאפה בצק פילאס במילוי בננות מקורמלות, קרם פטיסייר, גנאש שוקולד לבן, שברי פקאן, כדור גלידה וקצפת',
    ingredients:[
      {name:'בצק פילאס',     qty:60,  unit:'g',   costPerUnit:0.07},
      {name:'בננה',          qty:80,  unit:'g',   costPerUnit:0.012},
      {name:'קרם פטיסייר',   qty:40,  unit:'g',   costPerUnit:0.05},
      {name:'גנאש שוקולד',   qty:25,  unit:'g',   costPerUnit:0.09},
      {name:'פקאן',          qty:20,  unit:'g',   costPerUnit:0.14},
      {name:'כדור גלידה',    qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'קצפת',          qty:30,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'wld-5', category:'world', active:true, tags:[],
    name:'אקלר צרפתי', nameEn:'French Éclair',
    price:25, overheadPct:OVH,
    description:'אקלר צרפתי עם טעמים לבחירה: פיסטוק, קרמל מלוח, פטל, שוקולד אגוזים',
    ingredients:[
      {name:'אקלר',          qty:80,  unit:'g',   costPerUnit:0.065},
      {name:'קרם מילוי',     qty:30,  unit:'g',   costPerUnit:0.06},
    ],
  },
  {
    id:'wld-6', category:'world', active:true, tags:['hot'],
    name:'סופלה שוקולד', nameEn:'Chocolate Soufflé',
    price:25, overheadPct:OVH,
    description:'סופלה שוקולד חם',
    ingredients:[
      {name:'שוקולד',        qty:60,  unit:'g',   costPerUnit:0.08},
      {name:'חמאה',          qty:30,  unit:'g',   costPerUnit:0.04},
      {name:'ביצים',         qty:2,   unit:'יח׳', costPerUnit:0.7},
      {name:'סוכר',          qty:25,  unit:'g',   costPerUnit:0.005},
      {name:'קמח',           qty:15,  unit:'g',   costPerUnit:0.004},
    ],
  },
  {
    id:'wld-7', category:'world', active:true, tags:[],
    name:"צ'ורוס ספרדי", nameEn:'Spanish Churros',
    price:45, overheadPct:OVH,
    description:"6 מקלות צ'ורוס, 3 רטבים לבחירה, כדור גלידה וקצפת",
    ingredients:[
      {name:"בלילת צ'ורוס", qty:150, unit:'g',   costPerUnit:0.014},
      {name:'שמן טיגון',    qty:50,  unit:'ml',  costPerUnit:0.01},
      {name:'סוכר קינמון',  qty:15,  unit:'g',   costPerUnit:0.01},
      {name:'רטב ×3',       qty:3,   unit:'יח׳', costPerUnit:0.8},
      {name:'כדור גלידה',   qty:80,  unit:'g',   costPerUnit:0.06},
    ],
  },
  {
    id:'wld-8', category:'world', active:true, tags:['new'],
    name:'קיורטוש מאפה הונגרי', nameEn:'Kürtőskalács',
    price:25, overheadPct:OVH,
    description:'מאפה הונגרי עם טעמים לבחירה: קינמון סוכר, אגוזי לוז, אוראו — הכנה מראש יום לפני',
    ingredients:[
      {name:"בלילת קיורטוש",qty:120, unit:'g',   costPerUnit:0.016},
      {name:'ציפוי',        qty:25,  unit:'g',   costPerUnit:0.05},
    ],
  },

  // ══════════════════════════════════════════════
  //  גלידה
  // ══════════════════════════════════════════════
  {
    id:'ice-1', category:'icecream', active:true, tags:[],
    name:'גלידה קטן', nameEn:'Ice Cream Small',
    price:15, overheadPct:OVH,
    description:'1 כדור גלידה בגביע או קונוס',
    ingredients:[{name:'גלידה',qty:80,unit:'g',costPerUnit:0.06},{name:'גביע/קונוס',qty:1,unit:'יח׳',costPerUnit:0.4}],
  },
  {
    id:'ice-2', category:'icecream', active:true, tags:[],
    name:'גלידה בינוני', nameEn:'Ice Cream Medium',
    price:22, overheadPct:OVH,
    description:'2 כדורי גלידה בגביע או קונוס',
    ingredients:[{name:'גלידה',qty:160,unit:'g',costPerUnit:0.06},{name:'גביע/קונוס',qty:1,unit:'יח׳',costPerUnit:0.4}],
  },
  {
    id:'ice-3', category:'icecream', active:true, tags:[],
    name:'גלידה גדול', nameEn:'Ice Cream Large',
    price:26, overheadPct:OVH,
    description:'3 כדורי גלידה בגביע או קונוס',
    ingredients:[{name:'גלידה',qty:240,unit:'g',costPerUnit:0.06},{name:'גביע/קונוס',qty:1,unit:'יח׳',costPerUnit:0.4}],
  },

  // ══════════════════════════════════════════════
  //  גלידות פרימיום
  // ══════════════════════════════════════════════
  {id:'prm-1',category:'premium',active:true,tags:['new','hot'],name:'גלידה דובאי',nameEn:'Dubai Ice Cream',price:35,overheadPct:OVH,description:'גלידה פרימיום בסגנון דובאי עם קדאיף ופיסטוק',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'קדאיף',qty:20,unit:'g',costPerUnit:0.08},{name:'פיסטוק',qty:15,unit:'g',costPerUnit:0.16},{name:'שוקולד',qty:20,unit:'g',costPerUnit:0.08}]},
  {id:'prm-2',category:'premium',active:true,tags:['new'],name:'גלידה בננה לוטי',nameEn:'Banana Lottie Ice Cream',price:32,overheadPct:OVH,description:'גלידה פרימיום עם בננה, לוטוס וקרמל',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'בננה',qty:40,unit:'g',costPerUnit:0.012},{name:'לוטוס',qty:25,unit:'g',costPerUnit:0.09}]},
  {id:'prm-3',category:'premium',active:true,tags:['new'],name:'גלידה הוואי',nameEn:'Hawaii Ice Cream',price:32,overheadPct:OVH,description:'גלידה פרימיום טרופית עם מנגו ואננס',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'מנגו',qty:40,unit:'g',costPerUnit:0.025},{name:'אננס',qty:30,unit:'g',costPerUnit:0.02}]},
  {id:'prm-4',category:'premium',active:true,tags:['hot'],name:'גלידה קינדר',nameEn:'Kinder Ice Cream',price:33,overheadPct:OVH,description:'גלידה פרימיום עם קינדר בואנו ושוקולד',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'קינדר בואנו',qty:1,unit:'יח׳',costPerUnit:2.5},{name:'שוקולד',qty:20,unit:'g',costPerUnit:0.08}]},
  {id:'prm-5',category:'premium',active:true,tags:[],name:'גלידה מלבי',nameEn:'Malabi Ice Cream',price:32,overheadPct:OVH,description:'גלידה פרימיום בטעם מלבי עם ורדים ופיסטוק',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'מי ורדים',qty:5,unit:'ml',costPerUnit:0.05},{name:'פיסטוק',qty:15,unit:'g',costPerUnit:0.16}]},
  {id:'prm-6',category:'premium',active:true,tags:['sig'],name:'גלידה בורלה',nameEn:'Brûlée Ice Cream',price:34,overheadPct:OVH,description:'גלידה פרימיום קרם בורלה עם קרמל',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'קרמל',qty:25,unit:'g',costPerUnit:0.05}]},
  {id:'prm-7',category:'premium',active:true,tags:[],name:'גלידה רפאלו',nameEn:'Raffaello Ice Cream',price:33,overheadPct:OVH,description:'גלידה פרימיום קוקוס ושקדים',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'קוקוס',qty:20,unit:'g',costPerUnit:0.04},{name:'שקדים',qty:15,unit:'g',costPerUnit:0.12}]},
  {id:'prm-8',category:'premium',active:true,tags:[],name:'גלידה פאי לימון',nameEn:'Lemon Pie Ice Cream',price:33,overheadPct:OVH,description:'גלידה פרימיום לימון עם קרמבל',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'לימון',qty:20,unit:'g',costPerUnit:0.01},{name:'קרמבל',qty:20,unit:'g',costPerUnit:0.05}]},
  {id:'prm-9',category:'premium',active:true,tags:['hot'],name:'גלידה עוגת גבינה',nameEn:'Cheesecake Ice Cream',price:33,overheadPct:OVH,description:'גלידה פרימיום בטעם עוגת גבינה עם קרמבל',ingredients:[{name:'גלידה',qty:120,unit:'g',costPerUnit:0.07},{name:'גבינה לבנה',qty:25,unit:'g',costPerUnit:0.04},{name:'קרמבל',qty:20,unit:'g',costPerUnit:0.05}]},

  // ══════════════════════════════════════════════
  //  יוגורט
  // ══════════════════════════════════════════════
  {id:'yog-1',category:'yogurt',active:true,tags:[],name:'יוגורט קטן',nameEn:'Yogurt Small',price:24,overheadPct:OVH,description:'יוגורט טרי קטן',ingredients:[{name:'יוגורט',qty:150,unit:'g',costPerUnit:0.025}]},
  {id:'yog-2',category:'yogurt',active:true,tags:[],name:'יוגורט בינוני',nameEn:'Yogurt Medium',price:29,overheadPct:OVH,description:'יוגורט טרי בינוני',ingredients:[{name:'יוגורט',qty:220,unit:'g',costPerUnit:0.025}]},
  {id:'yog-3',category:'yogurt',active:true,tags:[],name:'יוגורט גדול',nameEn:'Yogurt Large',price:34,overheadPct:OVH,description:'יוגורט טרי גדול',ingredients:[{name:'יוגורט',qty:300,unit:'g',costPerUnit:0.025}]},

  // ══════════════════════════════════════════════
  //  פרוזן יוגורט
  // ══════════════════════════════════════════════
  {id:'fro-1',category:'frozen',active:true,tags:[],name:'פרוזן יוגורט קטן',nameEn:'Frozen Yogurt Small',price:24,overheadPct:OVH,description:'פרוזן יוגורט קטן',ingredients:[{name:'פרוזן יוגורט',qty:150,unit:'g',costPerUnit:0.03}]},
  {id:'fro-2',category:'frozen',active:true,tags:[],name:'פרוזן יוגורט בינוני',nameEn:'Frozen Yogurt Medium',price:29,overheadPct:OVH,description:'פרוזן יוגורט בינוני',ingredients:[{name:'פרוזן יוגורט',qty:220,unit:'g',costPerUnit:0.03}]},
  {id:'fro-3',category:'frozen',active:true,tags:[],name:'פרוזן יוגורט גדול',nameEn:'Frozen Yogurt Large',price:34,overheadPct:OVH,description:'פרוזן יוגורט גדול',ingredients:[{name:'פרוזן יוגורט',qty:300,unit:'g',costPerUnit:0.03}]},

  // ══════════════════════════════════════════════
  //  פינת טרנדים BIG & GIG
  // ══════════════════════════════════════════════
  {
    id:'trn-1', category:'trendy', active:true, tags:['new','hot'],
    name:'שיפודי מיני פנקייק', nameEn:'Mini Pancake Skewers',
    price:45, overheadPct:OVH,
    description:'שיפודי מיני פנקייק פריכים עם ציפויים וסוסים מתפרצים',
    ingredients:[
      {name:'בלילת מיני פנקייק',qty:120,unit:'g',costPerUnit:0.015},
      {name:'ציפוי שוקולד',     qty:30, unit:'g',costPerUnit:0.07},
      {name:'סוסים מתפרצים',    qty:5,  unit:'g',costPerUnit:0.15},
    ],
  },
  {
    id:'trn-2', category:'trendy', active:true, tags:['new','sig'],
    name:'מגדל ואפל בלגי', nameEn:'Belgian Waffle Tower',
    price:65, overheadPct:OVH,
    description:'מגדל של 3 וופלים בלגיים עם ריבוד קרמים ורטבים',
    ingredients:[
      {name:'בלילת וופל',    qty:360, unit:'g',   costPerUnit:0.018},
      {name:'קרמים ×3',      qty:3,   unit:'יח׳', costPerUnit:3.5},
      {name:'רטבים ×2',      qty:2,   unit:'יח׳', costPerUnit:1.5},
      {name:'קצפת',          qty:60,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'trn-3', category:'trendy', active:true, tags:['new','hot'],
    name:'ארוחה מושחטת', nameEn:'The Beast Meal',
    price:89, overheadPct:OVH,
    description:'וופל גדול, פנקייק, סופלה שוקולד חם עם 7 תוספות לבחירה, 3 כדורי גלידה',
    ingredients:[
      {name:'בלילת וופל',    qty:160, unit:'g',   costPerUnit:0.018},
      {name:'בלילת פנקייק',  qty:160, unit:'g',   costPerUnit:0.015},
      {name:'סופלה',         qty:80,  unit:'g',   costPerUnit:0.06},
      {name:'תוספות ×7',     qty:7,   unit:'יח׳', costPerUnit:1.5},
      {name:'גלידה ×3',      qty:240, unit:'g',   costPerUnit:0.06},
    ],
  },
  {
    id:'trn-4', category:'trendy', active:true, tags:['new'],
    name:'מגש משחיט', nameEn:'The Destroyer Platter',
    price:119, overheadPct:OVH,
    description:'מגש ענק לשיתוף עם כל הטוב — וופלים, פנקייקים, גלידה, סוסים וטופינגים מתפרצים',
    ingredients:[
      {name:'וופלים ×2',     qty:240, unit:'g',   costPerUnit:0.018},
      {name:'פנקייקים ×2',   qty:320, unit:'g',   costPerUnit:0.015},
      {name:'גלידה ×4',      qty:320, unit:'g',   costPerUnit:0.06},
      {name:'טופינגים',      qty:8,   unit:'יח׳', costPerUnit:1.5},
    ],
  },
  {
    id:'trn-5', category:'trendy', active:true, tags:['new','sig'],
    name:'מגש קוקולידות', nameEn:'Choco-Licious Platter',
    price:95, overheadPct:OVH,
    description:'מגש שוקולד אולטימטיבי עם קוקולידות, וופל, גלידה וטופינגים',
    ingredients:[
      {name:'קוקולידות ×4',  qty:4,   unit:'יח׳', costPerUnit:4.5},
      {name:'בלילת וופל',    qty:120, unit:'g',   costPerUnit:0.018},
      {name:'גלידה ×2',      qty:160, unit:'g',   costPerUnit:0.06},
      {name:'טופינגים',      qty:4,   unit:'יח׳', costPerUnit:1.5},
    ],
  },

  // ══════════════════════════════════════════════
  //  קוקו סדרה
  // ══════════════════════════════════════════════
  {
    id:'coc-1', category:'coco', active:true, tags:['new','sig'],
    name:'קוקו וולוט', nameEn:'Coco Velvet',
    price:38, overheadPct:OVH,
    description:'קוקו קטיפה בסיגנון ולוט עם קרם שוקולד עשיר וציפוי קוקוס',
    ingredients:[
      {name:'שוקולד מריר',   qty:50,  unit:'g',   costPerUnit:0.09},
      {name:'שמנת',          qty:60,  unit:'ml',  costPerUnit:0.04},
      {name:'קוקוס',         qty:20,  unit:'g',   costPerUnit:0.04},
      {name:'חמאה',          qty:20,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'coc-2', category:'coco', active:true, tags:['new'],
    name:'קוקו שוקולד', nameEn:'Coco Chocolate',
    price:35, overheadPct:OVH,
    description:'קוקו שוקולד אינטנסיבי עם ציפוי קוקוס',
    ingredients:[
      {name:'שוקולד',        qty:70,  unit:'g',   costPerUnit:0.08},
      {name:'שמנת',          qty:50,  unit:'ml',  costPerUnit:0.04},
      {name:'קוקוס',         qty:15,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'coc-3', category:'coco', active:true, tags:['new','hot'],
    name:'קיקציפס', nameEn:'KikiChips',
    price:36, overheadPct:OVH,
    description:'קוקו פריך עם ציפס שוקולד קראנצ\'י',
    ingredients:[
      {name:'שוקולד',        qty:60,  unit:'g',   costPerUnit:0.08},
      {name:'ציפס קראנצ\'י', qty:25,  unit:'g',   costPerUnit:0.1},
      {name:'קוקוס',         qty:15,  unit:'g',   costPerUnit:0.04},
    ],
  },
  {
    id:'coc-4', category:'coco', active:true, tags:['new'],
    name:'קוקו (בסיס)', nameEn:'Coco Classic',
    price:32, overheadPct:OVH,
    description:'קוקו קלאסי בסיסי עם ציפוי קוקוס',
    ingredients:[
      {name:'שוקולד',        qty:50,  unit:'g',   costPerUnit:0.08},
      {name:'קוקוס',         qty:20,  unit:'g',   costPerUnit:0.04},
      {name:'חמאה',          qty:15,  unit:'g',   costPerUnit:0.04},
    ],
  },

  // ══════════════════════════════════════════════
  //  Deals
  // ══════════════════════════════════════════════
  {id:'deal-1',category:'deals',active:true,tags:['hot'],name:'קומבינה איטלקית',nameEn:'Italian Combo',price:119,overheadPct:OVH,description:'חצי קילו יוגורט + חצי קילו גלידה + 6 תוספות + 4 עוגיות',ingredients:[{name:'יוגורט',qty:500,unit:'g',costPerUnit:0.025},{name:'גלידה',qty:500,unit:'g',costPerUnit:0.06},{name:'תוספות ×6',qty:6,unit:'יח׳',costPerUnit:1.5}]},
  {id:'deal-2',category:'deals',active:true,tags:[],name:'קומבינה צרפתית',nameEn:'French Combo',price:109,overheadPct:OVH,description:'זוג אקלרים בטעמים לבחירה + 4 עוגיות + חצי קילו גלידה',ingredients:[{name:'אקלר ×2',qty:2,unit:'יח׳',costPerUnit:4.5},{name:'גלידה',qty:500,unit:'g',costPerUnit:0.06}]},
  {id:'deal-3',category:'deals',active:true,tags:['hot'],name:'קומבינה אמריקאית',nameEn:'American Combo',price:99,overheadPct:OVH,description:'וופל בלגי אוראו הרשיז + קרם שוקולד לבן + חצי קילו גלידה + 4 עוגיות',ingredients:[{name:'בלילת וופל',qty:120,unit:'g',costPerUnit:0.018},{name:'גלידה',qty:500,unit:'g',costPerUnit:0.06}]},
  {id:'deal-4',category:'deals',active:true,tags:['sig','hot'],name:'שחיתות יוגוס',nameEn:"Yogo's Indulgence",price:150,overheadPct:OVH,description:'2 וופלי פריינג גדולים, 2 פנקייקים, סופלה שוקולד חם עם 7 תוספות, 3 כדורי גלידה',ingredients:[{name:'וופלים ×2',qty:240,unit:'g',costPerUnit:0.018},{name:'פנקייקים ×2',qty:320,unit:'g',costPerUnit:0.015},{name:'סופלה',qty:80,unit:'g',costPerUnit:0.06},{name:'גלידה ×3',qty:240,unit:'g',costPerUnit:0.06}]},
  {id:'deal-5',category:'deals',active:true,tags:[],name:'מיני שחיתות',nameEn:'Mini Indulgence',price:99,overheadPct:OVH,description:'וופל בלגי, פנקייק וסופלה שוקולד חם + 4 תוספות, 2 כדורי גלידה',ingredients:[{name:'וופל',qty:120,unit:'g',costPerUnit:0.018},{name:'פנקייק',qty:160,unit:'g',costPerUnit:0.015},{name:'גלידה ×2',qty:160,unit:'g',costPerUnit:0.06}]},
  {id:'deal-6',category:'deals',active:true,tags:['sig'],name:'פותחים שולחן',nameEn:'Table Opener',price:165,overheadPct:OVH,description:'אצבעות וופל בלגי, מיני פנקייק, סושי קרפ, ויים של תוספות ורטבים',ingredients:[{name:'וופל',qty:240,unit:'g',costPerUnit:0.018},{name:'פנקייק',qty:160,unit:'g',costPerUnit:0.015},{name:'קרפ',qty:120,unit:'g',costPerUnit:0.012},{name:'טופינגים',qty:6,unit:'יח׳',costPerUnit:1.5}]},
  {id:'deal-7',category:'deals',active:true,tags:['new','hot'],name:'פנקייק הר הטעטו',nameEn:'Tattoo Mountain Pancake',price:119,overheadPct:OVH,description:'מגדל של 4 פנקייקים שמשמנים, טופלה שוקולד חם מעל, המון תוספות ורטבים מתפרצים',ingredients:[{name:'פנקייקים ×4',qty:640,unit:'g',costPerUnit:0.015},{name:'סופלה שוקולד',qty:80,unit:'g',costPerUnit:0.06},{name:'טופינגים',qty:6,unit:'יח׳',costPerUnit:1.5}]},

  // ══════════════════════════════════════════════
  //  משקאות
  // ══════════════════════════════════════════════
  {id:'drk-1',category:'drinks',active:true,tags:[],name:'סחלב קטן',nameEn:'Sahlab Small',price:15,overheadPct:OVH,description:'סחלב חם קטן',ingredients:[{name:'תערובת סחלב',qty:200,unit:'ml',costPerUnit:0.025}]},
  {id:'drk-2',category:'drinks',active:true,tags:[],name:'סחלב גדול',nameEn:'Sahlab Large',price:29,overheadPct:OVH,description:'סחלב חם גדול',ingredients:[{name:'תערובת סחלב',qty:350,unit:'ml',costPerUnit:0.025}]},
  {id:'drk-3',category:'drinks',active:true,tags:[],name:'אפוגטו',nameEn:'Affogato',price:20,overheadPct:OVH,description:'אספרסו עם כדור גלידה וניל',ingredients:[{name:'אספרסו',qty:30,unit:'ml',costPerUnit:0.08},{name:'גלידה',qty:80,unit:'g',costPerUnit:0.06}]},
  {id:'drk-4',category:'drinks',active:true,tags:[],name:"קפוצ'ינו / מקיאטו / אמריקנו",nameEn:'Cappuccino / Macchiato / Americano',price:12,overheadPct:OVH,description:'קפה חם',ingredients:[{name:'אספרסו',qty:30,unit:'ml',costPerUnit:0.08},{name:'חלב',qty:150,unit:'ml',costPerUnit:0.006}]},
  {id:'drk-5',category:'drinks',active:true,tags:['hot'],name:'אייס קפה / וניל / תות / שוקו',nameEn:'Iced Coffee / Vanilla / Strawberry / Choco',price:14,overheadPct:OVH,description:'אייס קפה קטן ₪14, גדול ₪17',ingredients:[{name:'אספרסו',qty:30,unit:'ml',costPerUnit:0.08},{name:'חלב',qty:200,unit:'ml',costPerUnit:0.006},{name:'קרח',qty:100,unit:'g',costPerUnit:0.002}]},
  {id:'drk-6',category:'drinks',active:true,tags:[],name:'אייס פקאן / אייס עוגיות',nameEn:'Iced Pecan / Iced Cookies',price:20,overheadPct:OVH,description:'קטן ₪20, גדול ₪24, תוספת קצפת ₪5',ingredients:[{name:'אספרסו',qty:30,unit:'ml',costPerUnit:0.08},{name:'פקאן קרמל',qty:25,unit:'g',costPerUnit:0.12},{name:'חלב',qty:200,unit:'ml',costPerUnit:0.006}]},
  {id:'drk-7',category:'drinks',active:true,tags:['sig'],name:'אייס פיסטוק / קינדר / בואנו / ביגלה מלוח',nameEn:'Iced Pistachio / Kinder / Bueno / Salted Bagel',price:24,overheadPct:OVH,description:'עם קצפת ₪29',ingredients:[{name:'אספרסו',qty:30,unit:'ml',costPerUnit:0.08},{name:'פיסטוק',qty:25,unit:'g',costPerUnit:0.16},{name:'חלב',qty:200,unit:'ml',costPerUnit:0.006}]},
  {id:'drk-8',category:'drinks',active:true,tags:[],name:'סודה / מים',nameEn:'Soda / Water',price:8,overheadPct:OVH,description:'שתייה קלה',ingredients:[{name:'שתייה',qty:330,unit:'ml',costPerUnit:0.01}]},
  {id:'drk-9',category:'drinks',active:true,tags:[],name:'שתייה קלה',nameEn:'Soft Drink',price:9,overheadPct:OVH,description:'שתייה קלה 330ml',ingredients:[{name:'שתייה',qty:330,unit:'ml',costPerUnit:0.018}]},
]

// ── Cost calculation helpers ──────────────────────────────────────────────────

/**
 * חישוב עלות חומרים למנה
 */
export function calcIngredientsCost(item) {
  return item.ingredients.reduce((sum, ing) => {
    return sum + (ing.qty * ing.costPerUnit)
  }, 0)
}

/**
 * חישוב עלות מלאה עם תקורה
 *   totalCost = ingredientsCost / (1 - overheadPct/100)
 */
export function calcTotalCost(item) {
  const ing = calcIngredientsCost(item)
  return ing / (1 - (item.overheadPct || 35) / 100)
}

/**
 * חישוב מרווח גולמי
 */
export function calcMargin(item) {
  const total = calcTotalCost(item)
  if (item.price <= 0) return 0
  return Math.round(((item.price - total) / item.price) * 100)
}

/**
 * מחיר מומלץ למרווח יעד
 */
export function calcRecommendedPrice(item, targetMarginPct = 60) {
  const total = calcTotalCost(item)
  return total / (1 - targetMarginPct / 100)
}

export const TAGS_META = {
  new: { label:'חדש',    color:'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700' },
  hot: { label:'טרנד',   color:'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700' },
  veg: { label:'צמחי',   color:'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-700' },
  sig: { label:'חתימה',  color:'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700' },
}
