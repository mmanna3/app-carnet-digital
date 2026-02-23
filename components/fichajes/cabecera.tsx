import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  titulo: string
  onBack: () => void
}

export default function Cabecera({ titulo, onBack }: Props) {
  return (
    <View className="pt-14 pb-4 px-6 bg-white shadow-sm flex-row items-center">
      <TouchableOpacity testID="boton-atras" onPress={onBack} className="p-2 -ml-2 rounded-lg mr-2">
        <Feather name="chevron-left" size={24} color="#111827" />
      </TouchableOpacity>
      <Text className="text-gray-900 text-xl">{titulo}</Text>
    </View>
  )
}
