import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  texto: string
  onPress: () => void
  icono?: keyof typeof Feather.glyphMap
  variante?: 'primario' | 'oscuro'
  deshabilitado?: boolean
  testID?: string
}

export default function BotonWizard({
  texto,
  onPress,
  icono,
  variante = 'primario',
  deshabilitado = false,
  testID,
}: Props) {
  const bg = deshabilitado ? 'bg-gray-300' : variante === 'primario' ? 'bg-liga-600' : 'bg-gray-800'
  const colorIcono = deshabilitado ? '#6b7280' : 'white'

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={deshabilitado}
      activeOpacity={0.85}
      className={`${bg} rounded-2xl py-5 px-6 shadow-md flex-row items-center justify-center gap-2`}
    >
      {icono && <Feather name={icono} size={20} color={colorIcono} />}
      <Text className={`font-semibold text-md ${deshabilitado ? 'text-gray-500' : 'text-white'}`}>
        {texto}
      </Text>
    </TouchableOpacity>
  )
}
