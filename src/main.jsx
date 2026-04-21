import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/**
 * HashRouter במקום BrowserRouter — נדרש ל-GitHub Pages!
 * GitHub Pages הוא static hosting — אין server-side routing.
 * HashRouter משתמש ב-# בURL:
 *   https://user.github.io/gelateria-pro/#/recipes
 * במקום:
 *   https://user.github.io/gelateria-pro/recipes  ← 404 ב-GitHub Pages
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
