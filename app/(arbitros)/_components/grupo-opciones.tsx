import React from 'react'
import { Text, View } from 'react-native'
import { Chip } from '@/design-system/componentes'

export type OpcionGrupo<T> = {
  valor: T
  etiqueta: string
  testID: string
}

interface Props<T> {
  etiqueta: string
  opciones: readonly OpcionGrupo<T>[]
  seleccionadas: readonly T[]
  onPress: (valor: T) => void
}

export default function GrupoOpciones<T extends string | number | boolean>({
  etiqueta,
  opciones,
  seleccionadas,
  onPress,
}: Props<T>) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-zinc-400">{etiqueta}</Text>
      <View className="flex-row flex-wrap gap-2">
        {opciones.map((opcion) => (
          <Chip
            key={opcion.testID}
            testID={opcion.testID}
            label={opcion.etiqueta}
            activo={seleccionadas.includes(opcion.valor)}
            onPress={() => onPress(opcion.valor)}
          />
        ))}
      </View>
    </View>
  )
}
