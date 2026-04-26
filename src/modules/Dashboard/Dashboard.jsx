import { useState } from 'react'
import { Checklist } from './Checklist.jsx'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { checklistTemplates as defaultTemplates } from '../../data/checklistData.js'
import { defaultInventory } from '../../data/inventoryData.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Link } from 'react-router-dom'
import { todayKey } from '../../utils/dateFormat.js'
import { openWhatsApp } from '../../utils/whatsapp.js'
import { defaultSuppliers } from '../../data/suppliersData.js'

function getGreeting() {
  const h=new Date().getHours()
  if(h<6)  return {it:'Buona notte',he:'לילה טוב'}
  if(h<12) return {it:'Buongiorno',he:'בוקר טוב'}
  if(h<17) return {it:'Buon pomeriggio',he:'אחר הצהריים טובים'}
  return       {it:'Buonasera',he:'ערב טוב'}
}

const quickActions=[
  {to:'/menu',      icon:'IceCream',  label:'תפריט',      it:'Menu',     color:'bg-terra-50 dark:bg-terra-900/20 text-terra-600 dark:text-terra-300'},
  {to:'/recipes',   icon:'Recipe',    label:'חשב בצק',    it:'Ricetta',  color:'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300'},
  {to:'/shifts',    icon:'Clock',     label:'משמרות',     it:'Turni',    color:'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300'},
  {to:'/inventory', icon:'Inventory', label:'עדכן מלאי',  it:'Magazzino',color:'bg-sage-50 dark:bg-sage-800/20 text-sage-600 dark:text-sage-400'},
  {to:'/equipment', icon:'Dashboard', label:'ציוד לפתיחה',it:'Attrezzatura',color:'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-300'},
  {to:'/print',     icon:'Print',     label:'הדפס PDF',   it:'Stampa',   color:'bg-canvas dark:bg-espresso-700 text-espresso-500'},
]

