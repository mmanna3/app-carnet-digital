import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { FUENTE_DISPLAY } from '@/design-system/tokens/fuentes'

interface Props {
  titulo: string
  onBack: () => void
  testID?: string
}

const ANCHO_LATERAL = 40

export function CabeceraPaso({ titulo, onBack, testID }: Props) {
  return (
    <View testID={testID} className="bg-surface px-4 pb-4 pt-14">
      <View className="min-h-[40px] flex-row items-center">
        <TouchableOpacity
          testID="boton-atras"
          onPress={onBack}
          className="rounded-lg p-2"
          style={{ width: ANCHO_LATERAL }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Feather name="chevron-left" size={24} color="#e4e4e7" />
        </TouchableOpacity>
        <Text
          pointerEvents="none"
          className="flex-1 text-center text-zinc-100"
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 17,
          }}
          numberOfLines={2}
        >
          {titulo}
        </Text>
        <View style={{ width: ANCHO_LATERAL }} />
      </View>
    </View>
  )
}
