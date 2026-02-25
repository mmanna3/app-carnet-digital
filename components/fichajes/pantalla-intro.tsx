import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from './cabecera'

interface Props {
  onVolver: () => void
}

export default function PantallaIntro({ onVolver }: Props) {
  const { irANuevo, irAYaFichado } = useFichajeStore()

  return (
    <View testID="pantalla-intro" className="flex-1 bg-blue-50">
      <Cabecera titulo="Fichaje" onBack={onVolver} />

      <View className="px-6 pt-6 gap-3">
        <TouchableOpacity
          testID="card-nuevo"
          onPress={irANuevo}
          className="bg-blue-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/20 rounded-xl p-2 mb-3 self-start">
            <Feather name="user-plus" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            ¿Es la primera vez que te fichás?
          </Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Fichate con el código de equipo que te dio tu delegado y completando tus datos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="card-ya-fichado"
          onPress={irAYaFichado}
          className="bg-liga-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/10 rounded-xl p-2 mb-3 self-start">
            <Feather name="users" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            ¿Ya jugás en un equipo y querés ficharte en otro?
          </Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Fichate solo con el código de equipo y tu DNI
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
