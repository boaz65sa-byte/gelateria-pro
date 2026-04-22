/**
 * ═══════════════════════════════════════════════════════════════
 *  ניהול מלאי חכם — Sweet Station
 * ═══════════════════════════════════════════════════════════════
 *
 * כל פריט מכיל:
 *  current   — מלאי נוכחי בפועל
 *  opening   — מלאי פתיחה (הסף שמתחתיו מתריעים)
 *  orderQty  — כמות להזמנה (מוגדרת ידנית לכל מוצר)
 *  supplierId — מזהה ספק מ-suppliersData.js
 */

export const inventoryCategories = {
  chocolate: { label: 'שוקולד וקצפות', emoji: '🍫' },
  dairy:     { label: 'מוצרי חלב',     emoji: '🥛' },
  packaging: { label: 'אריזות וכלים',  emoji: '📦' },
  dry:       { label: 'יבשים ומרכיבים',emoji: '🌾' },
  fruits:    { label: 'פירות ותוספות', emoji: '🍓' },
}

export const defaultInventory = [
  // ── שוקולד ──
  { id:'inv-1',  name:'נוטלה',              category:'chocolate', unit:'ק"ג',    current:5,  opening:4,  orderQty:6,  supplierId:'sup-4', notes:'' },
  { id:'inv-2',  name:'סירופ שוקולד',       category:'chocolate', unit:'ליטר',   current:3,  opening:3,  orderQty:4,  supplierId:'sup-4', notes:'הרשי' },
  { id:'inv-3',  name:'קצפת מתוקה',         category:'chocolate', unit:'ליטר',   current:2,  opening:4,  orderQty:6,  supplierId:'sup-1', notes:'' },
  { id:'inv-4',  name:'שוקולד כהה 70%',     category:'chocolate', unit:'ק"ג',    current:3,  opening:3,  orderQty:5,  supplierId:'sup-4', notes:'ולרונה' },
  { id:'inv-5',  name:'שוקולד לבן',         category:'chocolate', unit:'ק"ג',    current:2,  opening:2,  orderQty:3,  supplierId:'sup-4', notes:'' },

  // ── מחלבה ──
  { id:'inv-6',  name:'חלב 3%',             category:'dairy',     unit:'ליטר',   current:12, opening:8,  orderQty:12, supplierId:'sup-1', notes:'' },
  { id:'inv-7',  name:'שמנת מתוקה 38%',     category:'dairy',     unit:'ליטר',   current:6,  opening:5,  orderQty:8,  supplierId:'sup-1', notes:'' },
  { id:'inv-8',  name:'חמאה',               category:'dairy',     unit:'ק"ג',    current:4,  opening:3,  orderQty:5,  supplierId:'sup-1', notes:'' },
  { id:'inv-9',  name:'ביצים L',            category:'dairy',     unit:'יחידות', current:60, opening:36, orderQty:60, supplierId:'sup-1', notes:'כשר' },
  { id:'inv-10', name:'גבינת שמנת',         category:'dairy',     unit:'ק"ג',    current:3,  opening:3,  orderQty:4,  supplierId:'sup-1', notes:'' },

  // ── אריזות ──
  { id:'inv-11', name:'כוסות חד פעמי 240מל',category:'packaging', unit:'יחידות', current:200,opening:150,orderQty:500,supplierId:'sup-3', notes:'' },
  { id:'inv-12', name:'קעריות חד פעמיות',  category:'packaging', unit:'יחידות', current:150,opening:150,orderQty:500,supplierId:'sup-3', notes:'' },
  { id:'inv-13', name:'כפיות גלידה',        category:'packaging', unit:'יחידות', current:300,opening:200,orderQty:500,supplierId:'sup-3', notes:'' },
  { id:'inv-14', name:'מפיות נייר',         category:'packaging', unit:'חבילות', current:8,  opening:10, orderQty:20, supplierId:'sup-3', notes:'' },
  { id:'inv-15', name:'מקלות וופל',         category:'packaging', unit:'יחידות', current:120,opening:100,orderQty:300,supplierId:'sup-3', notes:'' },

  // ── יבשים ──
  { id:'inv-16', name:'קמח לבן',            category:'dry',       unit:'ק"ג',    current:15, opening:10, orderQty:20, supplierId:'sup-2', notes:'' },
  { id:'inv-17', name:'סוכר לבן',           category:'dry',       unit:'ק"ג',    current:8,  opening:6,  orderQty:10, supplierId:'sup-2', notes:'' },
  { id:'inv-18', name:'אבקת אפייה',         category:'dry',       unit:'ק"ג',    current:1,  opening:1,  orderQty:3,  supplierId:'sup-2', notes:'' },
  { id:'inv-19', name:'תמצית וניל',         category:'dry',       unit:'ליטר',   current:2,  opening:1,  orderQty:3,  supplierId:'sup-2', notes:'' },
  { id:'inv-20', name:'פיסטוק טחון',        category:'dry',       unit:'ק"ג',    current:2,  opening:2,  orderQty:4,  supplierId:'sup-2', notes:'איראני' },

  // ── פירות ──
  { id:'inv-21', name:'בננות',              category:'fruits',    unit:'ק"ג',    current:4,  opening:3,  orderQty:6,  supplierId:'sup-5', notes:'' },
  { id:'inv-22', name:'תותים',              category:'fruits',    unit:'ק"ג',    current:2,  opening:2,  orderQty:4,  supplierId:'sup-5', notes:'טרי' },
  { id:'inv-23', name:'פצפוצי שוקולד',      category:'fruits',    unit:'ק"ג',    current:3,  opening:3,  orderQty:5,  supplierId:'sup-4', notes:'' },
  { id:'inv-24', name:'קדאיף',              category:'dry',       unit:'ק"ג',    current:2,  opening:2,  orderQty:4,  supplierId:'sup-2', notes:'קפוא' },
]
