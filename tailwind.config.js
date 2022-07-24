// const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.vue"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // warmGray: colors.warmGray
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require("@tailwindcss/forms")]
};
