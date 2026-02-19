/** @type {import('tailwindcss').Config} */

// Cuando se implemente multi-liga, LEAGUE_ID seleccionará los colores del archivo de configuración
// correspondiente en league-configs/. Por ahora los colores de LUEFI son los defaults.
const leagueColors = {
  primary: '#01aa59',
  'primary-dark': '#007a3f',
  secondary: '#0038ba',
  accent: '#3ea334',
}

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: leagueColors,
    },
  },
  plugins: [],
}
