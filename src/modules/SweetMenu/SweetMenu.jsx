import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { menuSections as defaultSections, TAG_META, SECTION_COLORS } from '../../data/sweetMenuData.js'

const genId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

const TAGS = Object.keys(TAG_META)

const FILTER_OPTIONS = [
  { key: 'all', en: 'All', he: 'הכל' },
  { key: 'sig', en: 'Signature', he: 'חתימה' },
  { key: 'veg', en: 'Plant-based', he: 'צמחי' },
  { key: 'new', en: 'Seasonal', he: 'עונתי' },
  { key: 'hot', en: 'Trending', he: 'טרנד' },
]

// ── helpers ──────────────────────────────────────────────────────────────────
const margin = item => item.price > 0 ? Math.round(((item.price - item.cost) / item.price) * 100) : 0
const marginColor = pct => pct >= 60 ? 'text-sage-600 dark:text-sage-400' : pct >= 45 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
const barColor    = pct => pct >= 60 ? 'bg-sage-400'  : pct >= 45 ? 'bg-amber-400' : 'bg-rose-400'

function TagBadge({ tag, lang }) {
  const styles = {
    sig: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700',
    veg: 'bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-700',
    new: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700',
    hot: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700',
  }
  const label = lang === 'he' ? TAG_META[tag]?.he : TAG_META[tag]?.en
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-sans ${styles[tag] || ''}`}>{label}</span>
}

// ── Item edit modal content ───────────────────────────────────────────────────
function ItemEditForm({ draft, onChange, sections }) {
  const set = (k, v) => onChange({ ...draft, [k]: v })
  const toggleTag = t => {
    const tags = draft.tags.includes(t) ? draft.tags.filter(x => x !== t) : [...draft.tags, t]
    set('tags', tags)
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">שם אנגלית / Name EN</label>
          <input value={draft.en} onChange={e => set('en', e.target.value)} className="input-field" placeholder="e.g., The Saffron Dream" />
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1 text-right">שם עברית</label>
          <input value={draft.he} onChange={e => set('he', e.target.value)} className="input-field text-right" placeholder="לדוגמה: חלום הזעפרן" dir="rtl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">Description EN</label>
          <textarea rows={2} value={draft.descEn} onChange={e => set('descEn', e.target.value)} className="input-field resize-none text-sm" placeholder="Flavour profile, texture, plating..." />
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1 text-right">תיאור עברית</label>
          <textarea rows={2} value={draft.descHe} onChange={e => set('descHe', e.target.value)} className="input-field resize-none text-sm text-right" placeholder="פרופיל טעמים, מרקם, הגשה..." dir="rtl" />
        </div>
      </div>
      {sections && (
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה / Section</label>
          <select value={draft.sectionId} onChange={e => set('sectionId', e.target.value)} className="input-field">
            {sections.map(s => <option key={s.id} value={s.id}>{s.en} · {s.he}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">מחיר ₪</label>
          <input type="number" min="0" value={draft.price} onChange={e => set('price', parseFloat(e.target.value) || 0)} className="input-field text-center font-mono" />
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">עלות ₪</label>
          <input type="number" min="0" value={draft.cost} onChange={e => set('cost', parseFloat(e.target.value) || 0)} className="input-field text-center font-mono" />
        </div>
        <div className="bg-linen dark:bg-espresso-800 rounded-xl flex flex-col items-center justify-center p-2">
          <p className="text-xs text-espresso-400 mb-0.5">מרווח</p>
          <p className={`text-lg font-serif font-bold ${marginColor(margin(draft))}`}>{margin(draft)}%</p>
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-2">תגיות / Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => (
            <button key={t} type="button" onClick={() => toggleTag(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium border transition ${
                draft.tags.includes(t)
                  ? 'bg-terra-400 text-white border-terra-400'
                  : 'bg-linen dark:bg-espresso-700 text-espresso-500 border-silk hover:border-bisque'
              }`}>
              {TAG_META[t]?.en} · {TAG_META[t]?.he}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">אלרגנים / Allergens</label>
        <input value={draft.allergens || ''} onChange={e => set('allergens', e.target.value)} className="input-field text-sm" placeholder="חלב, גלוטן, אגוזים / Dairy, Gluten, Tree nuts" />
      </div>
    </div>
  )
}

