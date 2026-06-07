import React from 'react'
import { View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Tabs, ErrorBoundary } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { MenuProvider } from 'react-native-popup-menu'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HeaderMenu from '@/delegados/_components/header-menu'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAcentoEquipoSeleccionado } from '@/lib/hooks/use-acento-equipo-seleccionado'
import { useConfigLiga } from '@/lib/config/liga'
import { Texto } from '@/design-system/componentes/texto'

export { ErrorBoundary }

SplashScreen.preventAutoHideAsync()

const TAB_BAR_BASE_HEIGHT = 72

export default function TabLayout() {
  const { equipoSeleccionadoNombre, equipoSeleccionadoCodigo } = useEquipoStore()
  useConfigLiga()
  const { hexAcento } = useAcentoEquipoSeleccionado()
  const insets = useSafeAreaInsets()
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom

  const HeaderTituloConCodigo = ({ titulo }: { titulo: string }) => (
    <View style={{ paddingBottom: 10 }}>
      <Texto variante="titulo" className="text-zinc-100">
        {titulo}
      </Texto>
      <Texto variante="caption" className="mt-1 text-zinc-500">
        Código: {equipoSeleccionadoCodigo ?? '-'}
      </Texto>
    </View>
  )

  return (
    <MenuProvider skipInstanceCheck>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: hexAcento,
          tabBarInactiveTintColor: '#e4e4e7',
          tabBarLabelStyle: { fontSize: 12, letterSpacing: 0.5, marginTop: 1 },
          headerStyle: { backgroundColor: '#0a0a0b', height: 110 },
          headerTitleContainerStyle: { paddingVertical: 8 },
          headerTintColor: '#e4e4e7',
          headerTitleStyle: { color: '#e4e4e7' },
          tabBarStyle: {
            height: tabBarHeight,
            paddingTop: 5,
            backgroundColor: '#141416',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShown: true,
          headerRight: () => <HeaderMenu />,
          headerRightContainerStyle: { paddingRight: 4 },
          headerLeftContainerStyle: { paddingRight: 4 },
        }}
      >
        <Tabs.Screen
          name="mis-jugadores"
          options={{
            headerTitle: () => (
              <HeaderTituloConCodigo titulo={equipoSeleccionadoNombre || 'Mis Jugadores'} />
            ),
            tabBarLabel: 'Mis Jugadores',
            tabBarIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
            tabBarButtonTestID: 'tab-mis-jugadores',
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: 'Buscar',
            headerTitle: () => <Texto variante="titulo">Buscar</Texto>,
            tabBarIcon: ({ color }) => <Feather name="search" size={22} color={color} />,
            tabBarButtonTestID: 'tab-buscar',
          }}
        />
        <Tabs.Screen
          name="pendientes"
          options={{
            headerTitle: () => (
              <HeaderTituloConCodigo titulo={equipoSeleccionadoNombre || 'Pendientes'} />
            ),
            tabBarLabel: 'Pendientes',
            tabBarIcon: ({ color }) => <Feather name="clock" size={22} color={color} />,
            tabBarButtonTestID: 'tab-pendientes',
          }}
        />
      </Tabs>
    </MenuProvider>
  )
}
