import '../global.css'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import Constants from 'expo-constants'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import { useAuth } from '@/lib/hooks/use-auth'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { api } from '@/lib/api/api'
import { LoginDTO } from '@/lib/api/clients'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MenuProvider } from 'react-native-popup-menu'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HeaderMenu from './components/header-menu'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: 'home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

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

    const inAuthGroup = segments[0] === '(auth)'
    const inSeleccionEquipo = segments[0] === 'seleccion-de-equipo'
    const inSeleccionLiga = (segments[0] as string) === 'seleccion-de-liga'
    const inHome = (segments[0] as string) === 'home'
    const inFichajes = (segments[0] as string) === 'fichajes'
    const inRegistroDelegado = (segments[0] as string) === 'registro-delegado'
    if (esMultiliga && !ligaSeleccionadaId && !inSeleccionLiga) {
      router.replace('/seleccion-de-liga' as any)
      return
    }

    // No autenticado: Home (UNILIGA o MULTILIGA con liga elegida), (auth), seleccion-de-liga, fichajes o registro-delegado
    if (
      !isAuthenticated &&
      !inAuthGroup &&
      !inSeleccionLiga &&
      !inHome &&
      !inFichajes &&
      !inRegistroDelegado
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
    // Slot es un navegador válido; evita el error de "navigate before mounting"
    return <Slot />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <MenuProvider skipInstanceCheck>
            <Stack>
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen name="fichajes" options={{ headerShown: false }} />
              <Stack.Screen name="registro-delegado" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  title: 'Inicio', // Usado por el botón atrás al volver desde fichaje-delegado (evita "(tabs)")
                }}
              />
              <Stack.Screen
                name="fichaje-delegado"
                options={{
                  title: 'Fichar jugador',
                  headerBackButtonDisplayMode: 'minimal', // Solo flecha, sin texto (RN 7+)
                  headerStyle: { backgroundColor: '#ffffff' },
                  headerTintColor: '#111827',
                  headerTitleStyle: { color: '#111827' },
                  headerRight: () => <HeaderMenu />,
                }}
              />
              <Stack.Screen
                name="seleccion-de-liga"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="seleccion-de-equipo"
                options={{
                  headerShown: false,
                  presentation: 'modal',
                  gestureEnabled: false,
                }}
              />
            </Stack>
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
