import { useLayoutEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation, useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'

export function useHeaderConHome({
  titulo,
  backgroundColor,
}: {
  titulo: string
  backgroundColor: string
}) {
  const router = useRouter()
  const navigation = useNavigation()

  useLayoutEffect(() => {
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
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Entypo name="home" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    })
  }, [navigation, router, titulo, backgroundColor])
}
