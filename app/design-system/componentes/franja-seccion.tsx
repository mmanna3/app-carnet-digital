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
  /** franja = encabezado; pill = chip; separador = división fuerte entre bloques de carnets */
  variante?: 'franja' | 'pill' | 'separador'
  onPress?: () => void
  className?: string
  style?: View['props']['style']
  testID?: string
}

export function FranjaSeccion({
  children,
  tema = COLOR_TARJETA.VERDE,
  variante = 'franja',
  onPress,
  className = '',
  style,
  testID,
}: Props) {
  const esPill = variante === 'pill'
  const esSeparador = variante === 'separador'
  const theme = obtenerTema(tema)

  const franja = (
    <View
      className={
        esSeparador
          ? 'overflow-hidden rounded-xl px-6 py-12'
          : `glass overflow-hidden ${esPill ? 'rounded-full px-5 py-2' : 'mb-4 rounded-2xl px-4 py-3'} ${className}`.trim()
      }
      style={[
        {
          borderWidth: esSeparador ? 2 : 1.5,
          borderColor: theme.borde,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[...theme.degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Text
        className="text-center uppercase text-zinc-50"
        numberOfLines={esPill ? 1 : undefined}
        adjustsFontSizeToFit={esPill}
        minimumFontScale={esPill ? 0.75 : undefined}
        style={{
          fontFamily: FUENTE_DISPLAY,
          fontSize: esSeparador ? 22 : esPill ? 18 : 17,
          lineHeight: esSeparador ? 28 : esPill ? 22 : 22,
          letterSpacing: esSeparador ? 2 : esPill ? 0 : 0.5,
        }}
      >
        {children}
      </Text>
    </View>
  )

  const contenido = esSeparador ? (
    <View className={`my-8 ${className}`.trim()}>
      <View className="mb-4 h-[3px] rounded-full" style={{ backgroundColor: theme.borde }} />
      {franja}
      <View className="mt-5 h-[3px] rounded-full" style={{ backgroundColor: theme.borde }} />
    </View>
  ) : (
    franja
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
