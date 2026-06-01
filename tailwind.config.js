/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const { tailwind: colorBase } = require('./configs-por-liga/color-base.js')

const ligaColors = colors[colorBase]

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        liga: ligaColors,
        verde: colors.green,
        rojo: colors.red,
        azul: colors.blue,
        surface: {
          DEFAULT: '#0a0a0b',
          elevated: '#121214',
        },
        'border-glass': 'rgba(255, 255, 255, 0.08)',
        'accent-hot': '#22c55e',
        'accent-cool': '#00d4ff',
      },
      fontFamily: {
        display: ['Coalition'],
        brand: ['D3Euronism'],
        sans: ['Inter'],
      },
    },
  },
  plugins: [],
}
