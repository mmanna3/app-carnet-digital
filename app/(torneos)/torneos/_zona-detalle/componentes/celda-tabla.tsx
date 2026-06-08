import React from 'react'
import { Text, View } from 'react-native'

function clasePaddingCelda(encabezado: boolean, borde?: 'inicio' | 'fin'): string {
  const py = 'py-2.5'
  if (borde === 'inicio') return encabezado ? `pl-3 pr-2 ${py}` : `pl-3 pr-1.5 ${py}`
  if (borde === 'fin') return encabezado ? `pl-2 pr-3 ${py}` : `pl-1.5 pr-3 ${py}`
  return encabezado ? `px-2 ${py}` : `px-1.5 ${py}`
}

export type CeldaTablaProps = {
  children: React.ReactNode
  ancho: number
  alinear?: 'left' | 'center' | 'right'
  negrita?: boolean
  tabular?: boolean
  numberOfLines?: number
  encabezado?: boolean
  borde?: 'inicio' | 'fin'
  columnaEquipo?: boolean
}

export function CeldaTabla({
  children,
  ancho,
  alinear = 'left',
  negrita = false,
  tabular = false,
  numberOfLines = 2,
  encabezado = false,
  borde,
  columnaEquipo = false,
}: CeldaTablaProps) {
  const align = alinear === 'center' ? 'center' : alinear === 'right' ? 'right' : 'left'
  const colorTexto = encabezado ? 'text-zinc-100' : 'text-gray-900'
  const padding = columnaEquipo
    ? encabezado
      ? 'pl-2 pr-1 py-2.5'
      : 'pl-1.5 pr-1 py-2.5'
    : clasePaddingCelda(encabezado, borde)
  return (
    <View
      style={{ width: ancho, minWidth: ancho }}
      className={`shrink-0 justify-center ${padding}`}
    >
      <Text
        className={`text-base leading-6 ${encabezado ? 'font-semibold' : 'font-medium'} ${colorTexto} ${tabular ? 'tabular-nums' : ''}`}
        style={{ textAlign: align }}
        numberOfLines={columnaEquipo ? 1 : numberOfLines}
      >
        {children}
      </Text>
    </View>
  )
}
