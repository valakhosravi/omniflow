const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'color-neutral': {
          '100': '#EEEEF0'
        },
        'sidebar-text': 'rgba(28, 58, 99, 0.5)'
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
