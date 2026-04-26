import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { defaultSuppliers } from '../../data/suppliersData.js'
import { inventoryCategories } from '../../data/inventoryData.js'
import { cleanPhone } from '../../utils/whatsapp.js'

const genId = () => `sup-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`

const defaultBizInfo = {
  name: 'Sweet Station',
  address: '',
  phone: '',
  email: '',
  vatId: '',
  note: '',
}

const WHATSAPP_ICON = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function SupplierForm({ draft, onChange }) {
  const allCats = Object.entries(inventoryCategories)
  const toggleCat = cat => {
    const cats = draft.categories.includes(cat)
      ? draft.categories.filter(c => c !== cat)
      : [...draft.categories, cat]
    onChange({ ...draft, categories: cats })
  }
  const set = (k, v) => onChange({ ...draft, [k]: v })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">שם הספק</label>
          <input value={draft.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="לדוגמה: תנובה" />
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">
            מספר WhatsApp
            <span className="text-espresso-300 mr-1">(050-123-4567 או 972501234567)</span>
          </label>
          <input value={draft.phone} onChange={e => set('phone', e.target.value)} className="input-field font-mono" placeholder="0501234567" dir="ltr" />
          {draft.phone && (
            <p className="text-xs mt-1 text-espresso-400">
              ✓ פורמט: {cleanPhone(draft.phone) || 'לא תקין'}
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-2">קטגוריות שמספק</label>
        <div className="flex flex-wrap gap-2">
          {allCats.map(([key, cat]) => (
            <button key={key} type="button" onClick={() => toggleCat(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium border transition ${
                draft.categories.includes(key)
                  ? 'bg-terra-400 text-white border-terra-400'
                  : 'bg-linen dark:bg-espresso-700 text-espresso-500 border-silk hover:border-bisque'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">הערה לשליחה בהזמנה</label>
        <input value={draft.note} onChange={e => set('note', e.target.value)} className="input-field" placeholder="לדוגמה: משלוח עד יום שלישי 08:00" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="sup-active" checked={draft.active} onChange={e => set('active', e.target.checked)} className="rounded" />
        <label htmlFor="sup-active" className="text-sm font-sans text-espresso-700 dark:text-espresso-100">ספק פעיל</label>
      </div>
    </div>
  )
}

export function Settings() {
  const [suppliers, setSuppliers] = useLocalStorage('gelateria-suppliers', defaultSuppliers)
  const [bizInfo, setBizInfo]     = useLocalStorage('gelateria-biz-info', defaultBizInfo)
  const [activeTab, setActiveTab] = useState('suppliers')
  const modal = useModal()
  const [draft, setDraft] = useState(null)

  const openAdd = () => {
    setDraft({ name: '', phone: '', categories: [], note: '', active: true, id: null })
    modal.open()
  }
  const openEdit = sup => {
    setDraft({ ...sup })
    modal.open()
  }
  const save = () => {
    if (!draft?.name.trim()) return
    const rec = { ...draft, id: draft.id || genId() }
    setSuppliers(prev =>
      prev.find(s => s.id === rec.id)
        ? prev.map(s => s.id === rec.id ? rec : s)
        : [...prev, rec]
    )
    modal.close()
  }
  const del = id => {
    if (window.confirm('למחוק ספק זה?')) setSuppliers(prev => prev.filter(s => s.id !== id))
  }
  const testWa = phone => {
    const clean = cleanPhone(phone)
    if (clean) window.open(`https://wa.me/${clean}`, '_blank', 'noopener,noreferrer')
  }
  const reset = () => {
    if (window.confirm('לאפס לברירת מחדל?')) setSuppliers(defaultSuppliers)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Impostazioni</p>
            <h1 className="text-3xl font-serif font-bold mb-1">הגדרות</h1>
            <p className="text-sm text-espresso-400 font-sans">ספקים, WhatsApp ופרטי עסק</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'suppliers' && <Button variant="primary" onClick={openAdd}><Icons.Plus className="w-4 h-4" /> ספק חדש</Button>}
            {activeTab === 'suppliers' && <Button variant="ghost" onClick={reset}><Icons.Reset className="w-4 h-4" /></Button>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[{k:'suppliers',l:'ספקים'},{k:'business',l:'פרטי עסק'}].map(t=>(
            <button key={t.k} onClick={()=>setActiveTab(t.k)}
              className={`px-4 py-2 rounded-xl text-sm font-sans font-medium transition border ${
                activeTab===t.k?'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent':'bg-white dark:bg-espresso-700 border-silk text-espresso-500 hover:border-terra-200'
              }`}>{t.l}</button>
          ))}
        </div>

        {/* Business info tab */}
        {activeTab === 'business' && (
          <div className="card space-y-4">
            <p className="section-eyebrow">פרטי העסק</p>
            <p className="text-xs text-espresso-400 font-sans">הפרטים יופיעו בדוחות מודפסים ובהודעות WhatsApp</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {k:'name',    l:'שם העסק',          ph:'Sweet Station'},
                {k:'phone',   l:'טלפון',             ph:'050-000-0000'},
                {k:'address', l:'כתובת',             ph:'רחוב, עיר'},
                {k:'email',   l:'אימייל',            ph:'info@...'},
                {k:'vatId',   l:'ח.פ / עוסק מורשה', ph:''},
                {k:'note',    l:'הערה כללית',        ph:''},
              ].map(f=>(
                <div key={f.k}>
                  <label className="block text-xs text-espresso-400 font-sans mb-1">{f.l}</label>
                  <input value={bizInfo[f.k]||''} onChange={e=>setBizInfo(p=>({...p,[f.k]:e.target.value}))}
                    className="input-field" placeholder={f.ph}/>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-silk dark:border-espresso-700">
              <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3 text-sm font-sans space-y-1">
                <p className="font-medium">{bizInfo.name || 'שם העסק'}</p>
                {bizInfo.address && <p className="text-espresso-400">{bizInfo.address}</p>}
                {bizInfo.phone   && <p className="text-espresso-400">{bizInfo.phone}</p>}
                {bizInfo.vatId   && <p className="text-espresso-400">ח.פ: {bizInfo.vatId}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Supplier cards */}
        {activeTab === 'suppliers' && <div>
          <p className="section-eyebrow">ספקים</p>
          <div className="space-y-3">
            {suppliers.map(sup => {
              const cats = sup.categories
                .map(c => inventoryCategories[c]?.label)
                .filter(Boolean)
                .join(', ')
              const hasPhone = !!cleanPhone(sup.phone)
              return (
                <div key={sup.id}
                  className={`card flex items-start gap-4 ${!sup.active ? 'opacity-50' : ''}`}>
                  {/* WhatsApp icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    hasPhone ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-canvas dark:bg-espresso-700 text-espresso-400'
                  }`}>
                    {WHATSAPP_ICON}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-serif font-semibold text-lg">{sup.name}</span>
                      {!sup.active && <span className="tag text-xs">לא פעיל</span>}
                    </div>
                    <p className="text-sm font-mono text-espresso-500 dark:text-espresso-300 mb-1" dir="ltr">
                      {sup.phone ? cleanPhone(sup.phone) : <span className="text-rose-400 font-sans">לא הוגדר מספר</span>}
                    </p>
                    {cats && (
                      <p className="text-xs text-espresso-400 font-sans mb-1">
                        <span className="font-medium">מספק:</span> {cats}
                      </p>
                    )}
                    {sup.note && (
                      <p className="text-xs text-espresso-400 font-sans">📝 {sup.note}</p>
                    )}
                  </div>

                  <div className="flex gap-1.5 flex-shrink-0">
                    {hasPhone && (
                      <button onClick={() => testWa(sup.phone)}
                        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition"
                        title="פתח WhatsApp">
                        {WHATSAPP_ICON}
                      </button>
                    )}
                    <button onClick={() => openEdit(sup)}
                      className="p-2 rounded-xl hover:bg-linen dark:hover:bg-espresso-700 text-espresso-400 hover:text-terra-600 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button onClick={() => del(sup.id)}
                      className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition">
                      <Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>}

        {/* Info box — suppliers only */}
        {activeTab === 'suppliers' && (
        <div className="card bg-terra-50/50 dark:bg-terra-900/10 border border-terra-100 dark:border-terra-800/30">
          <p className="font-serif font-semibold mb-2">איך עובד חיבור WhatsApp?</p>
          <ul className="text-sm font-sans text-espresso-600 dark:text-espresso-200 space-y-1.5">
            <li>• הזן מספר WhatsApp לכל ספק בפורמט ישראלי (050…) או בינ"ל (972…)</li>
            <li>• בעמוד "ניהול מלאי" — לחץ "שלח הזמנה" כדי לשלוח לספק הנכון אוטומטית</li>
            <li>• בעמוד "משמרות" — לחץ "שלח ל-WhatsApp" כדי לשלוח סידור עבודה לעובד</li>
            <li>• ההודעה נפתחת ב-WhatsApp שלך מוכנה לשליחה — לא נשלחת אוטומטית</li>
          </ul>
        </div>
        )}

        <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close}
        title={draft?.id ? 'ערוך ספק' : 'ספק חדש'} size="md"
        footer={<><Button variant="ghost" onClick={modal.close}>ביטול</Button><Button variant="primary" onClick={save}>שמור</Button></>}>
        {draft && <SupplierForm draft={draft} onChange={setDraft} />}
      </Modal>
    </>
  )
}
