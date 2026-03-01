import { useRouter, usePathname, useSegments, Stack } from 'expo-router'
import { View, Text } from 'react-native'
import Boton from '@/components/boton'

/**
 * Pantalla que Expo Router muestra cuando la ruta no existe (deep link inválido,
 * URL obsoleta, estado corrupto). Mostramos un mensaje amigable con info para
 * reportar y un botón para volver al home.
 */
export default function NotFoundScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const segments = useSegments()

  const codigoError =
    pathname && pathname !== '/' ? pathname : segments?.length ? segments.join('/') : 'ruta-desconocida'

  const irAlHome = () => {
    router.replace('/home' as any)
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Error', headerShown: false }} />
      <View className="flex-1 bg-gray-50 px-6 pt-14">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">Error</Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-2">
            Estamos trabajando para solucionarlo. Avisale a la administración de la liga con este
            código:
          </Text>
          <Text
            className="text-base font-mono text-gray-800 bg-gray-200 px-3 py-2 rounded-lg text-center mb-6"
            selectable
          >
            {codigoError}
          </Text>
          <Boton texto="Ir al home de la app" onPress={irAlHome} />
        </View>
      </View>
    </>
  )
}
