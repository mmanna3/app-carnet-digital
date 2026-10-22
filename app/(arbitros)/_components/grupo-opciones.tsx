import React from 'react'
import { Text, View } from 'react-native'
import { Chip } from '@/design-system/componentes'

interface Props {
  etiqueta: string
  opciones: readonly string[]
  seleccionadas: readonly string[]
  onPress: (valor: string) => void
  testIDPrefijo?: string
}

export default function GrupoOpciones({
  etiqueta,
  opciones,
  seleccionadas,
  onPress,
  testIDPrefijo,
}: Props) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-zinc-400">{etiqueta}</Text>
      <View className="flex-row flex-wrap gap-2">
        {opciones.map((opcion) => (
          <Chip
            key={opcion}
            testID={testIDPrefijo ? `${testIDPrefijo}-${opcion}` : undefined}
            label={opcion}
            activo={seleccionadas.includes(opcion)}
            onPress={() => onPress(opcion)}
          />
        ))}
      </View>
    </View>
  )
}
