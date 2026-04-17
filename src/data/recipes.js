/**
 * ═══════════════════════════════════════════════════════════════
 *  מתכוני הבצקים — Boaz Saada Recipes
 * ═══════════════════════════════════════════════════════════════
 *
 * כל המרכיבים במתכון מחושבים ל-1 ק"ג בצק מוגמר.
 * הערכים הם יחסים ביחידות גרם (g).
 * המערכת מחשבת אוטומטית לכל כמות שתוזן.
 *
 * איך לערוך? פשוט שנה את המספר בשדה amount של כל מרכיב.
 * אפשר גם להוסיף/להסיר מרכיבים מהרשימה, להוסיף מתכון חדש,
 * או לשנות את שם המתכון/תיאור.
 *
 * הערה: הערכים שלהלן הם בסיס מקצועי סביר - יש לעדכן לנוסחאות
 * האישיות של בועז.
 */

export const recipes = [
  {
    id: 'crepe',
    name: 'בצק קרפ',
    subtitle: 'Crepe Batter - צרפתי קלאסי',
    color: 'amber',
    description: 'בצק דק ואלגנטי, מתאים לקרפים מתוקים ומלוחים.',
    yieldPerUnit: 1000, // 1 kg
    ingredients: [
      { name: 'קמח לבן', amount: 250, unit: 'g' },
      { name: 'ביצים', amount: 200, unit: 'g' },
      { name: 'חלב 3%', amount: 450, unit: 'g' },
      { name: 'חמאה מומסת', amount: 50, unit: 'g' },
      { name: 'סוכר', amount: 30, unit: 'g' },
      { name: 'מלח', amount: 5, unit: 'g' },
      { name: 'תמצית וניל', amount: 15, unit: 'g' },
    ],
    instructions: [
      'לערבב קמח, סוכר ומלח בקערה גדולה',
      'להוסיף ביצים ולערבב היטב עד לקבלת עיסה חלקה',
      'לשפוך בהדרגה את החלב תוך כדי טריפה',
      'להוסיף חמאה מומסת ותמצית וניל',
      'להניח במקרר לפחות 30 דקות לפני השימוש',
    ],
    restTime: 30, // minutes
    shelfLife: 24, // hours
  },
  {
    id: 'waffle',
    name: 'בצק וופל',
    subtitle: 'Waffle Batter - קריספי וחמאתי',
    color: 'gold',
    description: 'בצק אוורירי ועשיר המתאים למכונת וופל / וופל על מקל.',
    yieldPerUnit: 1000,
    ingredients: [
      { name: 'קמח לבן', amount: 300, unit: 'g' },
      { name: 'ביצים', amount: 150, unit: 'g' },
      { name: 'חלב 3%', amount: 300, unit: 'g' },
      { name: 'חמאה מומסת', amount: 120, unit: 'g' },
      { name: 'סוכר', amount: 80, unit: 'g' },
      { name: 'אבקת אפייה', amount: 20, unit: 'g' },
      { name: 'מלח', amount: 5, unit: 'g' },
      { name: 'תמצית וניל', amount: 25, unit: 'g' },
    ],
    instructions: [
      'להפריד חלמונים מחלבונים',
      'לערבב חומרים יבשים: קמח, סוכר, אבקת אפייה ומלח',
      'לערבב חלמונים עם חלב, חמאה ותמצית וניל',
      'לחבר את התערובות ולערבב בעדינות',
      'להקציף חלבונים לקצף יציב ולקפל לתוך הבצק',
      'להשתמש מיד - הבצק מאבד אווריריות במקרר',
    ],
    restTime: 0,
    shelfLife: 4,
  },
  {
    id: 'pancake',
    name: 'בצק פנקייק',
    subtitle: 'Pancake Batter - אמריקאי רך',
    color: 'ivory',
    description: 'בצק סמיך ורך, מתאים לפנקייק רגיל או מיני פנקייקס.',
    yieldPerUnit: 1000,
    ingredients: [
      { name: 'קמח לבן', amount: 280, unit: 'g' },
      { name: 'ביצים', amount: 160, unit: 'g' },
      { name: 'חלב 3%', amount: 400, unit: 'g' },
      { name: 'חמאה מומסת', amount: 60, unit: 'g' },
      { name: 'סוכר', amount: 50, unit: 'g' },
      { name: 'אבקת אפייה', amount: 20, unit: 'g' },
      { name: 'מלח', amount: 5, unit: 'g' },
      { name: 'תמצית וניל', amount: 25, unit: 'g' },
    ],
    instructions: [
      'לערבב את כל היבשים יחד',
      'במיכל נפרד: לטרוף ביצים, חלב, חמאה מומסת ווניל',
      'לשפוך את הרטובים לתוך היבשים ולערבב עד איחוד',
      'חשוב: לא לערבב יתר על המידה - גושים קטנים זה בסדר',
      'להניח 10 דקות במנוחה לפני האפייה',
    ],
    restTime: 10,
    shelfLife: 12,
  },
]

/**
 * Calculate ingredient amounts for a given weight in kg.
 * Returns new array with computed amounts (rounded to nearest gram).
 */
export function calculateRecipe(recipe, targetKg) {
  const factor = (targetKg * 1000) / recipe.yieldPerUnit
  return recipe.ingredients.map((ing) => ({
    ...ing,
    computed: Math.round(ing.amount * factor),
  }))
}
