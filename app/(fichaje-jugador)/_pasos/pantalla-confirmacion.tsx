import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'

interface Props {
  mensaje: string
  onVolverInicio: () => void
  onFicharOtro?: () => void
}

export default function PantallaConfirmacion({ mensaje, onVolverInicio, onFicharOtro }: Props) {
  return (
    <View
      testID="pantalla-confirmacion"
      className="flex-1 bg-surface items-center justify-center px-6"
    >
      <View className="glass w-full rounded-2xl border border-border-glass p-6 mb-6">
        <View className="items-center gap-4">
          <View className="w-16 h-16 bg-liga-600 rounded-full items-center justify-center">
            <Feather name="check" size={32} color="white" />
          </View>
          <Text className="text-zinc-100 text-xl font-semibold text-center">
            ¡Fichaje completado!
          </Text>
          <Text className="text-zinc-400 text-sm text-center leading-relaxed">{mensaje}</Text>
        </View>
      </View>

      <BotonWizard
        testID="boton-volver-inicio"
        texto="Volver al inicio"
        icono="home"
        onPress={onVolverInicio}
      />
      {onFicharOtro && (
        <TouchableOpacity
          testID="boton-fichar-otro"
          onPress={onFicharOtro}
          activeOpacity={0.85}
          className="w-full glass rounded-2xl border border-border-glass py-3 px-6 mt-3 flex-row items-center justify-center gap-2"
        >
          <Feather name="user-plus" size={20} color="#4ade80" />
          <Text className="text-green-400 font-semibold">Fichar otro jugador</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
