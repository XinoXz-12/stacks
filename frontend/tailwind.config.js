/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': 'var(--white)',
        'black': 'var(--black)',
        'bg': 'var(--bg)',
        'prim': 'var(--prim)',
        'prim-hover': 'var(--prim-hover)',
        'sec': 'var(--sec)',
      },
      fontFamily: {
        sans: ['Dosis', 'sans-serif'],
      },
      screens: {
        'xs': '450px',
      },
    },
  },
  plugins: [],
} 