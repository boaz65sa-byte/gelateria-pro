/**
 * WhatsApp wa.me link utilities
 * עובד על כל מכשיר — פותח WhatsApp עם הודעה מוכנה
 */

/**
 * Clean a phone number to international format (digits only, no +)
 * Examples:
 *   050-123-4567  → 972501234567
 *   +972501234567 → 972501234567
 *   972501234567  → 972501234567
 */
export function cleanPhone(raw) {
  let digits = String(raw).replace(/\D/g, '')
  // Israeli local: starts with 0
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '972' + digits.slice(1)
  }
  return digits
}

/**
 * Build a wa.me URL with optional pre-filled message
 */
export function buildWaLink(phone, message) {
  const clean = cleanPhone(phone)
  if (!clean) return null
  const encoded = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${clean}${encoded}`
}

/**
 * Open WhatsApp in new tab
 */
export function openWhatsApp(phone, message) {
  const url = buildWaLink(phone, message)
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Build a shift order message for a worker
 * @param {Object} worker  - { name }
 * @param {string} shift   - 'morning' | 'noon' | 'evening'
 * @param {string[]} tasks - array of task texts
 * @param {string} date    - formatted date string
 */
export function buildShiftMessage({ worker, shiftLabel, shiftHours, tasks, date }) {
  const lines = [
    `🍦 *The Sweet Station — סידור עבודה*`,
    ``,
    `שלום ${worker.name}!`,
    ``,
    `📅 *תאריך:* ${date}`,
    `⏰ *משמרת:* ${shiftLabel} (${shiftHours})`,
    ``,
    `✅ *משימות המשמרת שלך:*`,
    ...tasks.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `בהצלחה! 💪`,
    `*bs-simple.com | The Sweet Station*`,
  ]
  return lines.join('\n')
}

/**
 * Build a supplier order message
 * @param {Object} supplier - { name, note }
 * @param {Array}  items    - [{ name, quantity, unit }]
 * @param {string} date     - formatted date string
 */
export function buildSupplierOrderMessage({ supplier, items, date }) {
  const lines = [
    `🛒 *הזמנת סחורה — The Sweet Station*`,
    ``,
    `שלום ${supplier.name},`,
    ``,
    `📅 *תאריך הזמנה:* ${date}`,
    ``,
    `*פריטים מבוקשים:*`,
    ...items.map(item => `• ${item.name}: *${item.quantity} ${item.unit}*`),
    ``,
    ...(supplier.note ? [`📝 *הערה:* ${supplier.note}`, ``] : []),
    `תודה רבה!`,
    `*The Sweet Station | bs-simple.com*`,
  ]
  return lines.join('\n')
}
