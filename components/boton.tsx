import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface BotonProps {
  onPress: () => void
  texto: string
  deshabilitado?: boolean
  cargando?: boolean
}

export default function Boton({
  onPress,
  texto,
  deshabilitado = false,
  cargando = false,
}: BotonProps) {
  const isDisabled = deshabilitado || cargando
  return (
    <TouchableOpacity
      className={`bg-liga-600 h-[50px] rounded-lg justify-center items-center mt-2.5${isDisabled ? ' opacity-70' : ''}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {cargando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-base font-semibold">{texto}</Text>
      )}
    </TouchableOpacity>
  )
}