// ── Cost analysis panel ───────────────────────────────────────────────────────
function CostPanel({ item, onClose }) {
  const m = margin(item)
  const grade = m >= 65 ? 'מצוין / Excellent' : m >= 50 ? 'טוב / Good' : m >= 35 ? 'מקובל / Acceptable' : 'לבדיקה / Review'
  return (
    <div className="space-y-3">
      <div className="bg-linen dark:bg-espresso-800 rounded-xl p-4">
        <p className="text-sm font-serif font-bold mb-1">{item.en}</p>
        <p className="text-sm text-espresso-500 dark:text-espresso-300 font-sans text-right" dir="rtl">{item.he}</p>
      </div>
      {[
        { label: 'מחיר מכירה / Selling price', value: `₪${item.price}`, cls: '' },
        { label: 'עלות מזון / Food cost', value: `₪${item.cost}`, cls: 'text-rose-600 dark:text-rose-400' },
        { label: 'רווח גולמי / Gross margin', value: `₪${item.price - item.cost}`, cls: 'text-sage-600 dark:text-sage-400' },
        { label: '% עלות מזון / Food cost %', value: `${100 - m}%`, cls: '' },
        { label: '% מרווח / Margin %', value: `${m}%`, cls: `font-bold ${marginColor(m)}` },
      ].map((r, i) => (
        <div key={i} className="flex justify-between text-sm font-sans py-2 border-b border-silk dark:border-espresso-700 last:border-0">
          <span className="text-espresso-500 dark:text-espresso-300">{r.label}</span>
          <span className={r.cls}>{r.value}</span>
        </div>
      ))}
      <div>
        <div className="h-2 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden mb-1">
          <div className={`h-full rounded-full ${barColor(m)} transition-all`} style={{ width: `${m}%` }} />
        </div>
        <p className="text-xs text-espresso-400 font-sans">{grade}</p>
      </div>
      {item.allergens && (
        <p className="text-xs text-espresso-400 font-sans pt-1 border-t border-silk dark:border-espresso-700">
          אלרגנים / Allergens: {item.allergens}
        </p>
      )}
    </div>
  )
}

