/**
 * Color base de Tailwind y hex para splash/adaptive icon.
 * Usa bg-liga-700 (shade 700 del color base).
 * UNILIGA: color de la liga. MULTILIGA: color de la primera liga.
 */
const colors = require('tailwindcss/colors')
const { LIGAS, APPS_UNILIGAS, LIGAS_DE_APP_MULTILIGA } = require('./datos.js')

const A_TAILWIND = { verde: 'green', negro: 'gray', azul: 'blue', rojo: 'red' }
/** Hex para splash = liga-700 (igual que bg-liga-700) */
const SPLASH_HEX_700 = {
  verde: colors.green[700],
  negro: colors.gray[700],
  azul: colors.blue[700],
  rojo: colors.red[700],
}

const leagueId = process.env.LIGA_ID
if (!leagueId) {
  throw new Error('LIGA_ID es obligatorio. Ej: LIGA_ID=edefi o LIGA_ID=multiliga')
}

let colorBase
let splashHex
if (leagueId === 'multiliga') {
  const primeraLiga = LIGAS_DE_APP_MULTILIGA[0]
  if (!primeraLiga) throw new Error('LIGAS_DE_APP_MULTILIGA está vacío')
  colorBase = LIGAS[primeraLiga]?.colorBase
  splashHex = SPLASH_HEX_700[colorBase]
} else {
  if (!APPS_UNILIGAS.includes(leagueId)) {
    throw new Error(
      `Liga "${leagueId}" no está en APPS_UNILIGAS. Opciones: ${APPS_UNILIGAS.join(', ')}. Para MULTILIGA use LIGA_ID=multiliga`
    )
  }
  colorBase = LIGAS[leagueId]?.colorBase
  splashHex = SPLASH_HEX_700[colorBase]
}

if (!colorBase || !A_TAILWIND[colorBase]) {
  throw new Error(`Color base inválido para "${leagueId}"`)
}

module.exports = {
  tailwind: A_TAILWIND[colorBase],
  splashHex,
}
