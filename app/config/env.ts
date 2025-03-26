import Constants from 'expo-constants';

type Environment = 'development' | 'production';

const ENV = {
  development: {
    apiUrl: 'http://192.168.0.193:5072',
  },
  production: {
    apiUrl: 'https://luefi.liga.com.ar',
  },
};

const getEnvironment = (): Environment => {
  // Si estamos en desarrollo (usando expo start)
  if (__DEV__) {
    return 'development';
  }
  
  // Si estamos en producción (build de la app)
  return 'production';
};

export const getEnvVars = () => {
  const environment = getEnvironment();
  return ENV[environment];
};

export default getEnvVars; 