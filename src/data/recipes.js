/**
 * ═══════════════════════════════════════════════════════════════
 *  מתכוני הייצור — Sweet Station Pro
 * ═══════════════════════════════════════════════════════════════
 *
 * כל מתכון מוגדר עם:
 *  batchSize   — גודל מנת ייצור (ליטר / יחידות)
 *  batchUnit   — 'L' | 'units'
 *  yieldUnits  — כמה מנות הגשה יוצאות מ-batch אחד
 *  servingSize — גרם/מל לכל מנת הגשה
 *  yieldPerUnit — לחישוב (batchSize * 1000 ל-g/ml)
 *
 * costPerServing מחושב אוטומטית: (סכום עלויות מרכיבים) / yieldUnits
 */

export const recipes = [

  // ══════════════════════════════════════════════════════════════
  //  1. סופט-סרב אמריקאי — בסיס אבקה
  // ══════════════════════════════════════════════════════════════
  {
    id: 'soft-serve-powder',
    name: 'סופט-סרב אמריקאי — בסיס אבקה',
    subtitle: 'American Soft-Serve (Powder Base)',
    color: 'amber',
    category: 'soft-serve',
    description: 'מנת ייצור: 5 ליטר | ~50 מנות הגשה של 100g',
    batchSize: 5,
    batchUnit: 'L',
    yieldUnits: 50,
    servingSize: 100, // g per serving
    yieldPerUnit: 5000, // ml total
    ingredients: [
      { id:'ss1-1', name:'מים',                   amount: 3500, unit: 'ml', costPerUnit: 0.002  },
      { id:'ss1-2', name:'אבקת חלב',              amount: 500,  unit: 'g',  costPerUnit: 0.018  },
      { id:'ss1-3', name:'סוכר',                   amount: 700,  unit: 'g',  costPerUnit: 0.005  },
      { id:'ss1-4', name:'שמנת חלבית/צמחית',      amount: 300,  unit: 'ml', costPerUnit: 0.04   },
      { id:'ss1-5', name:'דקסטרוז',               amount: 50,   unit: 'g',  costPerUnit: 0.025  },
      { id:'ss1-6', name:'מייצב גלידה',            amount: 15,   unit: 'g',  costPerUnit: 0.18   },
      { id:'ss1-7', name:'תמצית וניל',             amount: 30,   unit: 'ml', costPerUnit: 0.12   },
    ],
    instructions: [
      'לחמם מים ל-65°C במיכל נקי ומחוטא',
      'לערבב יחד את כל החומרים היבשים: אבקת חלב, סוכר, דקסטרוז ומייצב',
      'להוסיף את תערובת היבשים למים החמים בהדרגה תוך כדי ערבוב מתמיד',
      'להוסיף שמנת ותמצית וניל — לערבב 3-4 דקות עד לתערובת אחידה',
      'לקרר ל-4°C במקרר למינימום 4 שעות (עדיף לילה שלם)',
      'להכניס למכונת סופט-סרב לפי הוראות היצרן',
    ],
    restTime: 240, // 4 hours min
    shelfLife: 48,
    notes: 'אבקת חלב + מייצב = יציבות גבוהה. מתאים לעבודה שוטפת. עלות נמוכה יחסית.',
  },

  // ══════════════════════════════════════════════════════════════
  //  2. סופט-סרב אמריקאי — בסיס חלב טרי פרמיום
  // ══════════════════════════════════════════════════════════════
  {
    id: 'soft-serve-fresh',
    name: 'סופט-סרב פרמיום — בסיס חלב טרי',
    subtitle: 'American Soft-Serve (Fresh Milk Base - Premium)',
    color: 'gold',
    category: 'soft-serve',
    description: 'מנת ייצור: 5 ליטר | ~50 מנות הגשה של 100g',
    batchSize: 5,
    batchUnit: 'L',
    yieldUnits: 50,
    servingSize: 100,
    yieldPerUnit: 5000,
    ingredients: [
      { id:'ss2-1', name:"חלב טרי 3%",             amount: 3000, unit: 'ml', costPerUnit: 0.006  },
      { id:'ss2-2', name:"שמנת מתוקה 38%",         amount: 1000, unit: 'ml', costPerUnit: 0.04   },
      { id:'ss2-3', name:"סוכר",                    amount: 750,  unit: 'g',  costPerUnit: 0.005  },
      { id:'ss2-4', name:"אבקת חלב (לעמילן)",       amount: 150,  unit: 'g',  costPerUnit: 0.018  },
      { id:'ss2-5', name:"סירופ גלוקוז",            amount: 100,  unit: 'g',  costPerUnit: 0.022  },
      { id:'ss2-6', name:"מייצב גלידה",             amount: 20,   unit: 'g',  costPerUnit: 0.18   },
      { id:'ss2-7', name:"מלח",                     amount: 1,    unit: 'g',  costPerUnit: 0.002  },
    ],
    instructions: [
      'לחמם חלב טרי ושמנת ל-72°C (פסטוריזציה קצרה)',
      'לערבב יחד חומרים יבשים: סוכר, אבקת חלב, מייצב',
      'להוסיף את תערובת היבשים לנוזלים החמים תוך כדי ערבוב',
      'להוסיף סירופ גלוקוז ומלח — לערבב עד להמסה מלאה',
      'לקרר מהיר ל-4°C (Blast Chiller אם קיים)',
      'לאפשר מנוחה במקרר 6-8 שעות (Aging — קריטי לאיכות)',
      'להכניס למכונת סופט-סרב',
    ],
    restTime: 360, // 6 hours
    shelfLife: 36,
    notes: 'פרמיום — טעם עשיר יותר. גלוקוז מונע גיבוש קריסטלים ומשפר מרקם.',
  },

  // ══════════════════════════════════════════════════════════════
  //  3. בצק קרפ צרפתי מקצועי
  // ══════════════════════════════════════════════════════════════
  {
    id: 'crepe',
    name: 'בצק קרפ צרפתי מקצועי',
    subtitle: 'Professional Crepe Batter',
    color: 'amber',
    category: 'batter',
    description: 'מנת ייצור: ~25 קרפים | כל קרפ ~65g בצק',
    batchSize: 1.65, // kg approximately
    batchUnit: 'L',
    yieldUnits: 25,
    servingSize: 65,
    yieldPerUnit: 1650,
    ingredients: [
      { id:'cr1',  name:'חלב 3%',               amount: 1000, unit: 'ml', costPerUnit: 0.006  },
      { id:'cr2',  name:'קמח לבן מנופה',         amount: 500,  unit: 'g',  costPerUnit: 0.004  },
      { id:'cr3',  name:'ביצים L',               amount: 6,    unit: 'יח׳',costPerUnit: 0.7    },
      { id:'cr4',  name:'חמאה מומסת',            amount: 100,  unit: 'g',  costPerUnit: 0.04   },
      { id:'cr5',  name:'סוכר',                  amount: 80,   unit: 'g',  costPerUnit: 0.005  },
      { id:'cr6',  name:'תמצית וניל',            amount: 5,    unit: 'ml', costPerUnit: 0.12   },
      { id:'cr7',  name:'מלח',                   amount: 1,    unit: 'g',  costPerUnit: 0.002  },
    ],
    instructions: [
      'לנפות קמח, לערבב עם סוכר ומלח בקערה גדולה',
      'ליצור בור במרכז — להכניס ביצים ולערבב פנימה',
      'להוסיף חצי מהחלב — לערבב נמרצות עד לתערובת חלקה ללא גושים',
      'להוסיף את יתרת החלב, חמאה מומסת ווניל — לערבב',
      'לסנן דרך מסננת עדינה לקבלת בצק חלק מאוד',
      'לנוח במקרר 30-60 דקות (חשוב — הגלוטן רגיע = קרפ דק יותר)',
      'לטגן בתבנית שטוחה חמה ומשומנת קלות',
    ],
    restTime: 45,
    shelfLife: 24,
    notes: 'מנפה את הקמח = קרפ חלק. מנוחה = פחות גלוטן = קל לפרוס. אפשר להוסיף Grand Marnier לנוסחה של סוזט.',
  },

  // ══════════════════════════════════════════════════════════════
  //  4. מיקס פנקייק פלאפי מיני
  // ══════════════════════════════════════════════════════════════
  {
    id: 'pancake',
    name: 'מיקס פנקייק פלאפי מיני',
    subtitle: 'Mini-Pancake Mix (Fluffy Style)',
    color: 'rose',
    category: 'batter',
    description: 'מנת ייצור: ~50 מיני פנקייקים | כל פנקייק ~30g',
    batchSize: 1.55,
    batchUnit: 'L',
    yieldUnits: 50,
    servingSize: 30,
    yieldPerUnit: 1550,
    ingredients: [
      { id:'pan1', name:'חלב 3%',               amount: 750,  unit: 'ml', costPerUnit: 0.006  },
      { id:'pan2', name:'קמח לבן',              amount: 600,  unit: 'g',  costPerUnit: 0.004  },
      { id:'pan3', name:'אבקת אפייה',           amount: 20,   unit: 'g',  costPerUnit: 0.03   },
      { id:'pan4', name:'ביצים L',              amount: 4,    unit: 'יח׳',costPerUnit: 0.7    },
      { id:'pan5', name:'חמאה מומסת',           amount: 80,   unit: 'g',  costPerUnit: 0.04   },
      { id:'pan6', name:'סוכר',                 amount: 100,  unit: 'g',  costPerUnit: 0.005  },
    ],
    instructions: [
      'לערבב יחד חומרים יבשים: קמח, אבקת אפייה, סוכר',
      'בקערה נפרדת — לטרוף ביצים עם חלב',
      'לאחד נוזלים עם יבשים — לערבב רק עד לאיחוד (אל תערבב יתר!)',
      'להוסיף חמאה מומסת — לערבב בעדינות',
      'לנוח 10 דקות בטמפ\' חדר — אבקת אפייה מתחילה לפעול',
      'לאפות בתבנית חמה עם שמן קוקוס/חמאה, כפית ל-מיני פנקייק',
      'להפוך כשמופיעים בועות על הפנים (~90 שניות)',
    ],
    restTime: 10,
    shelfLife: 12,
    notes: 'הסוד: לא לערבב יתר — גושים קטנים = פנקייק אוורירי. בצק מוכן מוחזק 12 שעות במקרר.',
  },

  // ══════════════════════════════════════════════════════════════
  //  5. "דה דובאי" — הרכבה לכוס בודדת
  // ══════════════════════════════════════════════════════════════
  {
    id: 'dubai-signature',
    name: '"The Dubai" — הרכבה חתימה',
    subtitle: 'The Dubai Signature Assembly (Per Serving)',
    color: 'gold',
    category: 'signature',
    description: 'מנה בודדת | עלות ייצור לכוס אחת',
    batchSize: 1,
    batchUnit: 'units',
    yieldUnits: 1,
    servingSize: 275, // total grams per cup
    yieldPerUnit: 275,
    ingredients: [
      { id:'dub1', name:'סופט-סרב בסיס',         amount: 200,  unit: 'g',  costPerUnit: 0.055 },
      { id:'dub2', name:'פירה פיסטוק 100%',      amount: 30,   unit: 'g',  costPerUnit: 0.35  },
      { id:'dub3', name:'קדאיף קלוי בחמאה',      amount: 20,   unit: 'g',  costPerUnit: 0.12  },
      { id:'dub4', name:'גנאש שוקולד חלב',       amount: 25,   unit: 'g',  costPerUnit: 0.085 },
    ],
    instructions: [
      'לחמם מחבת — לקלות קדאיף עם כפית חמאה עד להזהבה ניחוח שקדים (~3 דקות)',
      'לוודא שגנאש שוקולד חלב בטמפ\' 40°C — ניתן לזילוף',
      'להגיש כוס/קערה — להניח 200g סופט-סרב',
      'לזלף פירה פיסטוק בתנועה עגולה',
      'לפזר קדאיף קלוי מעל — לתת טקסטורה',
      'לזלף גנאש שוקולד חלב בסיום',
      'להגיש מיידית — הקדאיף מאבד פריכות בתוך 3-4 דקות',
    ],
    restTime: 0,
    shelfLife: 0, // immediate serving
    notes: 'קדאיף חייב להיות קלוי FRESH לכל הגשה — אל תכין מראש. פיסטוק 100% = לא מתוק, רק טעם טהור.',
  },

  // ══════════════════════════════════════════════════════════════
  //  6. בצק וופל בלגי
  // ══════════════════════════════════════════════════════════════
  {
    id: 'waffle',
    name: 'בצק וופל בלגי',
    subtitle: 'Belgian Waffle Batter',
    color: 'terra',
    category: 'batter',
    description: 'מנת ייצור: ~12 וופלים | כל וופל ~130g בצק',
    batchSize: 1.56,
    batchUnit: 'L',
    yieldUnits: 12,
    servingSize: 130,
    yieldPerUnit: 1560,
    ingredients: [
      { id:'waf1', name:'קמח לבן',              amount: 300,  unit: 'g',  costPerUnit: 0.004  },
      { id:'waf2', name:'ביצים L',              amount: 3,    unit: 'יח׳',costPerUnit: 0.7    },
      { id:'waf3', name:"חלב 3%",               amount: 300,  unit: 'ml', costPerUnit: 0.006  },
      { id:'waf4', name:'חמאה מומסת',           amount: 120,  unit: 'g',  costPerUnit: 0.04   },
      { id:'waf5', name:'סוכר',                 amount: 80,   unit: 'g',  costPerUnit: 0.005  },
      { id:'waf6', name:'אבקת אפייה',           amount: 15,   unit: 'g',  costPerUnit: 0.03   },
      { id:'waf7', name:'מלח',                  amount: 5,    unit: 'g',  costPerUnit: 0.002  },
      { id:'waf8', name:'תמצית וניל',           amount: 10,   unit: 'ml', costPerUnit: 0.12   },
    ],
    instructions: [
      'להפריד חלבון מחלמון',
      'לערבב קמח, אבקת אפייה, סוכר, מלח בקערה',
      'לערבב חלמונים, חלב, חמאה מומסת, ווניל בנפרד',
      'לאחד נוזלים עם יבשים — לערבב עד לתערובת אחידה',
      'להקציף חלבונים לקצף יציב (snow peaks)',
      'לקפל חלבונים לבצק בתנועות קיפול עדינות',
      'לאפות מיד במכונת וופל חמה',
    ],
    restTime: 0,
    shelfLife: 4,
    notes: 'הפרדת ביצים + קיפול חלבונים = וופל פריך בחוץ ואוורירי בפנים. בצק ללא הפרדה — תקין, רק פחות אוורירי.',
  },
]

// ── חישוב עלות ───────────────────────────────────────────────────────────────

/**
 * חישוב עלות חומרים לכל ה-batch
 */
export function calcBatchCost(recipe) {
  return recipe.ingredients.reduce((sum, ing) => {
    return sum + (ing.amount * ing.costPerUnit)
  }, 0)
}

/**
 * עלות לכל מנת הגשה בודדת
 */
export function calcCostPerServing(recipe) {
  return calcBatchCost(recipe) / recipe.yieldUnits
}

/**
 * כמות מרכיב מחושבת לפי targetQty
 * targetQty = כמה batches לייצר (למשל 2.5 batches)
 */
export function calculateRecipe(recipe, targetQty) {
  const factor = targetQty
  return recipe.ingredients.map(ing => ({
    ...ing,
    computed: Math.round(ing.amount * factor * 10) / 10,
  }))
}

/**
 * legacy support — targetKg שימוש ישן
 */
export function calculateRecipeByKg(recipe, targetKg) {
  const factor = (targetKg * 1000) / recipe.yieldPerUnit
  return recipe.ingredients.map(ing => ({
    ...ing,
    computed: Math.round(ing.amount * factor * 10) / 10,
  }))
}
