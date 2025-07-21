// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#30a648',
        black: '#000',
        white: '#fff',
        // Optionally, add shades for hover/active
        'primary-dark': '#27853a',
      },
      backgroundColor: {
        'dark': '#000',
      },
      textColor: {
        'primary': '#30a648',
        'dark': '#fff',
      },
    },
  },
  plugins: [],
}

