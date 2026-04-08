import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Cabecera from './cabecera'

interface Props {
  tituloCabecera: string
  onVolver: () => void
}

export default function PantallaFichajeDeshabilitado({ tituloCabecera, onVolver }: Props) {
  return (
    <View testID="pantalla-fichaje-deshabilitado" className="flex-1 bg-blue-50">
      <Cabecera titulo={tituloCabecera} onBack={onVolver} />
      <View className="flex-1 px-6 justify-center items-center gap-4">
        <View className="bg-yellow-50 py-24 border border-yellow-200 rounded-2xl p-6 w-full">
          <Feather
            name="alert-circle"
            size={28}
            color="#b45309"
            style={{ alignSelf: 'center', marginBottom: 12 }}
          />
          <Text className="text-center text-red-900 text-base leading-relaxed">
            El fichaje está deshabilitado
          </Text>
        </View>
        <TouchableOpacity
          testID="boton-volver-fichaje-deshabilitado"
          onPress={onVolver}
          className="bg-liga-600 rounded-xl px-6 py-3"
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
