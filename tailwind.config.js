import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionProperty: {
        bg: 'background-color',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
    themes: [
      {
        light: {
          ...themes['light'],
          "base-100": "#fff",
        },
        dark: {
          ...themes['dark'],
          // "base-100": "#242424",
        }
      },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]'],
};
