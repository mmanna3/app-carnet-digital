import React from 'react'
import { View } from 'react-native'
import { Texto } from './texto'

type Props = {
  mensaje: string
  className?: string
}

export function EstadoVacio({ mensaje, className = '' }: Props) {
  return (
    <View className={`flex-1 justify-center items-center px-6 py-8 ${className}`.trim()}>
      <Texto variante="cuerpo" className="text-center text-zinc-400">
        {mensaje}
      </Texto>
    </View>
  )
}
