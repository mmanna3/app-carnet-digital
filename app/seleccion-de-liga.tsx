import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import Constants from 'expo-constants'
import { useLigaStore } from '@/lib/hooks/use-liga-store'

interface LigaDisponible {
  leagueId: string
  leagueDisplayName: string
  apiUrl: string
  colorBase: string
}

/** Íconos de ligas para la pantalla de selección (require estático para Metro) */
const ICONOS_LIGAS: Record<string, ReturnType<typeof require>> = {
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

export default function SeleccionDeLigaScreen() {
  const extra = Constants.expoConfig?.extra
  const ligasDisponibles: LigaDisponible[] = extra?.ligasDisponibles ?? []
  const { seleccionarLiga } = useLigaStore()

  const handleSelect = (liga: LigaDisponible) => {
    seleccionarLiga(liga.leagueId)
    router.replace('/home' as any)
  }

  if (ligasDisponibles.length === 0) {
    return (
      <View className="flex-1 bg-[#f8f8f8] p-5 justify-center">
        <Text className="text-xl text-center text-gray-600">No hay ligas configuradas</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#f8f8f8] p-5">
      <Text className="text-2xl font-bold text-center mb-2.5">Seleccioná tu liga</Text>
      <Text className="text-base text-center text-gray-500 mb-5">Elegí la liga para continuar</Text>
      <FlatList
        data={ligasDisponibles}
        keyExtractor={(item) => item.leagueId}
        renderItem={({ item }) => {
          const iconSource = ICONOS_LIGAS[item.leagueId]
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              className="bg-white my-3 rounded-lg shadow-sm overflow-hidden items-center p-4"
            >
              {iconSource ? (
                <View className="w-28 h-28 bg-white rounded-lg items-center justify-center mb-3 border border-gray-200">
                  <Image source={iconSource} className="w-full h-full" resizeMode="contain" />
                </View>
              ) : null}
              <Text className="text-lg font-bold">{item.leagueDisplayName}</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}
