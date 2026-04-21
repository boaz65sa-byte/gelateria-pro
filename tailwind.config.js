/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Fragola Italiana — אדום · לבן · בסיל ──
        parchment: '#FFFAFA',   // page background
        linen:     '#FFF5F5',   // sidebar + card surface
        canvas:    '#FFE8EA',   // pressed / input bg
        silk:      '#FFCCD0',   // borders light
        bisque:    '#FFB3BA',   // borders medium

        // Fragola accent (replaces terra)
        terra: {
          50:  '#FFF5F5',
          100: '#FFCCD0',
          200: '#FF9FAB',
          300: '#FF7585',
          400: '#FF5C6B',  // primary CTA
          500: '#E8485A',
          600: '#CC2F42',
          700: '#A31B2D',
          800: '#6B0010',
          900: '#3D0008',
        },
        // Espresso text (unchanged — warm dark)
        espresso: {
          50:  '#FFF5F5',
          100: '#FFD6DA',
          200: '#C2979A',
          300: '#9B6870',
          400: '#7A4450',
          500: '#5C2D38',
          600: '#421E28',
          700: '#2B1018',
          800: '#1A080F',
          900: '#0D0407',
        },
        // Sage green (success, nature — unchanged)
        sage: {
          50:  '#F0F7F0',
          100: '#D0E8D0',
          400: '#4A9B60',
          600: '#2E6B3E',
          800: '#1A3D22',
        },
        // Rose alerts (warm — aligned with theme)
        rose: {
          50:  '#FFF0F2',
          100: '#FFD6DA',
          400: '#FF5C6B',
          600: '#CC2F42',
          800: '#6B0010',
        },
      },
      fontFamily: {
        sans:  ['Heebo', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
    },
  },
  plugins: [],
}
