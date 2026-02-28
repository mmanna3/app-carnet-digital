import React from 'react'
import { Platform, Text, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import { useRouter, usePathname } from 'expo-router'
import Constants from 'expo-constants'
import { useQueryClient } from '@tanstack/react-query'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { useAuth } from '@/lib/hooks/use-auth'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useSeleccionJugadores } from '@/lib/hooks/use-seleccion-jugadores'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { queryKeys } from '@/lib/api/query-keys'

export default function HeaderMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { logout } = useAuth()
  const { equipoSeleccionadoId, limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const { modoSeleccion, activar, desactivar } = useSeleccionJugadores()
  const { resetear } = useFichajeStore()

  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true

  const handleActualizar = () => {
    if (equipoSeleccionadoId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.jugadores.pendientes(equipoSeleccionadoId) })
    }
  }

  const handleCambiarEquipo = () => {
    router.push('/seleccion-de-equipo')
  }

  const handleCambiarLiga = () => {
    logout()
    limpiarEquipoSeleccionado()
    limpiarLiga()
    router.replace('/seleccion-de-liga' as any)
  }

  const handleCerrarSesion = () => {
    logout()
    limpiarEquipoSeleccionado()
    resetear()
    router.replace('/(auth)/login')
  }

  const handleSeleccionarJugadores = () => {
    if (modoSeleccion) {
      desactivar()
    } else {
      if (pathname !== '/mis-jugadores') {
        router.push('/(tabs)/mis-jugadores')
        setTimeout(activar, 300)
      } else {
        activar()
      }
    }
  }

  const MenuItem = ({
    icon,
    label,
    onSelect,
    destructive,
    testID,
  }: {
    icon: React.ComponentProps<typeof Feather>['name']
    label: string
    onSelect: () => void
    destructive?: boolean
    testID?: string
  }) => (
    <MenuOption onSelect={onSelect}>
      <View testID={testID} className="flex-row items-center gap-3 px-6 py-3">
        <Feather
          name={icon}
          size={20}
          color={destructive ? '#dc2626' : '#111827'}
        />
        <Text
          className={`text-base ${destructive ? 'text-red-600' : 'text-[#111827]'} font-medium`}
        >
          {label}
        </Text>
      </View>
    </MenuOption>
  )

  return (
    <View className="mr-2.5">
      <Menu>
        <MenuTrigger>
          <View testID="boton-menu-principal" className="p-2">
            <Entypo name="dots-three-vertical" size={24} color="#111827" />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <MenuItem
            icon="refresh-cw"
            label="Actualizar"
            onSelect={handleActualizar}
          />
          <MenuItem
            icon={modoSeleccion ? 'check-square' : 'list'}
            label={modoSeleccion ? 'Salir de selección' : 'Seleccionar jugadores'}
            onSelect={handleSeleccionarJugadores}
          />
          {esMultiliga && (
            <MenuItem
              icon="globe"
              label="Cambiar liga"
              onSelect={handleCambiarLiga}
            />
          )}
          <MenuItem
            icon="user-plus"
            label="Fichar jugadores"
            testID="menu-item-fichar-jugadores"
            onSelect={() => router.push('/fichaje-delegado' as any)}
          />
          <View className="h-px bg-gray-200 my-2 mx-4" />
          <MenuItem
            icon="users"
            label="Cambiar equipo"
            onSelect={handleCambiarEquipo}
          />
          <MenuItem
            icon="log-out"
            label="Cerrar sesión"
            onSelect={handleCerrarSesion}
            destructive
          />
        </MenuOptions>
      </Menu>
    </View>
  )
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 12,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
}
