import React from 'react'
import { Platform, Text, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useRouter, usePathname } from 'expo-router'
import Constants from 'expo-constants'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { useAuth } from '../hooks/use-auth'
import { useEquipoStore } from '../hooks/use-equipo-store'
import { useLigaStore } from '../hooks/use-liga-store'
import { useSeleccionJugadores } from '../hooks/use-seleccion-jugadores'
import { useFichajeStore } from '../hooks/use-fichaje-store'

export default function HeaderMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const { modoSeleccion, activar, desactivar } = useSeleccionJugadores()
  const { resetear } = useFichajeStore()

  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true

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

  return (
    <View className="mr-2.5">
      <Menu>
        <MenuTrigger>
          <View className="p-2">
            <Entypo name="dots-three-vertical" size={24} color="#333" />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption onSelect={handleSeleccionarJugadores}>
            <Text className="text-base text-[#333] p-2.5">
              {modoSeleccion ? 'Salir de selección' : 'Seleccionar jugadores'}
            </Text>
          </MenuOption>
          {esMultiliga && (
            <MenuOption onSelect={handleCambiarLiga}>
              <Text className="text-base text-[#333] p-2.5">Cambiar liga</Text>
            </MenuOption>
          )}
          <MenuOption onSelect={() => router.push('/fichaje-delegado' as any)}>
            <Text className="text-base text-[#333] p-2.5">Fichar en este equipo</Text>
          </MenuOption>
          <MenuOption onSelect={handleCambiarEquipo}>
            <Text className="text-base text-[#333] p-2.5">Cambiar equipo</Text>
          </MenuOption>
          <MenuOption onSelect={handleCerrarSesion}>
            <Text className="text-base text-[#333] p-2.5">Cerrar sesión</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  )
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    width: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
}
