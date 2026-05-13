import { useLayoutEffect } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { useAuth } from '@/lib/hooks/use-auth'

// Si el delegado está logueado, "Ir al inicio" lleva al home del delegado (mis jugadores),
// no al home general de la app.
function rutaDeHome(isAuthenticated: boolean): string {
  return isAuthenticated ? '/(tabs)/mis-jugadores' : '/home'
}

function WebHeader({ titulo, backgroundColor }: { titulo: string; backgroundColor: string }) {
  const router = useRouter()
  const navigation = useNavigation()
  const canGoBack = navigation.canGoBack()
  const isAuthenticated = useAuth((s) => s.isAuthenticated)

  return (
    <View style={{ backgroundColor }}>
      <View
        style={{
          maxWidth: 1280,
          marginHorizontal: 'auto',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: 56,
        }}
      >
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ marginRight: 8 }}
          >
            <Entypo name="chevron-left" size={28} color="#ffffff" />
          </TouchableOpacity>
        ) : null}
        <Text style={{ flex: 1, color: '#ffffff', fontWeight: '600', fontSize: 17 }}>{titulo}</Text>
        <TouchableOpacity
          onPress={() => router.replace(rutaDeHome(isAuthenticated) as any)}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Entypo name="home" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function useHeaderConHome({
  titulo,
  backgroundColor,
}: {
  titulo: string
  backgroundColor: string
}) {
  const router = useRouter()
  const navigation = useNavigation()
  const isAuthenticated = useAuth((s) => s.isAuthenticated)

  useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      navigation.setOptions({
        headerShown: true,
        header: () => <WebHeader titulo={titulo} backgroundColor={backgroundColor} />,
      })
    } else {
      navigation.setOptions({
        headerShown: true,
        title: titulo,
        headerStyle: { backgroundColor },
        headerTintColor: '#ffffff',
        headerTitleStyle: { color: '#ffffff', fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerBackTitle: '',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.replace(rutaDeHome(isAuthenticated) as any)}
            accessibilityRole="button"
            accessibilityLabel="Ir al inicio"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Entypo name="home" size={24} color="#ffffff" />
          </TouchableOpacity>
        ),
      })
    }
  }, [navigation, router, titulo, backgroundColor, isAuthenticated])
}
