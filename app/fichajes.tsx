import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function FichajesScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-[#f8f8f8] p-5">
      <TouchableOpacity onPress={() => router.back()} className="py-2 mb-4">
        <Text className="text-base text-liga-600">← Volver</Text>
      </TouchableOpacity>
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Fichajes</Text>
        <Text className="text-sm text-gray-500 mt-2">Próximamente</Text>
      </View>
    </View>
  )
}
