import React from 'react'
import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'

interface Props {
  mensaje: string
  onVolverInicio: () => void
  onFicharOtro?: () => void
}

export default function PantallaConfirmacion({ mensaje, onVolverInicio, onFicharOtro }: Props) {
  return (
    <View testID="pantalla-confirmacion" className="flex-1 bg-surface">
      <View className="flex-1 px-6 justify-center items-center">
        <View className="glass w-full rounded-2xl border border-green-500/30 p-6 mb-6">
          <View className="items-center gap-4">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-green-500/20 border border-green-400/50">
              <Feather name="check" size={32} color="#4ade80" />
            </View>
            <Text className="text-zinc-100 text-xl font-semibold text-center">
              ¡Fichaje completado!
            </Text>
            <Text className="text-zinc-400 text-sm text-center leading-relaxed">{mensaje}</Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <BotonWizard
            testID="boton-volver-inicio"
            texto="Volver al inicio"
            icono="home"
            onPress={onVolverInicio}
          />
          {onFicharOtro && (
            <BotonWizard
              testID="boton-fichar-otro"
              texto="Fichar otro jugador"
              icono="user-plus"
              onPress={onFicharOtro}
              primario={false}
            />
          )}
        </View>
      </View>
    </View>
  )
}
