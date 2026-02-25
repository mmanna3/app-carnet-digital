import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'

interface Props {
  titulo: string
  onBack: () => void
}

export default function Cabecera({ titulo, onBack }: Props) {
  const { esDelegado } = useFichajeStore()
  
  if (esDelegado) return null;

  return (
    <View className="pt-14 pb-4 px-6 bg-white shadow-sm flex-row items-center">
      <TouchableOpacity testID="boton-atras" onPress={onBack} className="p-2 -ml-2 rounded-lg mr-2">
        <Feather name="chevron-left" size={24} color="#111827" />
      </TouchableOpacity>
      <Text className="text-gray-900 text-xl">{titulo}</Text>
    </View>
  )
}
