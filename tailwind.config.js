/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0D1117',
          surface: '#161B22',
          border:  '#30363D',
          accent:  '#E63946',
          accent2: '#457B9D',
          text:    '#E6EDF3',
          muted:   '#8B949E',
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
