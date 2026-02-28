import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from './cabecera-delegado'

interface Props {
  onVolver: () => void
}

export default function PantallaIntroDelegadoRegistro({ onVolver }: Props) {
  const { irAAzul, irAVerde } = useFichajeDelegadoStore()

  return (
    <View testID="pantalla-intro-delegado" className="flex-1 bg-blue-50">
      <CabeceraDelegado titulo="Registro de delegado" onBack={onVolver} />

      <View className="px-6 pt-6 gap-3">
        <TouchableOpacity
          testID="card-nuevo-delegado"
          onPress={irAAzul}
          className="bg-blue-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/20 rounded-xl p-2 mb-3 self-start">
            <Feather name="user-plus" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            ¿Es la primera vez que te registrás en la liga?
          </Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Fichate acá si nunca te registraste
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="card-ya-registrado"
          onPress={irAVerde}
          className="bg-liga-600 rounded-2xl p-7 shadow-md"
          activeOpacity={0.85}
        >
          <View className="bg-white/10 rounded-xl p-2 mb-3 self-start">
            <Feather name="users" size={20} color="white" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            ¿Ya estás registrado como jugador en la liga?
          </Text>
          <Text className="text-blue-100 text-sm leading-tight">
            Fichate como delegado solo con el DNI
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
