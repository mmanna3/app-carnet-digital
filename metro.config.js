const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
const configWithWind = withNativeWind(config, { input: './global.css' })

// Metro cachea los resultados de transformación de Babel, pero el cache key NO incluye
// los valores de variables EXPO_PUBLIC_*. Sin esto, si un build anterior (sin E2E_API_URL)
// ya cacheó liga.ts, el build de E2E reutiliza ese resultado con la URL de producción inlinada.
// Al incluir las EXPO_PUBLIC_* en cacheVersion, Metro invalida el cache cuando cambian.
const publicEnvVars = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith('EXPO_PUBLIC_'))
)
configWithWind.cacheVersion = `${configWithWind.cacheVersion ?? '1'}:${JSON.stringify(publicEnvVars)}`

module.exports = configWithWind
