@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { color-scheme: light; }
  html  { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body  { @apply bg-parchment text-espresso-700 font-sans; font-feature-settings: 'kern','liga'; }
  .dark body { @apply bg-espresso-800 text-espresso-50; }
  h1,h2,h3,h4 { @apply font-serif text-espresso-800 dark:text-espresso-50; }
  input[type="range"] { direction: ltr; }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
           font-sans font-medium text-sm transition-all duration-150 border border-transparent
           focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-400 focus-visible:ring-offset-2
           disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97];
  }
  .btn-primary   { @apply btn bg-terra-400 text-white hover:bg-terra-500; }
  .btn-secondary { @apply btn bg-linen dark:bg-espresso-600 text-espresso-700 dark:text-espresso-50 border-silk dark:border-espresso-500 hover:bg-canvas dark:hover:bg-espresso-500; }
  .btn-ghost     { @apply btn text-espresso-400 dark:text-espresso-200 hover:bg-linen dark:hover:bg-espresso-700; }
  .btn-danger    { @apply btn bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100; }

  .card {
    @apply bg-white dark:bg-espresso-700 rounded-2xl border border-silk dark:border-espresso-600 p-5 md:p-6;
    box-shadow: 0 1px 3px rgba(90,60,30,0.06), 0 4px 20px rgba(90,60,30,0.04);
  }
  .card-hover {
    @apply card cursor-pointer transition-all duration-200;
  }
  .card-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 28px rgba(90,60,30,0.10), 0 2px 6px rgba(90,60,30,0.06);
    @apply border-bisque;
  }
  .cat-card {
    @apply bg-white dark:bg-espresso-700 rounded-2xl p-4 border border-silk dark:border-espresso-600
           transition-all duration-200 cursor-pointer text-right;
    box-shadow: 0 1px 3px rgba(90,60,30,0.05);
  }
  .cat-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(90,60,30,0.09); }

  .input-field {
    @apply w-full px-3.5 py-2.5 rounded-xl border border-silk dark:border-espresso-600
           bg-linen dark:bg-espresso-700 text-espresso-800 dark:text-espresso-50 text-sm
           focus:outline-none focus:ring-2 focus:ring-terra-400 focus:border-transparent
           transition placeholder:text-bisque;
  }

  .badge         { @apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium; }
  .badge-terra   { @apply badge bg-terra-50   text-terra-700   dark:bg-terra-900/30  dark:text-terra-200; }
  .badge-danger  { @apply badge bg-rose-50    text-rose-700    dark:bg-rose-900/30   dark:text-rose-300; }
  .badge-success { @apply badge bg-sage-50    text-sage-600    dark:bg-sage-800/30   dark:text-sage-100; }
  .badge-warm    { @apply badge bg-canvas     text-espresso-600; }

  .progress-track { @apply h-1.5 rounded-full bg-canvas dark:bg-espresso-600 overflow-hidden; }
  .progress-fill  { @apply h-full rounded-full bg-terra-400 transition-all duration-700 ease-out; }

  .section-eyebrow {
    @apply text-xs font-sans font-semibold uppercase tracking-widest
           text-espresso-400 dark:text-espresso-300 mb-3;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
  }
  .stat-value { @apply text-3xl font-serif font-bold leading-none text-espresso-800 dark:text-espresso-50; }
  .stat-label { @apply font-sans uppercase text-espresso-400 dark:text-espresso-300; font-size:0.65rem; letter-spacing:0.1em; }
  .divider    { @apply border-t border-silk dark:border-espresso-600; }
  .tag        { @apply inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-linen dark:bg-espresso-600 text-espresso-500 dark:text-espresso-200 border border-silk dark:border-espresso-500; }
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(180,140,100,0.25); border-radius: 3px; }
.dark ::-webkit-scrollbar-thumb { background: rgba(200,160,110,0.20); }
input[type=range] { accent-color: #D96A3E; }

@media print {
  @page { margin: 18mm; size: A4; }
  body { background: white !important; color: black !important; }
  .no-print, .no-print * { display: none !important; }
  .print-only { display: block !important; }
  .page-break  { page-break-after: always; break-after: page; }
  .avoid-break { page-break-inside: avoid; break-inside: avoid; }
  .card,.card-hover { box-shadow:none !important; border:1px solid #ddd !important; break-inside:avoid; }
  h1,h2,h3 { color:black !important; }
}
.print-only { display: none; }
