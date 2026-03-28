/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Enables dark: variants when [data-theme="dark"] is set on <html>
  darkMode: ['selector', '[data-theme="dark"]'],
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
        // Severity tokens — auto-adapt via CSS vars (light/dark)
        sev: {
          critical: {
            bg:     'rgb(var(--sev-critical-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-critical-border) / <alpha-value>)',
            text:   'rgb(var(--sev-critical-text) / <alpha-value>)',
          },
          high: {
            bg:     'rgb(var(--sev-high-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-high-border) / <alpha-value>)',
            text:   'rgb(var(--sev-high-text) / <alpha-value>)',
          },
          medium: {
            bg:     'rgb(var(--sev-medium-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-medium-border) / <alpha-value>)',
            text:   'rgb(var(--sev-medium-text) / <alpha-value>)',
          },
          low: {
            bg:     'rgb(var(--sev-low-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-low-border) / <alpha-value>)',
            text:   'rgb(var(--sev-low-text) / <alpha-value>)',
          },
          clean: {
            bg:     'rgb(var(--sev-clean-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-clean-border) / <alpha-value>)',
            text:   'rgb(var(--sev-clean-text) / <alpha-value>)',
          },
          kev: {
            bg:     'rgb(var(--sev-kev-bg) / <alpha-value>)',
            border: 'rgb(var(--sev-kev-border) / <alpha-value>)',
            text:   'rgb(var(--sev-kev-text) / <alpha-value>)',
          },
        },
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
