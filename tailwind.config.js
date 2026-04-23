const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#eff9ff',
          '100': '#dbf1fe',
          '200': '#c0e7fd',
          '300': '#94d9fc',
          '400': '#61c2f9',
          '500': '#3da5f4',
          '600': '#2789e9',
          '700': '#1f72d6',
          '800': '#1f5dae',
          '900': '#1f4f89',
          '950': '#1c3a63',
        },
        'neutral': {
          '50': '#f7f8f8',
          '100': '#eeeef0',
          '200': '#d8d9df',
          '300': '#b7bbc2',
          '400': '#8f94a1',
          '500': '#6c727f',
          '600': '#5c616d',
          '700': '#4b4f59',
          '800': '#40444c',
          '900': '#393b41',
          '950': '#26272b',
        },
        'accent': {
          '50': '#eaf7ec',
          '100': '#6bbf7b',
          '200': '#fff8e1',
          '300': '#f4b400',
          '400': '#fdecec',
          '500': '#e57373',
          '600': '#e4f5f8',
          '700': '#4fb0c6',
        },
        'success': {
          '50': '#E8F5E9',
          '100': '#C8E6C9',
          '500': '#4CAF50',
          '600': '#43A047',
          '700': '#388E3C',
        },
        'info': {
          '50': '#E3F2FD',
          '100': '#BBDEFB',
          '500': '#42A5F5',
          '600': '#2196F3',
          '700': '#1E88E5',
        },
        'warning': {
          '50': '#FFF3E0',
          '100': '#FFE0B2',
          '500': '#FFA726',
          '600': '#FB8C00',
          '700': '#F57C00',
        },
        'help': {
          '50': '#EDE7F6',
          '100': '#D1C4E9',
          '500': '#7C4DFF',
          '600': '#651FFF',
          '700': '#6200EA',
        },
        'danger': {
          '50': '#FCE4EC',
          '100': '#F8BBD9',
          '500': '#FF1751',
          '600': '#E91E63',
          '700': '#C2185B',
        },
        'brand': {
          DEFAULT: '#1C3A63',
        },
        'sidebar-text': 'rgba(28, 58, 99, 0.5)',
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
