import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import React from 'react'
import { View, Text } from 'react-native'

export default function Progreso() {
  const { paso: pasoActual, calcularTotalPasos, esDelegado } = useFichajeStore()

  const totalPasos = calcularTotalPasos()

  return (
    <View
      className={`${esDelegado && 'pt-4'} px-6 pt-1 pb-6 bg-white border-b border-gray-100 flex-row items-center justify-center`}
    >
      {Array.from({ length: totalPasos }, (_, i) => i + 1).map((paso, index) => (
        <View key={paso} className="flex-row items-center">
          <View
            className={`w-9 h-9 rounded-full border-2 items-center justify-center ${
              paso <= pasoActual ? 'bg-liga-600 border-liga-600' : 'bg-white border-gray-300'
            }`}
          >
            <Text className={`text-sm ${paso <= pasoActual ? 'text-white' : 'text-gray-400'}`}>
              {paso}
            </Text>
          </View>
          {index < totalPasos - 1 && (
            <View className={`h-0.5 w-6 ${paso < pasoActual ? 'bg-liga-600' : 'bg-gray-300'}`} />
          )}
        </View>
      ))}
    </View>
  )
}
