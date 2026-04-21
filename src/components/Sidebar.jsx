import { NavLink } from 'react-router-dom'
import { Icons } from './ui/Icons.jsx'

const SettingsIcon = ({ className = '' }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="2.5"/>
    <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.1 4.1l1.1 1.1M14.8 14.8l1.1 1.1M4.1 15.9l1.1-1.1M14.8 5.2l1.1-1.1"/>
  </svg>
)
const WaIcon = ({ className = '' }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const navGroups = [
  {
    label: 'תפעול יומי',
    items: [
      { path:'/',        label:'Operazioni',    sub:'לוח תפעול',         Icon: () => <Icons.Dashboard className="w-4 h-4"/> },
      { path:'/shifts',  label:'Turni',         sub:'משמרות + WhatsApp', Icon: WaIcon },
    ]
  },
  {
    label: 'תפריט',
    items: [
      { path:'/menu',    label:'Sweet Station', sub:'תפריט דו-לשוני',    Icon: () => <Icons.IceCream className="w-4 h-4"/> },
      { path:'/plating', label:'Impiattare',    sub:'מדריך הגשה',        Icon: () => <Icons.Plating className="w-4 h-4"/> },
    ]
  },
  {
    label: 'מתכונים',
    items: [
      { path:'/recipes', label:'Ricette',        sub:'מחשבון מתכונים',   Icon: () => <Icons.Recipe className="w-4 h-4"/> },
      { path:'/custom',  label:'Dal sacchetto',  sub:'מתכון מהשקית',     Icon: () => <Icons.Recipe className="w-4 h-4"/> },
    ]
  },
  {
    label: 'מלאי ודוחות',
    items: [
      { path:'/inventory', label:'Magazzino',    sub:'מלאי + הזמנות WA', Icon: WaIcon },
      { path:'/print',     label:'Manuale',      sub:'ספר מודפס / PDF',   Icon: () => <Icons.Print className="w-4 h-4"/> },
    ]
  },
  {
    label: 'מערכת',
    items: [
      { path:'/settings', label:'Impostazioni',  sub:'ספקים + WhatsApp',  Icon: SettingsIcon },
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
                 style={{boxShadow:'0 3px 14px rgba(255,92,107,0.40)'}}>
              <Icons.IceCream className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl leading-tight text-espresso-800 dark:text-espresso-50 tracking-tight">
                Sweet Station
              </h1>
              <p className="text-xs text-espresso-400 dark:text-espresso-300 leading-tight font-sans tracking-wide">
                Pro · ניהול תפעול
              </p>
            </div>
          </div>
        </div>

        <div className="mx-6 h-px bg-silk dark:bg-espresso-700" />

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              <p className="px-3 mb-1 font-sans font-semibold text-espresso-400 dark:text-espresso-400"
                 style={{fontSize:'0.6rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.path}>
                    <NavLink to={item.path} end={item.path === '/'} onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                          isActive
                            ? 'bg-terra-400 text-white'
                            : 'hover:bg-canvas dark:hover:bg-espresso-700'
                        }`
                      }>
                      {({ isActive }) => (
                        <>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-canvas dark:bg-espresso-700 text-espresso-400 dark:text-espresso-300 group-hover:bg-silk dark:group-hover:bg-espresso-600'
                          }`}>
                            <item.Icon />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium leading-tight font-sans ${isActive ? 'text-white' : 'text-espresso-700 dark:text-espresso-100'}`}>
                              {item.label}
                            </p>
                            <p className={`text-xs leading-tight truncate font-sans ${isActive ? 'text-white/70' : 'text-espresso-400'}`}>
                              {item.sub}
                            </p>
                          </div>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mx-6 h-px bg-silk dark:bg-espresso-700" />
        <div className="p-6">
          <p className="text-xs text-espresso-400 text-center leading-relaxed font-sans">
            <span className="font-serif font-semibold text-espresso-600 dark:text-espresso-200 block mb-0.5">bs-simple.com</span>
            בועז סעדה — פתרונות יצירתיים
          </p>
        </div>
      </aside>
    </>
  )
}