export function Dashboard() {
  const [activeTab,setActiveTab]=useState('opening')
  const [inventory]=useLocalStorage('gelateria-inventory',defaultInventory)
  const [suppliers]=useLocalStorage('gelateria-suppliers',defaultSuppliers)
  const [bizInfo]=useLocalStorage('gelateria-biz-info',{name:'Sweet Station'})
  const [templates,setTemplates]=useLocalStorage('gelateria-checklist-templates',defaultTemplates)
  const [workers]=useLocalStorage('gelateria-workers',[])
  const [weekSchedules]=useLocalStorage('gelateria-weekly-schedules',{})
  const greeting=getGreeting()
  const lowStock=inventory.filter(i=>i.current<i.opening)
  const today=new Date().toISOString().slice(0,10)

  // Today's shifts from weekly schedule
  const DAYS=['sun','mon','tue','wed','thu','fri','sat']
  const SHIFTS=[
    {id:'morning',label:'בוקר',   emoji:'🌅',hours:'07:00-15:00'},
    {id:'noon',   label:'צהריים', emoji:'🌤',hours:'12:00-20:00'},
    {id:'evening',label:'ערב',    emoji:'🌙',hours:'16:00-00:00'},
  ]
  const dayId=DAYS[new Date().getDay()]
  // Find current week schedule
  const todayShifts = (() => {
    const weekKey = Object.keys(weekSchedules).find(k => {
      const d=new Date(); const jan1=new Date(d.getFullYear(),0,1)
      const w=Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)
      return k===`${d.getFullYear()}-W${String(w).padStart(2,'0')}`
    })
    if (!weekKey) return []
    const daySchedule=weekSchedules[weekKey]?.[dayId]||{}
    return SHIFTS.map(s=>({
      ...s,
      workers:(daySchedule[s.id]||[]).map(id=>workers.find(w=>w.id===id)).filter(Boolean)
    })).filter(s=>s.workers.length>0)
  })()
  const openingDone=Object.keys(JSON.parse(localStorage.getItem(`gelateria-opening-${today}`)||'{}')).length
  const closingDone=Object.keys(JSON.parse(localStorage.getItem(`gelateria-closing-${today}`)||'{}')).length
  const openingTotal=templates.opening.items.length
  const closingTotal=templates.closing.items.length
  const allOpeningDone=openingDone===openingTotal && openingTotal>0
  const allClosingDone=closingDone===closingTotal && closingTotal>0

  const sendMorningReport = () => {
    if (lowStock.length === 0) { alert('כל המלאי תקין — אין מה לדווח! ✅'); return }
    const lines = [
      `🍦 *${bizInfo.name || 'Sweet Station'} — דוח בוקר*`,
      `📅 ${new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})}`,
      ``,
      `⚠️ *${lowStock.length} מוצרים צריכים הזמנה:*`,
      ...lowStock.map(i=>`• ${i.name}: יש ${i.current} ${i.unit} / נדרש ${i.opening} ${i.unit}`),
      ``,
      `_נשלח מ-Sweet Station Pro_`,
    ]
    // Send to self — use first supplier's phone as fallback, or show message
    const myPhone = bizInfo.phone
    if (myPhone) openWhatsApp(myPhone, lines.join('\n'))
    else { alert('הוסף מספר טלפון שלך בהגדרות → פרטי עסק כדי לשלוח דוח בוקר לעצמך') }
  }

  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-espresso-700 border border-silk dark:border-espresso-600"
           style={{boxShadow:'0 2px 8px rgba(90,60,30,0.07),0 8px 32px rgba(90,60,30,0.05)'}}>
        <div className="relative px-7 py-8 md:px-10 md:py-10">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-terra-100 dark:bg-terra-900/30 opacity-50"/>
            <div className="absolute -bottom-20 -right-10 w-48 h-48 rounded-full bg-linen dark:bg-espresso-600 opacity-40"/>
          </div>
          <div className="relative">
            <p className="font-serif italic text-terra-500 dark:text-terra-300 text-lg mb-1 tracking-wide">{greeting.it}</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 leading-tight">{greeting.he}!</h1>
            <p className="text-espresso-400 dark:text-espresso-300 font-sans text-sm">
              {new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            </p>
          </div>
        </div>
        <div className="border-t border-silk dark:border-espresso-600 bg-linen/60 dark:bg-espresso-800/40 px-7 md:px-10 py-3 flex items-center gap-2 flex-wrap">
          <span className={`tag ${allOpeningDone?'text-sage-600 border-sage-100 bg-sage-50':''}`}>{allOpeningDone?'✓ ':''} פתיחה {openingDone}/{openingTotal}</span>
          <span className={`tag ${allClosingDone?'text-sage-600 border-sage-100 bg-sage-50':''}`}>{allClosingDone?'✓ ':''} סגירה {closingDone}/{closingTotal}</span>
          {lowStock.length>0&&<Link to="/inventory" className="tag text-rose-600 border-rose-100 bg-rose-50 hover:bg-rose-100 transition">⚠ {lowStock.length} מלאי נמוך</Link>}
          {lowStock.length>0&&(
            <button onClick={sendMorningReport}
              className="tag text-emerald-700 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              דוח בוקר
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="פתיחת סניף" icon={<Icons.Dashboard className="w-5 h-5"/>} value={openingDone} total={openingTotal} accent="terra"/>
        <StatCard label="סגירת סניף" icon={<Icons.Clock className="w-5 h-5"/>}     value={closingDone} total={closingTotal} accent="sage"/>
        <StatCard label="פריטי מלאי" icon={<Icons.Inventory className="w-5 h-5"/>} value={inventory.length} accent="warm"/>
        <StatCard label="מלאי נמוך"  icon={<Icons.Alert className="w-5 h-5"/>}     value={lowStock.length} accent={lowStock.length>0?'danger':'warm'} linkTo="/inventory"/>
      </div>

      {/* Today's shifts */}
      {todayShifts.length > 0 && (
        <div>
          <p className="section-eyebrow">משמרות היום</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {todayShifts.map(shift => (
              <div key={shift.id} className="card flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{shift.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm">{shift.label}</p>
                  <p className="text-xs text-espresso-400 font-sans mb-2">{shift.hours}</p>
                  <div className="flex flex-wrap gap-1">
                    {shift.workers.map(w=>(
                      <span key={w.id} className="tag text-xs">{w.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="section-eyebrow">פעולות מהירות</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map(qa=>{const Icon=Icons[qa.icon];return(
            <Link key={qa.to} to={qa.to} className="card-hover flex flex-col gap-3 p-5 group">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${qa.color} transition-transform group-hover:scale-110`}><Icon className="w-5 h-5"/></div>
              <div>
                <p className="text-xs font-sans text-terra-500 dark:text-terra-300 italic mb-0.5">{qa.it}</p>
                <p className="text-sm font-medium font-sans">{qa.label}</p>
              </div>
            </Link>
          )})}
        </div>
      </div>

      {/* Checklist */}
      <div>
        <p className="section-eyebrow">צ'קליסט יומי</p>
        <div className="flex gap-2 mb-5">
          {['opening','closing'].map(tab=>{
            const done=tab==='opening'?openingDone:closingDone
            const total2=tab==='opening'?openingTotal:closingTotal
            const isDone=done===total2&&total2>0
            return(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-sans font-medium transition-all ${
                  activeTab===tab?'bg-espresso-800 dark:bg-espresso-700 text-white'
                                :'bg-white dark:bg-espresso-700 border border-silk dark:border-espresso-600 text-espresso-500 hover:border-bisque'
                }`}>
                {tab==='opening'?'פתיחת סניף':'סגירת סניף'}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-mono ${activeTab===tab?isDone?'bg-sage-400/30 text-sage-100':'bg-white/15 text-white/80':'bg-canvas dark:bg-espresso-600 text-espresso-400'}`}>
                  {done}/{total2}
                </span>
              </button>
            )
          })}
        </div>
        <Checklist
          template={templates[activeTab]}
          storageKey={activeTab}
          onTemplateChange={updated=>updateTemplate(activeTab,updated)}
        />
      </div>
    </div>
  )
}

const accentMap={
  terra: {icon:'bg-terra-50 dark:bg-terra-900/30 text-terra-600 dark:text-terra-200',bar:'bg-terra-400'},
  sage:  {icon:'bg-sage-50 dark:bg-sage-800/20 text-sage-600 dark:text-sage-400',bar:'bg-sage-400'},
  warm:  {icon:'bg-canvas dark:bg-espresso-600 text-espresso-500 dark:text-espresso-200',bar:'bg-bisque'},
  danger:{icon:'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-300',bar:'bg-rose-400'},
}
function StatCard({label,value,total,accent='warm',icon,linkTo}){
  const a=accentMap[accent]||accentMap.warm
  const content=(
    <div className="card flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.icon}`}>{icon}</div>
      <div>
        <p className="stat-value">{value}{total!==undefined&&<span className="text-base font-sans font-normal text-espresso-400">/{total}</span>}</p>
        <p className="stat-label mt-1">{label}</p>
      </div>
      {total!==undefined&&<div className="progress-track"><div className={`h-full rounded-full ${a.bar} transition-all duration-700`} style={{width:`${Math.round((value/total)*100)}%`}}/></div>}
    </div>
  )
  return linkTo?<Link to={linkTo} className="block hover:opacity-90 transition">{content}</Link>:content
}
