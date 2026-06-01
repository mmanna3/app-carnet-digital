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
import { Slot, Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router'
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
import {
  enGrupo,
  tieneSegmento,
} from '@/logica-compartida/utilidades/segmentos-ruta'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(rutas)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

// En modo E2E, suprimir la overlay de warnings de LogBox para que Maestro no haga clic en ella accidentalmente.
if (process.env.EXPO_PUBLIC_E2E_API_URL) {
  LogBox.ignoreAllLogs()
}

// Conectar useAuth con api para romper el ciclo de require
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

    const inAuthGroup = enGrupo(segments, '(auth)')
    const inSeleccionEquipo = tieneSegmento(segments, 'seleccion-de-equipo')
    const inSeleccionLiga = tieneSegmento(segments, 'seleccion-de-liga')
    const inHome = tieneSegmento(segments, 'home')
    const inFichajes = tieneSegmento(segments, 'fichajes')
    const inRegistroDelegado = tieneSegmento(segments, 'registro-delegado')
    const inTorneos = tieneSegmento(segments, 'torneos')
    const inTorneoDetalle = tieneSegmento(segments, 'torneo-detalle')
    const inZonaDetalle = tieneSegmento(segments, 'zona-detalle')

    if (esMultiliga && !ligaSeleccionadaId && !inSeleccionLiga) {
      router.replace('/seleccion-de-liga' as any)
      return
    }

    if (
      !isAuthenticated &&
      !inAuthGroup &&
      !inSeleccionLiga &&
      !inHome &&
      !inFichajes &&
      !inRegistroDelegado &&
      !inTorneos &&
      !inTorneoDetalle &&
      !inZonaDetalle
    ) {
      router.replace('/home' as any)
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/seleccion-de-equipo')
    } else if (isAuthenticated && !equipoSeleccionadoId && !inSeleccionEquipo) {
      router.replace('/seleccion-de-equipo')
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
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(rutas)" />
            </Stack>
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