// ── Print view ────────────────────────────────────────────────────────────────
function PrintMenu({ sections, lang, onClose }) {
  return (
    <div>
      <div className="no-print flex gap-2 mb-4 justify-end">
        <Button variant="primary" onClick={() => window.print()}>
          <Icons.Print className="w-4 h-4" /> הדפס / Print
        </Button>
        <Button variant="ghost" onClick={onClose}><Icons.Close className="w-4 h-4" /></Button>
      </div>

      {/* Print-only header */}
      <div className="print-only text-center mb-8">
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '4px' }}>The Sweet Station</h1>
        <p style={{ fontSize: '13px', color: '#888' }}>Premium Dessert Boutique</p>
        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
          {new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6">
        {sections.map(sec => {
          const c = SECTION_COLORS[sec.color] || SECTION_COLORS.amber
          return (
            <div key={sec.id} className="avoid-break">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${c.bg} border ${c.border}`}>
                <span style={{ fontSize: '20px' }}>{sec.emoji}</span>
                <div>
                  <h2 className="font-serif font-bold text-lg leading-tight">
                    {lang === 'he' ? sec.he : lang === 'en' ? sec.en : `${sec.en} · ${sec.he}`}
                  </h2>
                  <p className="text-xs text-espresso-400 font-sans">
                    {lang === 'he' ? sec.badgeHe : lang === 'en' ? sec.badgeEn : `${sec.badgeEn} · ${sec.badgeHe}`}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-silk dark:border-espresso-600 overflow-hidden">
                <table className="w-full font-sans text-sm">
                  <tbody>
                    {sec.items.map((item, idx) => (
                      <tr key={item.id} className={`border-b border-silk dark:border-espresso-700 last:border-0 ${idx % 2 === 0 ? '' : 'bg-linen/30 dark:bg-espresso-800/20'}`}>
                        <td className="px-4 py-3 w-8">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map(t => <TagBadge key={t} tag={t} lang={lang === 'both' ? 'en' : lang} />)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-espresso-800 dark:text-espresso-50">
                            {lang === 'he' ? item.he : lang === 'en' ? item.en : `${item.en} · ${item.he}`}
                          </div>
                          <div className="text-xs text-espresso-400 dark:text-espresso-300 mt-0.5 leading-relaxed">
                            {lang === 'he' ? item.descHe : lang === 'en' ? item.descEn : item.descEn}
                          </div>
                          {lang === 'both' && (
                            <div className="text-xs text-espresso-300 dark:text-espresso-400 mt-0.5 text-right" dir="rtl">{item.descHe}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-serif font-bold text-lg whitespace-nowrap">
                          ₪{item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-silk dark:border-espresso-700 text-center print-only">
        <p style={{ fontSize: '11px', color: '#aaa' }}>bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function SweetMenu() {
  const [sections, setSections] = useLocalStorage('gelateria-sweet-menu', defaultSections)
  const [lang, setLang]         = useState('both')
  const [activeFilter, setFilter] = useState('all')
  const [openSecs, setOpenSecs]   = useState({})
  const [printMode, setPrintMode] = useState(false)

  const addModal  = useModal()
  const editModal = useModal()
  const costModal = useModal()

  const [draft, setDraft]   = useState(null)
  const [editDraft, setEdit] = useState(null)

  // ── all items flat ──────────────────────────────────────────────────────────
  const allItems = useMemo(() => sections.flatMap(s => s.items.map(i => ({ ...i, sectionId: s.id }))), [sections])

  // ── filtered sections ──────────────────────────────────────────────────────
  const visibleSections = useMemo(() => {
    if (activeFilter === 'all') return sections
    return sections
      .map(s => ({ ...s, items: s.items.filter(i => i.tags.includes(activeFilter)) }))
      .filter(s => s.items.length > 0)
  }, [sections, activeFilter])

  const toggleSec = id => setOpenSecs(p => ({ ...p, [id]: p[id] === false ? true : false }))
  const isSectionOpen = id => openSecs[id] !== false

  // ── item mutations ──────────────────────────────────────────────────────────
  const updateItem = (sectionId, itemId, changes) =>
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...changes } : i) }
        : s
    ))

  const deleteItem = (sectionId, itemId) => {
    if (!window.confirm('למחוק פריט זה?')) return
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    ))
  }

  const addItem = () => {
    if (!draft?.en && !draft?.he) return
    const targetId = draft.sectionId || sections[0]?.id
    setSections(prev => prev.map(s =>
      s.id === targetId
        ? { ...s, items: [...s.items, { ...draft, id: genId(), tags: draft.tags || [] }] }
        : s
    ))
    addModal.close()
  }

  const saveEdit = () => {
    if (!editDraft) return
    const { sectionId, id, ...changes } = editDraft
    // Handle section change
    if (sectionId !== editDraft._origSection) {
      setSections(prev => {
        let updated = prev.map(s => ({ ...s, items: s.items.filter(i => i.id !== id) }))
        updated = updated.map(s => s.id === sectionId ? { ...s, items: [...s.items, { ...changes, id, tags: changes.tags || [] }] } : s)
        return updated
      })
    } else {
      updateItem(sectionId, id, changes)
    }
    editModal.close()
  }

  const openEdit = item => {
    setEdit({ ...item, _origSection: item.sectionId })
    editModal.open()
  }

  const openAdd = () => {
    setDraft({ en: '', he: '', descEn: '', descHe: '', price: 0, cost: 0, tags: [], allergens: '', sectionId: sections[0]?.id })
    addModal.open()
  }

  const resetMenu = () => {
    if (window.confirm('לאפס לתפריט המקורי?')) setSections(defaultSections)
  }

  // stats
  const totalItems = allItems.length
  const sigItems   = allItems.filter(i => i.tags.includes('sig')).length
  const avgMargin  = allItems.length > 0 ? Math.round(allItems.reduce((s, i) => s + margin(i), 0) / allItems.length) : 0

  if (printMode) {
    return (
      <div>
        <PrintMenu sections={visibleSections} lang={lang} onClose={() => setPrintMode(false)} />
        <div className="mt-6 border-t border-silk dark:border-espresso-700 pt-4 text-center no-print">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Premium Dessert Boutique</p>
            <h1 className="text-3xl font-serif font-bold mb-1">The Sweet Station</h1>
            <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans">תפריט אינטראקטיבי דו-לשוני · Interactive Bilingual Menu</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openAdd}><Icons.Plus className="w-4 h-4" /> [ADD]</Button>
            <Button variant="secondary" onClick={() => setPrintMode(true)}><Icons.Print className="w-4 h-4" /> הדפס</Button>
            <Button variant="ghost" onClick={resetMenu} title="אפס לברירת מחדל"><Icons.Reset className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'פריטים / Items', value: totalItems },
            { label: 'קטגוריות / Sections', value: sections.length },
            { label: 'חתימה / Signature', value: sigItems },
            { label: 'מרווח ממוצע / Avg margin', value: `${avgMargin}%`, color: marginColor(avgMargin) },
          ].map((s, i) => (
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-2xl font-serif font-bold ${s.color || ''}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Language toggle ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide">שפה / Language:</p>
          <div className="flex gap-1 bg-linen dark:bg-espresso-800 rounded-xl p-1">
            {[{ k: 'en', l: 'English' }, { k: 'he', l: 'עברית' }, { k: 'both', l: 'שניהם / Both' }].map(opt => (
              <button key={opt.k} onClick={() => setLang(opt.k)}
                className={`px-4 py-1.5 rounded-lg text-sm font-sans font-medium transition ${
                  lang === opt.k
                    ? 'bg-white dark:bg-espresso-700 text-espresso-800 dark:text-espresso-50 shadow-sm'
                    : 'text-espresso-400 hover:text-espresso-700 dark:hover:text-espresso-200'
                }`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition border ${
                activeFilter === f.key
                  ? 'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent'
                  : 'bg-white dark:bg-espresso-700 border-silk dark:border-espresso-600 text-espresso-500 dark:text-espresso-200 hover:border-bisque'
              }`}>
              {lang === 'he' ? f.he : lang === 'en' ? f.en : `${f.en} · ${f.he}`}
            </button>
          ))}
        </div>

        {/* ── Sections ── */}
        <div className="space-y-3">
          {visibleSections.map(sec => {
            const c     = SECTION_COLORS[sec.color] || SECTION_COLORS.amber
            const isOpen = isSectionOpen(sec.id)
            const secName = lang === 'he' ? sec.he : lang === 'en' ? sec.en : `${sec.en} · ${sec.he}`
            const badgeTxt = lang === 'he' ? sec.badgeHe : lang === 'en' ? sec.badgeEn : `${sec.badgeEn} · ${sec.badgeHe}`

            return (
              <div key={sec.id} className="card p-0 overflow-hidden">
                {/* Section header */}
                <button onClick={() => toggleSec(sec.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-linen dark:hover:bg-espresso-700/50 transition text-right">
                  <span style={{ fontSize: '20px' }}>{sec.emoji}</span>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <span className="font-serif font-bold text-base">{secName}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-sans ${c.badge}`}>{badgeTxt}</span>
                    <span className="text-xs text-espresso-400 font-sans">({sec.items.length})</span>
                  </div>
                  <Icons.ChevronLeft className={`w-4 h-4 text-espresso-400 transition-transform ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="border-t border-silk dark:border-espresso-700">
                    {sec.items.map((item, idx) => {
                      const m = margin(item)
                      const name = lang === 'he' ? item.he : lang === 'en' ? item.en : item.en
                      const nameHe = lang === 'both' ? item.he : null
                      const desc  = lang === 'he' ? item.descHe : item.descEn
                      const descHe = lang === 'both' ? item.descHe : null

                      return (
                        <div key={item.id}
                          className={`grid grid-cols-[1fr_auto_auto] gap-3 px-5 py-3.5 border-b border-silk dark:border-espresso-700 last:border-0 group hover:bg-linen/50 dark:hover:bg-espresso-800/30 transition ${idx % 2 === 0 ? '' : 'bg-linen/20 dark:bg-espresso-800/10'}`}>

                          <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-sans font-medium text-sm text-espresso-800 dark:text-espresso-50">{name}</span>
                              {nameHe && <span className="text-xs text-espresso-400 dark:text-espresso-400 font-sans" dir="rtl">{nameHe}</span>}
                            </div>
                            <p className="text-xs text-espresso-400 dark:text-espresso-300 font-sans mt-1 leading-relaxed">{desc}</p>
                            {descHe && <p className="text-xs text-espresso-300 dark:text-espresso-400 font-sans mt-0.5 text-right" dir="rtl">{descHe}</p>}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {item.tags.map(t => <TagBadge key={t} tag={t} lang={lang === 'both' ? 'en' : lang} />)}
                            </div>
                          </div>

                          {/* Price + margin */}
                          <div className="text-right flex-shrink-0 pt-0.5">
                            <p className="font-serif font-bold text-lg">₪{item.price}</p>
                            <p className={`text-xs font-mono ${marginColor(m)}`}>{m}%</p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={() => openEdit({ ...item, sectionId: sec.id })}
                              className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-terra-600 transition"
                              title="ערוך / Edit">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                                <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
                              </svg>
                            </button>
                            <button onClick={() => { costModal.open({ item }) }}
                              className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-sage-600 transition"
                              title="עלות / Cost">
                              <Icons.IceCream className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteItem(sec.id, item.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition"
                              title="מחק / Delete">
                              <Icons.Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>

      {/* ── ADD Modal ── */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close}
        title="[ADD] הוסף פריט · Add Item" size="lg"
        footer={<><Button variant="ghost" onClick={addModal.close}>ביטול / Cancel</Button><Button variant="primary" onClick={addItem}>הוסף לתפריט ↗</Button></>}>
        {draft && <ItemEditForm draft={draft} onChange={setDraft} sections={sections} />}
      </Modal>

      {/* ── EDIT Modal ── */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close}
        title="[EDIT] ערוך פריט · Edit Item" size="lg"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={saveEdit}>שמור שינויים ↗</Button></>}>
        {editDraft && <ItemEditForm draft={editDraft} onChange={setEdit} sections={sections} />}
      </Modal>

      {/* ── COST Modal ── */}
      <Modal isOpen={costModal.isOpen} onClose={costModal.close}
        title="[CALC] ניתוח עלות · Cost Analysis" size="sm"
        footer={<Button variant="ghost" onClick={costModal.close}>סגור / Close</Button>}>
        {costModal.data?.item && <CostPanel item={costModal.data.item} onClose={costModal.close} />}
      </Modal>
    </>
  )
}
