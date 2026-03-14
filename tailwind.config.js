/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // These use CSS vars → change automatically with data-theme on <html>
          bg:      'rgb(var(--brand-bg) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface) / <alpha-value>)',
          border:  'rgb(var(--brand-border) / <alpha-value>)',
          text:    'rgb(var(--brand-text) / <alpha-value>)',
          muted:   'rgb(var(--brand-muted) / <alpha-value>)',
          // Fixed — same in both themes
          accent:  '#E63946',
          accent2: '#457B9D',
          success: '#2DA44E',
          warning: '#E3B341',
          danger:  '#F85149',
          info:    '#388BFD',
        },
      },
    },
  },
  plugins: [],
}
