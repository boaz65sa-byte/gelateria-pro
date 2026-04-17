import { NavLink } from 'react-router-dom'
import { Icons } from './ui/Icons.jsx'

const navGroups = [
  {
    label: 'תפעול',
    items: [
      { path:'/',        label:'Operazioni', sub:'לוח תפעול',        icon:'Dashboard' },
      { path:'/shifts',  label:'Turni',      sub:'משמרות עובדים',    icon:'Clock'     },
    ]
  },
  {
    label: 'מתכונים',
    items: [
      { path:'/recipes', label:'Ricette',    sub:'מחשבון מתכונים',   icon:'Recipe'    },
      { path:'/custom',  label:'Dal sacchetto', sub:'מתכון מהשקית', icon:'IceCream'  },
    ]
  },
  {
    label: 'מלאי והגשה',
    items: [
      { path:'/inventory',label:'Magazzino', sub:'ניהול מלאי',       icon:'Inventory' },
      { path:'/plating',  label:'Impiattare',sub:'מדריך הגשה',       icon:'Plating'   },
      { path:'/print',    label:'Manuale',   sub:'ספר מודפס / PDF',  icon:'Print'     },
    ]
  },
]

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-espresso-900/50 backdrop-blur-sm lg:hidden no-print" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:sticky top-0 right-0 z-50 h-screen w-72
        bg-linen dark:bg-espresso-800
        border-l border-silk dark:border-espresso-700
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col no-print
      `}>

        {/* Brand */}
        <div className="px-6 pt-7 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-terra-400 flex items-center justify-center flex-shrink-0"
                 style={{boxShadow:'0 3px 12px rgba(217,106,62,0.35)'}}>
              <Icons.IceCream className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl leading-tight text-espresso-800 dark:text-espresso-50 tracking-tight">
                Gelateria
              </h1>
              <p className="text-xs text-espresso-400 dark:text-espresso-300 leading-tight font-sans tracking-wide">
                Pro · ניהול תפעול
              </p>
            </div>
          </div>
        </div>

        <div className="mx-6 h-px bg-silk dark:bg-espresso-700" />

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
              <p className="px-3 mb-1.5" style={{fontSize:'0.6rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--tw-color-espresso-400, #a38567)',fontWeight:600}}>
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = Icons[item.icon] || Icons.Dashboard
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                            isActive
                              ? 'bg-terra-400 text-white'
                              : 'text-espresso-500 dark:text-espresso-200 hover:bg-canvas dark:hover:bg-espresso-700'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-canvas dark:bg-espresso-700 text-espresso-400 dark:text-espresso-300 group-hover:bg-silk dark:group-hover:bg-espresso-600'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium leading-tight font-sans ${
                                isActive ? 'text-white' : 'text-espresso-700 dark:text-espresso-100'
                              }`}>{item.label}</p>
                              <p className={`text-xs leading-tight truncate font-sans ${
                                isActive ? 'text-white/70' : 'text-espresso-400 dark:text-espresso-400'
                              }`}>{item.sub}</p>
                            </div>
                          </>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mx-6 h-px bg-silk dark:bg-espresso-700" />
        <div className="p-6">
          <p className="text-xs text-espresso-400 dark:text-espresso-400 text-center leading-relaxed font-sans">
            <span className="font-serif font-semibold text-espresso-600 dark:text-espresso-200 block mb-0.5">bs-simple.com</span>
            בועז סעדה — פתרונות יצירתיים
          </p>
        </div>
      </aside>
    </>
  )
}
