import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import {
  COLOR_TARJETA,
  TEMAS_TARJETA_ACCION,
  type ColorTarjeta,
} from '@/design-system/tokens/tarjeta-accion'

export type TemaFranja = ColorTarjeta | 'ambar'

const TEMA_AMBAR = {
  borde: 'rgba(251, 191, 36, 0.7)',
  degradado: [`rgba(245, 158, 11, 0.72)`, 'rgba(0, 0, 0, 0.55)'] as const,
}

function obtenerTema(tema: TemaFranja) {
  if (tema === 'ambar') return TEMA_AMBAR
  return TEMAS_TARJETA_ACCION[tema]
}

interface Props {
  children: React.ReactNode
  tema?: TemaFranja
  /** franja = encabezado de sección; pill = chip en navegación horizontal */
  variante?: 'franja' | 'pill'
  onPress?: () => void
  className?: string
  testID?: string
}

export function FranjaSeccion({
  children,
  tema = COLOR_TARJETA.VERDE,
  variante = 'franja',
  onPress,
  className = '',
  testID,
}: Props) {
  const theme = obtenerTema(tema)
  const esPill = variante === 'pill'

  const contenido = (
    <View
      className={`glass overflow-hidden ${esPill ? 'rounded-full px-5 py-2' : 'mb-4 rounded-2xl px-4 py-3'} ${className}`.trim()}
      style={{ borderWidth: 1.5, borderColor: theme.borde }}
    >
      <LinearGradient
        colors={[...theme.degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Text
        className="text-center uppercase tracking-wide text-zinc-50"
        style={{
          fontFamily: FUENTE_DISPLAY,
          fontSize: esPill ? 14 : 17,
          lineHeight: esPill ? 18 : 22,
        }}
      >
        {children}
      </Text>
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        {contenido}
      </TouchableOpacity>
    )
  }

  return (
    <View testID={testID} accessibilityRole="header">
      {contenido}
    </View>
  )
}
