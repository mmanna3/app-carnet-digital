import React from 'react'
import { View, Text } from 'react-native'

type Props = {
  titulo: string
  subtitulo?: string
  centrado?: boolean
}

/** Cabecera oscura para cards de fixture / jornadas / tablas */
export function CabeceraBloque({ titulo, subtitulo, centrado = false }: Props) {
  if (centrado) {
    return (
      <View className="rounded-t-2xl bg-zinc-900 px-3 py-2.5">
        <Text className="text-center text-base font-semibold text-zinc-100" numberOfLines={2}>
          {titulo}
        </Text>
        {subtitulo ? (
          <Text className="mt-1 text-center text-sm text-zinc-400">{subtitulo}</Text>
        ) : null}
      </View>
    )
  }

  return (
    <View className="flex-row items-baseline justify-between gap-2 rounded-t-2xl bg-zinc-900 px-3 py-2.5">
      <Text className="shrink text-base font-semibold text-zinc-100" numberOfLines={2}>
        {titulo}
      </Text>
      {subtitulo ? <Text className="shrink-0 text-sm text-zinc-400">{subtitulo}</Text> : null}
    </View>
  )
}
