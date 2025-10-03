/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F3F3F3',   // light gray
        secondary: '#f5e6d7', 
        textColor: '#191919', // black
        darkText: '#0c0c0c', // black
      },
     fontFamily: {
        playfair: ["playfair"],
        montserrat: ["montserrat"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [import("@tailwindcss/typography")],
}
