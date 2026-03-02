import type { ExpoConfig } from 'expo/config'

const {
  LIGAS,
  APPS_UNILIGAS,
  LIGAS_DE_APP_MULTILIGA,
  CONFIG_APP_MULTILIGA,
} = require('./configs-por-liga/datos.js')
const { splashHex } = require('./configs-por-liga/color-base.js')

const leagueId = process.env.LIGA_ID
if (!leagueId) {
  throw new Error(
    `LIGA_ID es obligatorio. Ej: LIGA_ID=edefi (UNILIGA) o LIGA_ID=multiliga (MULTILIGA)`
  )
}

const esMultiliga = leagueId === 'multiliga'

let config: {
  appName: string
  splashScreenName?: string
  appId: string
  expoSlug: string
  easProjectId: string
  scheme: string
  icon: string
  splashImage: string
  adaptiveIconForeground: string
  favicon: string
  leagueId?: string
  leagueDisplayName?: string
  apiUrl?: string
  colorBase?: string
}

if (esMultiliga) {
  config = {
    ...CONFIG_APP_MULTILIGA,
  }
} else {
  if (!APPS_UNILIGAS.includes(leagueId)) {
    throw new Error(
      `"${leagueId}" no está en APPS_UNILIGAS. Opciones: ${APPS_UNILIGAS.join(', ')}. Para MULTILIGA use LIGA_ID=multiliga`
    )
  }
  const liga = LIGAS[leagueId]
  config = {
    ...liga,
  }
}

const ligasDisponibles = esMultiliga
  ? LIGAS_DE_APP_MULTILIGA.map((id: string) => {
      const l = LIGAS[id]
      return l
        ? {
            leagueId: l.leagueId,
            leagueDisplayName: l.leagueDisplayName,
            apiUrl: l.apiUrl,
            colorBase: l.colorBase,
          }
        : null
    }).filter(Boolean)
  : undefined

export default (): ExpoConfig => ({
  name: config.splashScreenName ?? config.appName,
  slug: config.expoSlug,
  version: '4.0.1',
  orientation: 'portrait',
  icon: config.icon,
  scheme: config.scheme,
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  backgroundColor: splashHex,
  splash: {
    image: config.splashImage,
    resizeMode: 'contain',
    backgroundColor: splashHex,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: config.appId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleDevelopmentRegion: 'es',
    },
  },
  android: {
    backgroundColor: splashHex,
    adaptiveIcon: {
      foregroundImage: config.adaptiveIconForeground,
      backgroundColor: splashHex,
    },
    package: config.appId,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: config.favicon,
  },
  plugins: [
    'expo-router',
    'expo-system-ui',
    [
      'expo-splash-screen',
      {
        image: config.splashImage,
        backgroundColor: splashHex,
        imageWidth: 200,
      },
    ],
    [
      'expo-build-properties',
      {
        android: { usesCleartextTraffic: true },
      },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: {
    router: { origin: false },
    eas: { projectId: config.easProjectId },
    esMultiliga,
    leagueId: config.leagueId,
    leagueDisplayName: config.leagueDisplayName,
    apiUrl: config.apiUrl,
    colorBase: config.colorBase,
    ligasDisponibles,
  },
  owner: 'mmanna',
})
