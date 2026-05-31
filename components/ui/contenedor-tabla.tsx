import React from 'react'
import { View, ScrollView, type ScrollViewProps } from 'react-native'

type Props = {
  children: React.ReactNode
  /** Scroll horizontal solo para `children`; no incluye `encabezado`. */
  horizontal?: boolean
  /** Cabecera a ancho completo (fecha, instancia, etc.) fuera del scroll horizontal. */
  encabezado?: React.ReactNode
  scrollProps?: Omit<ScrollViewProps, 'children'>
}

/**
 * Card blanca con borde sólido sobre fondo oscuro.
 */
export function ContenedorTabla({ children, horizontal = false, encabezado, scrollProps }: Props) {
  const cuerpo = horizontal ? (
    <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled {...scrollProps}>
      {children}
    </ScrollView>
  ) : (
    children
  )

  return (
    <View
      className="overflow-hidden rounded-2xl border border-zinc-700 bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {encabezado}
      {cuerpo}
    </View>
  )
}
