/**
 * ═══════════════════════════════════════════════════════════════
 *  ניהול מלאי — Default Inventory
 * ═══════════════════════════════════════════════════════════════
 *
 * פריטי ברירת מחדל במערכת. הלקוח יוכל להוסיף/לערוך/למחוק בזמן אמת
 * מתוך הממשק, אך אלו הפריטים שיופיעו בהרצה הראשונה.
 *
 * שדות:
 *  - id: מזהה ייחודי
 *  - name: שם הפריט
 *  - category: chocolate | dairy | packaging | dry | fruits
 *  - quantity: מלאי נוכחי
 *  - threshold: הסף שמתחתיו המערכת תציג התראת "מלאי נמוך"
 *  - unit: יחידת מידה (ק"ג, ליטר, יחידות וכו')
 *  - supplier: שם הספק
 */

export const inventoryCategories = {
  chocolate: { label: 'שוקולד וקצפות', color: 'amber' },
  dairy: { label: 'מוצרי חלב', color: 'blue' },
  packaging: { label: 'אריזות וכלים', color: 'gold' },
  dry: { label: 'יבשים ומרכיבים', color: 'gray' },
  fruits: { label: 'פירות ותוספות', color: 'emerald' },
}

export const defaultInventory = [
  // Chocolate
  { id: 'inv-1', name: 'נוטלה', category: 'chocolate', quantity: 5, threshold: 3, unit: 'קילו', supplier: 'פררו רושה' },
  { id: 'inv-2', name: 'קינדר שוקולד', category: 'chocolate', quantity: 8, threshold: 4, unit: 'יחידות', supplier: 'סופר פארם' },
  { id: 'inv-3', name: 'סירופ שוקולד', category: 'chocolate', quantity: 2, threshold: 2, unit: 'ליטר', supplier: 'הרשי ישראל' },
  { id: 'inv-4', name: 'קצפת מתוקה', category: 'chocolate', quantity: 3, threshold: 4, unit: 'ליטר', supplier: 'תנובה' },

  // Dairy
  { id: 'inv-5', name: 'חלב 3%', category: 'dairy', quantity: 12, threshold: 8, unit: 'ליטר', supplier: 'תנובה' },
  { id: 'inv-6', name: 'שמנת מתוקה 38%', category: 'dairy', quantity: 6, threshold: 4, unit: 'ליטר', supplier: 'תנובה' },
  { id: 'inv-7', name: 'חמאה', category: 'dairy', quantity: 4, threshold: 3, unit: 'קילו', supplier: 'תנובה' },
  { id: 'inv-8', name: 'ביצים L', category: 'dairy', quantity: 60, threshold: 30, unit: 'יחידות', supplier: 'מחסן הביצים' },

  // Packaging
  { id: 'inv-9', name: 'כוסות גלידה 200ml', category: 'packaging', quantity: 200, threshold: 100, unit: 'יחידות', supplier: 'פאקו' },
  { id: 'inv-10', name: 'כפיות חד פעמיות', category: 'packaging', quantity: 300, threshold: 150, unit: 'יחידות', supplier: 'פאקו' },
  { id: 'inv-11', name: 'מגשי הגשה קרפ', category: 'packaging', quantity: 80, threshold: 50, unit: 'יחידות', supplier: 'פאקו' },
  { id: 'inv-12', name: 'מפיות נייר', category: 'packaging', quantity: 5, threshold: 10, unit: 'חבילות', supplier: 'פאקו' },
  { id: 'inv-13', name: 'מקלות עץ לוופל', category: 'packaging', quantity: 150, threshold: 100, unit: 'יחידות', supplier: 'פאקו' },

  // Dry
  { id: 'inv-14', name: 'קמח לבן', category: 'dry', quantity: 15, threshold: 10, unit: 'קילו', supplier: 'שטיבל' },
  { id: 'inv-15', name: 'סוכר לבן', category: 'dry', quantity: 8, threshold: 5, unit: 'קילו', supplier: 'שטיבל' },
  { id: 'inv-16', name: 'אבקת אפייה', category: 'dry', quantity: 1, threshold: 1, unit: 'קילו', supplier: 'שטיבל' },
  { id: 'inv-17', name: 'תמצית וניל', category: 'dry', quantity: 2, threshold: 1, unit: 'ליטר', supplier: 'שטיבל' },

  // Fruits
  { id: 'inv-18', name: 'בננות', category: 'fruits', quantity: 4, threshold: 3, unit: 'קילו', supplier: 'שוק המחנה יהודה' },
  { id: 'inv-19', name: 'תותים', category: 'fruits', quantity: 2, threshold: 2, unit: 'קילו', supplier: 'שוק המחנה יהודה' },
  { id: 'inv-20', name: 'פצפוצי שוקולד', category: 'fruits', quantity: 3, threshold: 2, unit: 'קילו', supplier: 'הרשי ישראל' },
]
