/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F3F3F3',   // light gray
        secondary: '#f5e6d7', 
        textColor: '#191919', // black
      },
    //  fontFamily: {
    //     playfair: ["playfair", "serif"],
    //     montserrat: ["montserrat", "sans-serif"],
    //   },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
