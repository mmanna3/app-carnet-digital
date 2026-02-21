/**
 * Fuente única de datos de ligas.
 *
 * APPS_UNILIGAS: ligas que tienen su propia app en el store (un ícono por liga).
 * LIGAS_DE_APP_MULTILIGA: ligas disponibles en la app "Carnet Digital" (un solo ícono).
 *
 * @typedef {import('./tipos').LigaEnAppMultiliga} LigaEnAppMultiliga
 * @typedef {import('./tipos').LigaConAppPropia} LigaConAppPropia
 */

/** @type {LigaEnAppMultiliga} */
const configLuefi = {
  leagueId: 'luefi',
  leagueDisplayName: 'LUEFI',
  apiUrl: 'https://luefi.liga.com.ar',
  colorBase: 'negro',
}

/** @type {LigaConAppPropia} */
const configEdefi = {
  leagueId: 'edefi',
  leagueDisplayName: 'EDeFI',
  appName: 'EDeFI - Encuentro Deportivo De Fútbol Infantil',
  /** Nombre corto para splash/pantalla de inicio (evita que se corte) */
  splashScreenName: 'EDeFI',
  appId: 'com.blueservant.edefi',
  expoSlug: 'edefi',
  easProjectId: 'TODO',
  scheme: 'carnet-edefi',
  icon: './assets/ligas/edefi/icon.png',
  splashImage: './assets/ligas/edefi/icon.png',
  adaptiveIconForeground: './assets/ligas/edefi/icon.png',
  favicon: './assets/ligas/edefi/favicon.png',
  apiUrl: 'https://admin.edefi.com.ar',
  colorBase: 'verde',
  ios: { supportsTablet: true, infoPlist: { ITSAppUsesNonExemptEncryption: false } },
}

/** Config de cada liga (por leagueId). Luefi: LigaEnAppMultiliga. Edefi: LigaConAppPropia. */
const LIGAS = {
  luefi: configLuefi,
  edefi: configEdefi,
}

/** Ligas que tienen su propia app compilada (un ícono por liga en el store) */
const APPS_UNILIGAS = ['edefi']

/** Ligas disponibles en la app MULTILIGA (un solo ícono "Carnet Digital" en el store) */
const LIGAS_DE_APP_MULTILIGA = ['luefi']

/** Config de la app MULTILIGA (shell; no es una liga) */
const CONFIG_APP_MULTILIGA = {
  appName: 'Ligas y Torneos',
  appId: 'com.blueservant.ligasytorneos',
  expoSlug: 'ligas-y-torneos',
  easProjectId: 'TODO',
  scheme: 'ligas-y-torneos',
  icon: './assets/ligas/multiliga/icon.png',
  splashImage: './assets/ligas/multiliga/icon.png',
  adaptiveIconForeground: './assets/ligas/multiliga/icon.png',
  favicon: './assets/ligas/multiliga/favicon.png',
}

module.exports = {
  LIGAS,
  APPS_UNILIGAS,
  LIGAS_DE_APP_MULTILIGA,
  CONFIG_APP_MULTILIGA,
}
