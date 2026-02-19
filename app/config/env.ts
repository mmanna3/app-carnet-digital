import Constants from 'expo-constants'

type Environment = 'development' | 'production'

const ENV = {
  development: {
    apiUrl: 'http://0.0.0.0:5072',
    // apiUrl: 'https://luefi.liga.com.ar',
    // apiUrl: 'http://192.168.0.198:5072', // para usarla desde el celu
  },
  production: {
    apiUrl: 'https://luefi.liga.com.ar',
  },
}

const getEnvironment = (): Environment => {
  // Si estamos en desarrollo (usando expo start)
  if (__DEV__) {
    return 'development'
  }

  // Si estamos en producción (build de la app)
  return 'production'
}

export const getEnvVars = () => {
  const environment = getEnvironment()
  return ENV[environment]
}

export default getEnvVars
