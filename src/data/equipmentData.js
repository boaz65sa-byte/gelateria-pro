/**
 * ═══════════════════════════════════════════════════════════════
 *  רשימת ציוד לגלידריה — Sweet Station
 * ═══════════════════════════════════════════════════════════════
 * מקור: קובץ Excel "רשימת ציוד קיים ורשימת ציוד פתיחה"
 *
 * שדות לכל פריט:
 *  id         — מזהה ייחודי
 *  category   — קטגוריה
 *  name       — שם הפריט
 *  quantity   — כמות נדרשת
 *  unitPrice  — מחיר ליחידה (₪) — עדכן ידנית
 *  notes      — הערות
 *  purchased  — האם נרכש? (true/false) — מתעדכן בממשק
 *  owner      — 'me' / 'partner' / '' — מי מביא
 */

export const equipmentCategories = [
  { id: 'heavy',     label: 'ציוד כבד',      emoji: '⚙️'  },
  { id: 'kitchen',   label: 'ציוד מטבחי',    emoji: '🔪'  },
  { id: 'serving',   label: 'ציוד הגשה',     emoji: '🍨'  },
  { id: 'disposable',label: 'ציוד חד פעמי',  emoji: '📦'  },
]

export const defaultEquipment = [
  // ── ציוד כבד ──
  { id: 'eq-01', category: 'heavy',      name: 'מכונת גלידה / סורבטייר',     quantity: 1,    unitPrice: 0, notes: 'לב המכונה',             purchased: false, owner: '' },
  { id: 'eq-02', category: 'heavy',      name: 'מיקסר מקצועי',               quantity: 1,    unitPrice: 0, notes: 'סטנד מיקסר',             purchased: false, owner: '' },
  { id: 'eq-03', category: 'heavy',      name: 'מכונת מיצים',                quantity: 1,    unitPrice: 0, notes: 'חשמלית',                  purchased: false, owner: '' },
  { id: 'eq-04', category: 'heavy',      name: 'מקרר מסחרי (מופלג)',         quantity: 1,    unitPrice: 0, notes: 'לאחסון גלידה',            purchased: false, owner: '' },
  { id: 'eq-05', category: 'heavy',      name: 'מקרר קופסאות',               quantity: 1,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-06', category: 'heavy',      name: 'מדיח קפה / אספרסו',          quantity: 1,    unitPrice: 0, notes: 'אם רלוונטי',              purchased: false, owner: '' },
  { id: 'eq-07', category: 'heavy',      name: 'בלנדר מקצועי',               quantity: 1,    unitPrice: 0, notes: 'לשייקים / סמותיות',       purchased: false, owner: '' },
  { id: 'eq-08', category: 'heavy',      name: 'מקרר משקאות / מיני בר',      quantity: 1,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },

  // ── ציוד מטבחי ──
  { id: 'eq-09', category: 'kitchen',    name: 'סכינים מקצועיים (סט)',        quantity: 2,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-10', category: 'kitchen',    name: 'קרשים / קופסאות עדליות',     quantity: 10,   unitPrice: 0, notes: 'גדלים שונים',              purchased: false, owner: '' },
  { id: 'eq-11', category: 'kitchen',    name: 'גסטרונום 1/2',               quantity: 0,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-12', category: 'kitchen',    name: 'כפות לריבוע גלידה',          quantity: 10,   unitPrice: 0, notes: 'משוקים — חשוב!',          purchased: false, owner: '' },
  { id: 'eq-13', category: 'kitchen',    name: 'בערות לגלידה (סט שניים)',    quantity: 5,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-14', category: 'kitchen',    name: 'מדידי סיליקון + מעמדים',     quantity: 6,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-15', category: 'kitchen',    name: 'מגשים / מגשות GN',           quantity: 10,   unitPrice: 0, notes: 'לאחסון טופינגים',          purchased: false, owner: '' },
  { id: 'eq-16', category: 'kitchen',    name: 'משקל מדויק',                  quantity: 1,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-17', category: 'kitchen',    name: 'קרשיית עבודה (נירוד/פלדה)', quantity: 1,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },

  // ── ציוד הגשה ──
  { id: 'eq-18', category: 'serving',    name: 'קעריות גלידה (12 סוגים)',    quantity: 20,   unitPrice: 0, notes: 'זכוכית / קרמיקה',          purchased: false, owner: '' },
  { id: 'eq-19', category: 'serving',    name: 'כפות גלידה מנירות זכוכית',  quantity: 30,   unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-20', category: 'serving',    name: 'סקוויזרים',                   quantity: 30,   unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-21', category: 'serving',    name: 'מגשים / מגשות בניה',         quantity: 5,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-22', category: 'serving',    name: 'פינצות / מצקים משקאות',     quantity: 50,   unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-23', category: 'serving',    name: 'מעמד תצוגה / אינסרט',        quantity: 1,    unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-24', category: 'serving',    name: 'מגשים לתוספות (סירופ/ספרינקלס)', quantity: 3, unitPrice: 0, notes: '',                        purchased: false, owner: '' },

  // ── ציוד חד פעמי ──
  { id: 'eq-25', category: 'disposable', name: 'כוסות חד פעמי (240מל)',       quantity: 1000, unitPrice: 0, notes: 'באריזה',                   purchased: false, owner: '' },
  { id: 'eq-26', category: 'disposable', name: 'קעריות חד פעמיות',            quantity: 500,  unitPrice: 0, notes: 'באריזה',                   purchased: false, owner: '' },
  { id: 'eq-27', category: 'disposable', name: 'כפית גלידה חד פעמית',         quantity: 1000, unitPrice: 0, notes: 'באריזה',                   purchased: false, owner: '' },
  { id: 'eq-28', category: 'disposable', name: 'קשיות שתייה',                  quantity: 500,  unitPrice: 0, notes: 'נייר / ביו-דגרדבל',       purchased: false, owner: '' },
  { id: 'eq-29', category: 'disposable', name: 'שקיות חד פעמיות',             quantity: 500,  unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-30', category: 'disposable', name: 'שקיות נייר / שקיותונים',      quantity: 200,  unitPrice: 0, notes: 'להגשה',                    purchased: false, owner: '' },
  { id: 'eq-31', category: 'disposable', name: 'אריזות נייר',                 quantity: 100,  unitPrice: 0, notes: '',                         purchased: false, owner: '' },
  { id: 'eq-32', category: 'disposable', name: 'צלחות נייר לטופינגים',        quantity: 200,  unitPrice: 0, notes: '',                         purchased: false, owner: '' },
]
