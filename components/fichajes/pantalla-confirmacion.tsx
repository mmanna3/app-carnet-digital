import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  mensaje: string
  onVolverInicio: () => void
  onFicharOtro?: () => void
}

export default function PantallaConfirmacion({ mensaje, onVolverInicio, onFicharOtro }: Props) {

  return (
    <View
      testID="pantalla-confirmacion"
      className="flex-1 bg-gray-50 items-center justify-center px-6"
    >
      <View className="w-full bg-white rounded-2xl p-6 shadow-md mb-6">
        <View className="items-center gap-4">
          <View className="w-16 h-16 bg-liga-600 rounded-full items-center justify-center">
            <Feather name="check" size={32} color="white" />
          </View>
          <Text className="text-gray-900 text-xl font-semibold text-center">
            ¡Fichaje completado!
          </Text>
          <Text className="text-gray-600 text-sm text-center leading-relaxed">{mensaje}</Text>
        </View>
      </View>

      <TouchableOpacity
        testID="boton-volver-inicio"
        onPress={onVolverInicio}
        activeOpacity={0.85}
        className="w-full bg-liga-600 rounded-2xl py-3 px-6 shadow-md flex-row items-center justify-center gap-2"
      >
        <Feather name="home" size={20} color="white" />
        <Text className="text-white font-semibold">Volver al inicio</Text>
      </TouchableOpacity>
      {onFicharOtro && (
        <TouchableOpacity
          testID="boton-fichar-otro"
          onPress={onFicharOtro}
          activeOpacity={0.85}
          className="w-full border-2 border-liga-600 rounded-2xl py-3 px-6 mt-3 flex-row items-center justify-center gap-2"
        >
          <Feather name="user-plus" size={20} />
          <Text className="text-liga-600 font-semibold">Fichar otro jugador</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
