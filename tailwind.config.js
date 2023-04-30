const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./*.{html,ts,js}', './src/**/*.{html,js,ts}'],
  theme: {
    minWidth: {
      0: '0',
      popup: '450px',
      full: '100%'
    },
    fontFamily: {
      sans: ['Roboto', ...defaultTheme.fontFamily.sans]
    },
    extend: {}
  },
  variants: {},
  plugins: []
};
