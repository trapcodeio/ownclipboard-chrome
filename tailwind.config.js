module.exports = {
  purge: {content: ['./dev/**/*.html', './dev/**/*.vue']},
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    // ...
    require('@tailwindcss/forms'),
  ],
}
