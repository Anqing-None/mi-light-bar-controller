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
          primary: '#3b82f6',
          '.btn': {
            'background-color': '#e5e7eb',
          },
          '.btn-primary': {
            'background-color': '#3b82f6',
          },
        },
        dark: {
          ...themes['dark'],
          primary: '#1d4ed8',
          '.btn': {
            'background-color': '#1a1e23',
          },
          '.btn-primary': {
            'background-color': '#1d4ed8',
          },
        },
      },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]'],
};
