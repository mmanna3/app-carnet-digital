import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { TOKENS } from '@/lib/design-system'
import { Texto } from './texto'

type Props = {
  mensaje?: string
  className?: string
}

export function EstadoCarga({ mensaje = 'Cargando...', className = '' }: Props) {
  return (
    <View
      className={`flex-1 items-center justify-center gap-3 bg-surface py-12 ${className}`.trim()}
    >
      <ActivityIndicator size="large" color={TOKENS.accentHot} />
      <Texto className="text-md tracking-wide text-zinc-400">{mensaje}</Texto>
    </View>
  )
}
