import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import Boton from '@/components/boton'
import { useEquipoStore } from './hooks/use-equipo-store'
import { useLigaStore } from './hooks/use-liga-store'
import { useAuth } from './hooks/use-auth'

export default function HomeScreen() {
  const router = useRouter()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true

  const handleDelegadosDT = () => {
    router.push('/(auth)/login')
  }

  const handleFichajes = () => {
    router.push('/fichajes')
  }

  const handleSeleccionarOtraLiga = () => {
    logout()
    limpiarEquipoSeleccionado()
    limpiarLiga()
    router.replace('/seleccion-de-liga' as any)
  }

  return (
    <View className="flex-1 bg-[#f8f8f8] justify-center px-8">
      <Text className="text-2xl font-bold text-center mb-8">Carnet digital</Text>

      <Boton texto="Delegados/DT" onPress={handleDelegadosDT} />
      <Boton texto="Fichajes" onPress={handleFichajes} />

      {esMultiliga && (
        <TouchableOpacity
          onPress={handleSeleccionarOtraLiga}
          className="mt-12 py-2 items-center"
        >
          <Text className="text-[11px] text-gray-500">Seleccionar otra liga</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
