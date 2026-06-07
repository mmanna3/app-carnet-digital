import React from 'react'
import { View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Tabs, ErrorBoundary } from 'expo-router'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import * as SplashScreen from 'expo-splash-screen'
import { MenuProvider } from 'react-native-popup-menu'
import HeaderMenu from '@/delegados/_components/header-menu'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useAcentoEquipoSeleccionado } from '@/lib/hooks/use-acento-equipo-seleccionado'
import { useConfigLiga } from '@/lib/config/liga'
import { Texto } from '@/design-system/componentes/texto'
import { BarraTabsInferior, TAB_ICON_SIZE } from '@/design-system/componentes/barra-tabs-inferior'

export { ErrorBoundary }

SplashScreen.preventAutoHideAsync()

function TabBarDelegados(props: BottomTabBarProps) {
  const { hexAcento } = useAcentoEquipoSeleccionado()

  return (
    <BarraTabsInferior
      hexAcento={hexAcento}
      indiceActivo={props.state.index}
      tabs={props.state.routes.map((route, index) => {
        const { options } = props.descriptors[route.key]
        const focused = index === props.state.index
        const titulo =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name)

        return {
          key: route.key,
          titulo,
          renderIcono: (color) =>
            options.tabBarIcon?.({ focused, color, size: TAB_ICON_SIZE }) ?? null,
          onPress: () => {
            const event = props.navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!event.defaultPrevented) {
              props.navigation.navigate(route.name, route.params)
            }
          },
          testID: options.tabBarButtonTestID,
        }
      })}
    />
  )
}

export default function TabLayout() {
  const { equipoSeleccionadoNombre, equipoSeleccionadoCodigo } = useEquipoStore()
  useConfigLiga()

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
        tabBar={(props) => <TabBarDelegados {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a0b', height: 110 },
          headerTitleContainerStyle: { paddingVertical: 8 },
          headerTintColor: '#e4e4e7',
          headerTitleStyle: { color: '#e4e4e7' },
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
            tabBarIcon: ({ color }) => <Feather name="users" size={TAB_ICON_SIZE} color={color} />,
            tabBarButtonTestID: 'tab-mis-jugadores',
          }}
        />
        <Tabs.Screen
          name="buscar"
          options={{
            title: 'Buscar',
            headerTitle: () => <Texto variante="titulo">Buscar</Texto>,
            tabBarLabel: 'Buscar',
            tabBarIcon: ({ color }) => <Feather name="search" size={TAB_ICON_SIZE} color={color} />,
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
            tabBarIcon: ({ color }) => <Feather name="clock" size={TAB_ICON_SIZE} color={color} />,
            tabBarButtonTestID: 'tab-pendientes',
          }}
        />
      </Tabs>
    </MenuProvider>
  )
}
