#!/usr/bin/env node
/**
 * Imprime la URL del servidor API configurada antes de arrancar Expo.
 * Se ejecuta con: LIGA_ID=edefi npm run start
 *
 * Variables que afectan la URL efectiva:
 * - EXPO_PUBLIC_E2E_API_URL: prioridad máxima (tests E2E)
 * - EXPO_PUBLIC_USE_PROD_API=true: usa liga.apiUrl en vez de la URL local
 * - Por defecto en dev: http://192.168.0.70:5072
 */

const { LIGAS, APPS_UNILIGAS, LIGAS_DE_APP_MULTILIGA } = require('../configs-por-liga/datos.js')

const LIGA_ID = process.env.LIGA_ID
const E2E_URL = process.env.EXPO_PUBLIC_E2E_API_URL || null
const USE_PROD_API = process.env.EXPO_PUBLIC_USE_PROD_API === 'true'
const LOCAL_DEV_URL = 'http://192.168.0.70:5072'

function getEffectiveUrl(ligaApiUrl) {
  if (E2E_URL) return E2E_URL
  if (USE_PROD_API) return ligaApiUrl || LOCAL_DEV_URL
  return LOCAL_DEV_URL
}

function main() {
  if (!LIGA_ID) {
    console.warn('⚠ LIGA_ID no definido. Ej: LIGA_ID=edefi npm run start')
    return
  }

  if (LIGA_ID === 'multiliga') {
    const ligas = LIGAS_DE_APP_MULTILIGA.map((id) => {
      const l = LIGAS[id]
      return l ? { id, apiUrl: l.apiUrl } : null
    }).filter(Boolean)
    console.log('\n📡 API URLs (MULTILIGA):')
    for (const { id, apiUrl } of ligas) {
      const efectiva = getEffectiveUrl(apiUrl)
      console.log(`   ${id}: ${efectiva}${efectiva !== apiUrl ? ` (liga.apiUrl: ${apiUrl})` : ''}`)
    }
  } else if (APPS_UNILIGAS.includes(LIGA_ID)) {
    const liga = LIGAS[LIGA_ID]
    const apiUrl = liga?.apiUrl || ''
    const efectiva = getEffectiveUrl(apiUrl)
    console.log(`\n📡 API URL: ${efectiva}`)
    if (efectiva !== apiUrl && apiUrl) {
      console.log(`   (liga.apiUrl: ${apiUrl})`)
    }
    if (E2E_URL) console.log('   [E2E]')
    else if (USE_PROD_API) console.log('   [Producción - EXPO_PUBLIC_USE_PROD_API]')
    else console.log('   [Dev local]')
  }

  console.log('')
}

main()
