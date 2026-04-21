import { useState } from 'react'
import { Checklist } from './Checklist.jsx'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { checklistTemplates as defaultTemplates } from '../../data/checklistData.js'
import { defaultInventory } from '../../data/inventoryData.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Link } from 'react-router-dom'

function getGreeting() {
  const h=new Date().getHours()
  if(h<6)  return {it:'Buona notte',he:'לילה טוב'}
  if(h<12) return {it:'Buongiorno',he:'בוקר טוב'}
  if(h<17) return {it:'Buon pomeriggio',he:'אחר הצהריים טובים'}
  return       {it:'Buonasera',he:'ערב טוב'}
}

const quickActions=[
  {to:'/recipes',   icon:'Recipe',    label:'חשב בצק',    it:'Ricetta',  color:'bg-terra-50 dark:bg-terra-900/20 text-terra-600 dark:text-terra-300'},
  {to:'/shifts',    icon:'Clock',     label:'משמרות',     it:'Turni',    color:'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300'},
  {to:'/inventory', icon:'Inventory', label:'עדכן מלאי',  it:'Magazzino',color:'bg-sage-50 dark:bg-sage-800/20 text-sage-600 dark:text-sage-400'},
  {to:'/print',     icon:'Print',     label:'הדפס PDF',   it:'Stampa',   color:'bg-canvas dark:bg-espresso-700 text-espresso-500'},
]

export function Dashboard() {
  const [activeTab,setActiveTab]=useState('opening')
  const [inventory]=useLocalStorage('gelateria-inventory',defaultInventory)
  const [templates,setTemplates]=useLocalStorage('gelateria-checklist-templates',defaultTemplates)
  const greeting=getGreeting()
  const lowStock=inventory.filter(i=>i.quantity<=i.threshold)
  const today=new Date().toISOString().slice(0,10)
  const openingDone=Object.keys(JSON.parse(localStorage.getItem(`gelateria-opening-${today}`)||'{}')).length
  const closingDone=Object.keys(JSON.parse(localStorage.getItem(`gelateria-closing-${today}`)||'{}')).length
  const openingTotal=templates.opening.items.length
  const closingTotal=templates.closing.items.length
  const allOpeningDone=openingDone===openingTotal && openingTotal>0
  const allClosingDone=closingDone===closingTotal && closingTotal>0

  const updateTemplate=(key,updated)=>setTemplates(prev=>({...prev,[key]:updated}))

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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="פתיחת סניף" icon={<Icons.Dashboard className="w-5 h-5"/>} value={openingDone} total={openingTotal} accent="terra"/>
        <StatCard label="סגירת סניף" icon={<Icons.Clock className="w-5 h-5"/>}     value={closingDone} total={closingTotal} accent="sage"/>
        <StatCard label="פריטי מלאי" icon={<Icons.Inventory className="w-5 h-5"/>} value={inventory.length} accent="warm"/>
        <StatCard label="מלאי נמוך"  icon={<Icons.Alert className="w-5 h-5"/>}     value={lowStock.length} accent={lowStock.length>0?'danger':'warm'} linkTo="/inventory"/>
      </div>

      {/* Quick actions */}
      <div>
        <p className="section-eyebrow">פעולות מהירות</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
