/**
 * ═══════════════════════════════════════════════════════════════
 *  ספקים — Supplier Definitions
 * ═══════════════════════════════════════════════════════════════
 * כל ספק מוגדר עם:
 *  - phone: מספר WhatsApp (בפורמט בינ"ל ללא +, לדוגמה: 972501234567)
 *  - categories: אילו קטגוריות מלאי הוא מספק
 *  - note: הערה לשליחה בסוף ההזמנה
 *
 * ניתן לערוך דרך ממשק ההגדרות באפליקציה.
 */

export const defaultSuppliers = [
  {
    id: 'sup-1',
    name: 'תנובה',
    phone: '972501234567',
    categories: ['dairy'],
    note: 'משלוח עד יום שלישי 08:00',
    active: true,
  },
  {
    id: 'sup-2',
    name: 'שטיבל',
    phone: '972521234567',
    categories: ['dry'],
    note: 'הזמנה מינימום ₪500',
    active: true,
  },
  {
    id: 'sup-3',
    name: 'פאקו',
    phone: '972531234567',
    categories: ['packaging'],
    note: 'ליצור קשר עם שי',
    active: true,
  },
  {
    id: 'sup-4',
    name: 'הרשי ישראל',
    phone: '972541234567',
    categories: ['chocolate', 'fruits'],
    note: 'הזמנות עד יום חמישי לשבוע הבא',
    active: true,
  },
  {
    id: 'sup-5',
    name: 'שוק המחנה יהודה',
    phone: '972551234567',
    categories: ['fruits'],
    note: 'הזמנה יומית — לשלוח עד 18:00',
    active: true,
  },
]
