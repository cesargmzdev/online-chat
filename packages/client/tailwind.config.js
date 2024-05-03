/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        tech: ['Share Tech', 'sans-serif']
      }
    }
  },
  plugins: []
}
