// tailwind.config.js
import animate from 'tw-animate-css';

/** @type {import('tailwindcss').Config} */
exports = {
  content: ['./index.html', './src/.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [animate],
};
