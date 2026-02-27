import React from 'react'
import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Tabs, ErrorBoundary } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { MenuProvider } from 'react-native-popup-menu'
import HeaderMenu from '../components/header-menu'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useConfigLiga, getColorLiga600 } from '@/lib/config/liga'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function TabLayout() {
  const { equipoSeleccionadoNombre, equipoSeleccionadoCodigo } = useEquipoStore()
  useConfigLiga() // suscripción para MULTILIGA al cambiar liga
  const colorLiga = getColorLiga600()

  const HeaderTituloConCodigo = ({ titulo }: { titulo: string }) => (
    <View style={{ paddingBottom: 10 }}>
      <Text style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>{titulo}</Text>
      <Text style={{ fontSize: 12, marginTop: 5, color: '#6b7280' }}>
        Código: {equipoSeleccionadoCodigo ?? '-'}
      </Text>
    </View>
  )

  return (
    <MenuProvider skipInstanceCheck>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorLiga,
          tabBarInactiveTintColor: '#6b7280', // gray-500
          tabBarLabelStyle: { fontSize: 12 },
          headerStyle: { backgroundColor: '#ffffff', height: 110 },
          headerTitleContainerStyle: { paddingVertical: 8 },
          headerTintColor: '#111827',
          headerTitleStyle: {
            color: '#111827',
          },
          tabBarStyle: {
            height: 78,
            paddingTop: 5,
            backgroundColor: '#ffffff',
            borderTopColor: '#e5e7eb', // gray-200
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          headerShown: useClientOnlyValue(false, true),
          headerRight: () => <HeaderMenu />,
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
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <Feather name="search" size={22} color={color} />,
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
          }}
        />
      </Tabs>
    </MenuProvider>
  )
}
