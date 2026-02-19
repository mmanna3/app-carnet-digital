import React from 'react'
import { StyleSheet, Platform, Text, View } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { useAuth } from '../hooks/use-auth'

export default function HeaderMenu() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleCambiarEquipo = () => {
    router.push('/seleccion-de-equipo')
  }

  const handleCerrarSesion = () => {
    logout()
    router.replace('/(auth)/login')
  }

  return (
    <View style={styles.container}>
      <Menu>
        <MenuTrigger>
          <View style={styles.menuButton}>
            <Entypo name="dots-three-vertical" size={24} color="#333" />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption onSelect={handleCambiarEquipo}>
            <Text style={styles.optionText}>Cambiar equipo</Text>
          </MenuOption>
          <MenuOption onSelect={handleCerrarSesion}>
            <Text style={styles.optionText}>Cerrar sesión</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  menuButton: {
    padding: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    padding: 10,
  },
})

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
