import '../global.css'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import { useAuth } from './hooks/use-auth'
import { useEquipoStore } from './hooks/use-equipo-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

function useProtectedRoute(loaded: boolean) {
  const segments = useSegments()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { equipoSeleccionadoId } = useEquipoStore()
  const navigationState = useRootNavigationState()

  useEffect(() => {
    if (!navigationState?.key) return
    if (!loaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const inSeleccionEquipo = segments[0] === 'seleccion-de-equipo'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/seleccion-de-equipo')
    } else if (isAuthenticated && !equipoSeleccionadoId && !inSeleccionEquipo) {
      router.replace('/seleccion-de-equipo')
    }
  }, [isAuthenticated, segments, equipoSeleccionadoId, navigationState?.key, loaded])
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
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="seleccion-de-equipo"
            options={{
              headerShown: false,
              presentation: 'modal',
              gestureEnabled: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
