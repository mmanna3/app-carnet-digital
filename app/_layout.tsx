import '../global.css'
import { LogBox } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter'
import { Stack, useSegments, useRouter, useRootNavigationState, Slot } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import Constants from 'expo-constants'
import 'react-native-reanimated'

import { useColorScheme } from '@/logica-compartida/hooks/use-color-scheme'
import { useAuth } from '@/lib/hooks/use-auth'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { api } from '@/lib/api/api'
import { LoginDTO } from '@/lib/api/clients'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MenuProvider } from 'react-native-popup-menu'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { tieneSegmento } from '@/logica-compartida/utilidades/segmentos-ruta'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export {
  ErrorBoundary,
} from 'expo-router'

SplashScreen.preventAutoHideAsync()

if (process.env.EXPO_PUBLIC_E2E_API_URL) {
  LogBox.ignoreAllLogs()
} else if (__DEV__) {
  LogBox.ignoreLogs(['[Reanimated] Reduced motion setting is enabled on this device.'])
}

useAuth
  .getState()
  ._setLoginImpl(async (usuario, password) => api.login(new LoginDTO({ usuario, password })))

function useProtectedRoute(loaded: boolean) {
  const segments = useSegments()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { equipoSeleccionadoId } = useEquipoStore()
  const ligaSeleccionadaId = useLigaStore((s) => s.ligaSeleccionadaId)
  const navigationState = useRootNavigationState()

  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true

  useEffect(() => {
    if (!navigationState?.key) return
    if (!loaded) return

    const inAuth = tieneSegmento(segments, 'login') || tieneSegmento(segments, 'cambiar-password')
    const inSeleccionEquipo = tieneSegmento(segments, 'seleccion-de-equipo')
    const inSeleccionLiga = tieneSegmento(segments, 'seleccion-de-liga')
    const inHome = tieneSegmento(segments, 'home')
    const inFichajes = tieneSegmento(segments, 'fichajes')
    const inRegistroDelegado = tieneSegmento(segments, 'registro-delegado')
    const inTorneos = tieneSegmento(segments, 'torneos')
    const inTorneoDetalle = tieneSegmento(segments, 'torneo-detalle')
    const inZonaDetalle = tieneSegmento(segments, 'zona-detalle')

    if (esMultiliga && !ligaSeleccionadaId && !inSeleccionLiga) {
      router.replace(RUTAS.SELECCION_LIGA)
      return
    }

    if (
      !isAuthenticated &&
      !inAuth &&
      !inSeleccionLiga &&
      !inHome &&
      !inFichajes &&
      !inRegistroDelegado &&
      !inTorneos &&
      !inTorneoDetalle &&
      !inZonaDetalle
    ) {
      router.replace(RUTAS.HOME)
    } else if (isAuthenticated && inAuth) {
      router.replace(RUTAS.SELECCION_EQUIPO)
    } else if (isAuthenticated && !equipoSeleccionadoId && !inSeleccionEquipo) {
      router.replace(RUTAS.SELECCION_EQUIPO)
    }
  }, [
    esMultiliga,
    ligaSeleccionadaId,
    isAuthenticated,
    segments,
    equipoSeleccionadoId,
    navigationState?.key,
    loaded,
    router,
  ])
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function RootStack() {
  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Coalition: require('../assets/fonts/Coalition.ttf'),
    D3Euronism: require('../assets/fonts/D3Euronism.ttf'),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  })
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useProtectedRoute(loaded)

  if (!loaded) {
    return (
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <MenuProvider skipInstanceCheck>
            <RootStack />
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
