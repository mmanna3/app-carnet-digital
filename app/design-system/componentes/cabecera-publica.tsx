import React from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { useAuth } from '@/lib/hooks/use-auth'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { TOKENS } from '@/lib/design-system'
import { RUTAS, type RutaApp } from '@/logica-compartida/constantes/rutas'

function rutaDeHome(isAuthenticated: boolean): RutaApp {
  return isAuthenticated ? RUTAS.MIS_JUGADORES : RUTAS.HOME
}

export function CabeceraPublicaWeb({ titulo }: { titulo: string }) {
  const router = useRouter()
  const navigation = useNavigation()
  const canGoBack = navigation.canGoBack()
  const isAuthenticated = useAuth((s) => s.isAuthenticated)

  return (
    <View className="border-b border-white/5 bg-surface/90">
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
            <Entypo name="chevron-left" size={28} color="#e4e4e7" />
          </TouchableOpacity>
        ) : null}
        <Text
          style={{
            flex: 1,
            color: '#f4f4f5',
            fontFamily: FUENTE_DISPLAY,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {titulo}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace(rutaDeHome(isAuthenticated))}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Entypo name="home" size={24} color="#e4e4e7" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export function useCabeceraPublica({ titulo }: { titulo: string }) {
  const router = useRouter()
  const navigation = useNavigation()
  const isAuthenticated = useAuth((s) => s.isAuthenticated)

  React.useLayoutEffect(() => {
    if (Platform.OS === 'web') {
      navigation.setOptions({
        headerShown: true,
        header: () => <CabeceraPublicaWeb titulo={titulo} />,
      })
    } else {
      navigation.setOptions({
        headerShown: true,
        title: titulo,
        headerStyle: { backgroundColor: TOKENS.surface },
        headerTintColor: '#e4e4e7',
        headerTitleStyle: {
          color: '#f4f4f5',
          fontFamily: FUENTE_DISPLAY,
          fontSize: 17,
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        headerBackTitle: '',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.replace(rutaDeHome(isAuthenticated))}
            accessibilityRole="button"
            accessibilityLabel="Ir al inicio"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Entypo name="home" size={24} color="#e4e4e7" />
          </TouchableOpacity>
        ),
      })
    }
  }, [navigation, router, titulo, isAuthenticated])
}
