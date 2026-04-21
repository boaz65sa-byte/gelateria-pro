import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * base: './' — נחוץ ל-GitHub Pages!
 * ללא זה, כל הנכסים (CSS/JS) נטענים מ-/ ולא עובדים בתת-נתיב של GitHub.
 * לדוגמה: https://username.github.io/gelateria-pro/
 *
 * אם אתה מארח ב-custom domain ב-root — שנה base ל-'/'
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
