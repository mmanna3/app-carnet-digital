import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs, ErrorBoundary } from 'expo-router'
import { Pressable } from 'react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { MenuProvider } from 'react-native-popup-menu'
import HeaderMenu from '../components/header-menu'

import Colors from '@/constants/Colores'
import { useClientOnlyValue } from '@/components/useClientOnlyValue'
import { useEquipoStore } from '../hooks/use-equipo-store'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function TabLayout() {
  const { equipoSeleccionadoNombre } = useEquipoStore()

  return (
    <MenuProvider skipInstanceCheck>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#cccccc',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            color: '#ffffff',
          },
          tabBarStyle: {
            height: 54,
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333333',
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
            tabBarIcon: ({ color }) => <FontAwesome name="users" size={18} color={color} />,
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <FontAwesome name="search" size={18} color={color} />,
          }}
        />
        <Tabs.Screen
          name="pendientes"
          options={{
            title: equipoSeleccionadoNombre || 'Pendientes',
            tabBarLabel: 'Pendientes',
            tabBarIcon: ({ color }) => <FontAwesome name="clock-o" size={18} color={color} />,
          }}
        />
      </Tabs>
    </MenuProvider>
  )
}
