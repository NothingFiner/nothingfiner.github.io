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
        'bg-light': '#FDFFFC',
        'bg-dark': '#292E1E',
        'accent-green': '#8B9556',
        'accent-red': '#8C1C13',
        'accent-purple': '#61304B',
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
