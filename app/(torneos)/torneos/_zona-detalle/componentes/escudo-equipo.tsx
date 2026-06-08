import React from 'react'
import { Image, View } from 'react-native'
import { uriRecursoPublicoApi } from '@/lib/utilidades/recursos-api'

type EscudoEquipoProps = {
  rutaEscudo: string | undefined
  apiUrl: string | undefined
  /** Tamaño del escudo en px (default 32). */
  tamaño?: number
  classNameContenedor?: string
}

export function EscudoEquipo({
  rutaEscudo,
  apiUrl,
  tamaño = 32,
  classNameContenedor = 'shrink-0 items-center justify-center px-1 py-1.5',
}: EscudoEquipoProps) {
  const uri = uriRecursoPublicoApi(apiUrl, rutaEscudo)
  const placeholder = Math.round(tamaño * 0.25) * 4

  return (
    <View className={classNameContenedor}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: tamaño, height: tamaño }}
          className="rounded-md"
          resizeMode="contain"
        />
      ) : (
        <View
          className="rounded-md bg-gray-100"
          style={{ width: placeholder, height: placeholder }}
        />
      )}
    </View>
  )
}
