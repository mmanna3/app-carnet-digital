import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  onNuevo: () => void
  onYaFichado: () => void
  onVolver?: () => void
}

export default function PantallaIntroDelegado({ onNuevo, onYaFichado }: Props) {
  return (
    <View testID="pantalla-intro-delegado" className="flex-1 bg-blue-50">
      <View className="px-6 pt-6 gap-3">
        <TouchableOpacity
          testID="card-nuevo"
          onPress={onNuevo}
          className="bg-blue-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/20 rounded-xl p-2 mb-3 self-start">
            <Feather name="user-plus" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">Fichar nuevo jugador</Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Para jugadores no fichados en ningún equipo de la liga
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="card-ya-fichado"
          onPress={onYaFichado}
          className="bg-liga-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/10 rounded-xl p-2 mb-3 self-start">
            <Feather name="users" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            Jugador ya fichado en la liga
          </Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Para jugadores fichados en otro equipo de la liga
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
