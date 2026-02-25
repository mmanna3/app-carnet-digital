import React from 'react'
import { Feather } from '@expo/vector-icons'
import { Tabs, ErrorBoundary } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { MenuProvider } from 'react-native-popup-menu'
import HeaderMenu from '../components/header-menu'
import { useEquipoStore } from '../hooks/use-equipo-store'
import { useConfigLiga, getColorLiga600 } from '../config/liga'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function TabLayout() {
  const { equipoSeleccionadoNombre } = useEquipoStore()
  useConfigLiga() // suscripción para MULTILIGA al cambiar liga
  const colorLiga = getColorLiga600()

  return (
    <MenuProvider skipInstanceCheck>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorLiga,
          tabBarInactiveTintColor: '#6b7280', // gray-500
          tabBarLabelStyle: { fontSize: 12 },
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#111827',
          headerTitleStyle: {
            color: '#111827',
          },
          tabBarStyle: {
            height: 75,
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
            title: equipoSeleccionadoNombre || 'Mis Jugadores',
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
            title: equipoSeleccionadoNombre || 'Pendientes',
            tabBarLabel: 'Pendientes',
            tabBarIcon: ({ color }) => <Feather name="clock" size={22} color={color} />,
          }}
        />
      </Tabs>
    </MenuProvider>
  )
}
