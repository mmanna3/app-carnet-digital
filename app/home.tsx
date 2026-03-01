import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import { Feather } from '@expo/vector-icons'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useLigaStore } from '@/lib/hooks/use-liga-store'
import { useAuth } from '@/lib/hooks/use-auth'
import { useConfigLiga } from '@/lib/config/liga'

/** Logos de ligas (require estático para Metro) */
const LOGOS_LIGAS: Record<string, number> = {
  edefi: require('@/assets/ligas/edefi/icon.png'),
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

export default function HomeScreen() {
  const router = useRouter()
  const { logout } = useAuth()
  const { limpiarEquipoSeleccionado } = useEquipoStore()
  const { limpiarLiga } = useLigaStore()
  const esMultiliga = Constants.expoConfig?.extra?.esMultiliga === true
  const configLiga = useConfigLiga()
  const [busqueda, setBusqueda] = useState('')

  const leagueId = configLiga?.leagueId ?? ''
  const leagueDisplayName = configLiga?.leagueDisplayName ?? ''
  const logo = leagueId ? LOGOS_LIGAS[leagueId] : undefined

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
    <View className="flex-1 bg-gray-50">
      {/* Cabecera */}
      <View className="bg-liga-600 pb-8 px-6 pt-14 overflow-hidden">
        {/* Círculos decorativos */}
        <View
          className="absolute rounded-full bg-white/10"
          style={{ top: -64, right: -64, width: 192, height: 192 }}
        />
        <View
          className="absolute rounded-full bg-white/10"
          style={{ bottom: -48, left: -48, width: 144, height: 144 }}
        />

        {/* Logo y nombre de la liga */}
        <View className="items-center mb-4 mt-4">
          {logo && (
            <Image
              source={logo}
              style={{ width: 96, height: 96 }}
              className="mb-4 drop-shadow-lg"
              resizeMode="contain"
            />
          )}
          <Text className="text-white font-medium text-4xl tracking-tight">
            {leagueDisplayName}
          </Text>
        </View>

        {/* Barra de búsqueda */}
        {/* <View className="flex-row items-center bg-white rounded-2xl shadow-lg overflow-hidden">
          <View className="pl-4">
            <Feather name="search" size={20} color="#9ca3af" />
          </View>
          <TextInput
            placeholder="Buscar equipo..."
            value={busqueda}
            onChangeText={setBusqueda}
            className="flex-1 py-3.5 px-3 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View> */}
      </View>

      {/* Tarjetas de acción */}
      <View className="px-6 pt-6 flex-row gap-3">
        {/* Fichaje */}
        <TouchableOpacity
          testID="card-fichaje"
          onPress={handleFichajes}
          className="flex-1 bg-blue-600 rounded-2xl p-4 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/20 rounded-xl p-2 mb-3 self-start">
            <Feather name="users" size={20} color="white" />
          </View>
          <Text className="text-white text-lg font-semibold mb-1">Fichaje</Text>
          <Text className="text-blue-100 text-sm leading-snug">Fichaje de nuevo jugador</Text>
        </TouchableOpacity>

        {/* Delegados/DT */}
        <TouchableOpacity
          testID="card-delegados"
          onPress={handleDelegadosDT}
          className="flex-1 bg-gray-800 rounded-2xl p-4 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/10 rounded-xl p-2 mb-3 self-start">
            <Feather name="clipboard" size={20} color="white" />
          </View>
          <Text className="text-white text-lg font-semibold mb-1">Delegados/DT</Text>
          <Text className="text-gray-300 text-sm leading-snug">Accedé a tu panel de gestión</Text>
        </TouchableOpacity>
      </View>

      {/* Seleccionar otra liga (solo multiliga) */}
      {esMultiliga && (
        <TouchableOpacity onPress={handleSeleccionarOtraLiga} className="mt-12 py-2 items-center">
          <Text className="text-sm text-gray-500">Seleccionar otra liga</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
