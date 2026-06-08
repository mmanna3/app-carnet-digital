import React from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons'
import { useAuth } from '@/lib/hooks/use-auth'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { TOKENS } from '@/lib/design-system'
import { RUTAS, type RutaApp } from '@/logica-compartida/constantes/rutas'

const ALTURA_BARRA = 56
/** Mismo ancho izquierda/derecha para que el título quede centrado en la barra (como header nativo iOS). */
const ANCHO_LATERAL = 40

function rutaDeHome(isAuthenticated: boolean): RutaApp {
  return isAuthenticated ? RUTAS.MIS_JUGADORES : RUTAS.HOME
}

function BotonIrInicio({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Ir al inicio"
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Entypo name="home" size={24} color="#e4e4e7" />
    </TouchableOpacity>
  )
}

/** Cabecera del flujo torneos: evita botones nativos de iOS 26 (círculo liquid glass descentrado). */
function CabeceraTorneos({ titulo }: { titulo: string }) {
  const router = useRouter()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const canGoBack = navigation.canGoBack()
  const isAuthenticated = useAuth((s) => s.isAuthenticated)
  const paddingTop = Platform.OS === 'web' ? 0 : insets.top

  return (
    <View
      style={{
        paddingTop,
        backgroundColor: TOKENS.surface,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <View
        style={{
          maxWidth: 1280,
          marginHorizontal: 'auto',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: ALTURA_BARRA,
        }}
      >
        <View style={{ width: ANCHO_LATERAL, alignItems: 'flex-start', justifyContent: 'center' }}>
          {canGoBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Entypo name="chevron-left" size={28} color="#e4e4e7" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text
          pointerEvents="none"
          numberOfLines={1}
          style={{
            flex: 1,
            textAlign: 'center',
            color: '#f4f4f5',
            fontFamily: FUENTE_DISPLAY,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {titulo}
        </Text>
        <View style={{ width: ANCHO_LATERAL, alignItems: 'flex-end', justifyContent: 'center' }}>
          <BotonIrInicio onPress={() => router.replace(rutaDeHome(isAuthenticated))} />
        </View>
      </View>
    </View>
  )
}

export function useHeaderConHome({
  titulo,
  backgroundColor: _backgroundColor,
}: {
  titulo: string
  backgroundColor?: string
}) {
  const navigation = useNavigation()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      header: () => <CabeceraTorneos titulo={titulo} />,
    })
  }, [navigation, titulo])
}
