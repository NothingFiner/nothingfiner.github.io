/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#F9FAF4',
        'bg-dark': '#0D0221',
        'grey': '#686474',
        'accent-green': 'var(--color-accent-green)',
        'accent-red': '#A6022A',
        'accent-purple': '#686474',
      },
      backgroundColor: {
        'page': 'var(--color-bg)',
      },
      textColor: {
        'theme': 'var(--color-fg)',
      },
      fontFamily: {
        'body': ['Space Mono', 'monospace'],
        'heading': ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        'heading': '200',
      },
    },
  },
  plugins: [],
}
