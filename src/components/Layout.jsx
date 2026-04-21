import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Icons } from './ui/Icons.jsx'
import { useTheme } from '../hooks/useTheme.js'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggle } = useTheme()
  return (
    <div className="min-h-screen flex bg-parchment dark:bg-espresso-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-parchment/90 dark:bg-espresso-900/90 backdrop-blur-md border-b border-silk dark:border-espresso-700 no-print">
          <div className="flex items-center justify-between px-5 md:px-8 h-14">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -mr-2 rounded-xl hover:bg-linen transition text-espresso-500"
              aria-label="פתח תפריט">
              <Icons.Menu />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-espresso-400 font-sans">
              <Icons.Clock className="w-4 h-4 text-terra-400" />
              {new Date().toLocaleDateString('he-IL', { weekday:'long', day:'numeric', month:'long' })}
            </div>
            <button onClick={toggle}
              className="p-2 rounded-xl hover:bg-linen transition text-espresso-400"
              title={theme === 'dark' ? 'מצב יום' : 'מצב לילה'}>
              {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
            </button>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
        <footer className="px-8 py-4 border-t border-silk dark:border-espresso-700 no-print">
          <p className="text-xs text-center text-espresso-400 font-sans">
            <span className="font-serif font-medium text-espresso-500">bs-simple.com</span>
            {' '}·{' '}בועז סעדה — פתרונות יצירתיים
          </p>
        </footer>
      </main>
    </div>
  )
}
