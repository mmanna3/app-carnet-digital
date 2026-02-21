import React from 'react'
import { Platform, Text, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { useAuth } from '../hooks/use-auth'
import { useEquipoStore } from '../hooks/use-equipo-store'
import { useLigaStore } from '../hooks/use-liga-store'

export default function HeaderMenu() {
  const router = useRouter()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()

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
    router.replace('/(auth)/login')
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
          {esMultiliga && (
            <MenuOption onSelect={handleCambiarLiga}>
              <Text className="text-base text-[#333] p-2.5">Cambiar liga</Text>
            </MenuOption>
          )}
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
