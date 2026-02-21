/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const { tailwind: colorBase } = require('./configs-por-liga/color-base.js')

// "liga" es un alias del color base según LIGA_ID (UNILIGA) o primera liga (MULTILIGA).
// Usar clases como bg-liga-600, text-liga-500, border-liga-700, etc.
const ligaColors = colors[colorBase]

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        liga: ligaColors,
      },
    },
  },
  plugins: [],
}
