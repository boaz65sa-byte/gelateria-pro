/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Warm White / Italian Café palette ──
        parchment: '#FAF7F2',   // page background
        linen:     '#F4EFE6',   // card surface
        canvas:    '#EDE6D9',   // pressed / input bg
        silk:      '#E2D9C8',   // borders light
        bisque:    '#CEC0A8',   // borders medium

        // Terracotta accent (replaces gold)
        terra: {
          50:  '#FDF3EE',
          100: '#F9DDD0',
          200: '#F2BAA0',
          300: '#E8906C',
          400: '#D96A3E',  // primary CTA
          500: '#BF5530',
          600: '#9A4225',
          700: '#77301A',
          800: '#541F10',
          900: '#321007',
        },
        // Espresso text
        espresso: {
          50:  '#F5F0EB',
          100: '#E0D5C8',
          200: '#C2AD97',
          300: '#A38567',
          400: '#856040',
          500: '#5C4028',
          600: '#412C18',
          700: '#2B1C0D',
          800: '#1A1008',
          900: '#0D0804',
        },
        // Sage green (success, nature)
        sage: {
          50:  '#F2F6F0',
          100: '#D9E8D4',
          400: '#6A9B60',
          600: '#426938',
          800: '#243A1E',
        },
        // Dusty rose (alerts warm)
        rose: {
          50:  '#FDF2F2',
          100: '#F9DADA',
          400: '#D4756A',
          600: '#A8433A',
          800: '#6B2420',
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
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
