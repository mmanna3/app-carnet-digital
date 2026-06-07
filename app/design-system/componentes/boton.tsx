import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { getConfigLiga } from '@/lib/config/liga'
import { temaBotonPrimario, type TemaDegradadoEquipo } from '@/lib/utilidades/color-carnet'

const COLORES_BOTON = ['verde', 'rojo', 'azul', 'ambar'] as const
type ColorBoton = (typeof COLORES_BOTON)[number]

type IconoName = React.ComponentProps<typeof Feather>['name']

interface Props {
  texto: string
  onPress: () => void
  icono?: IconoName
  /** true = CTA principal (degradado habilitado); false = acción secundaria glass */
  primario?: boolean
  /** Color del degradado cuando primario=true y no hay `tema` */
  color?: ColorBoton
  /** Degradado personalizado (p. ej. pill de categoría del carnet). */
  tema?: TemaDegradadoEquipo
  deshabilitado?: boolean
  cargando?: boolean
  testID?: string
}

export default function Boton({
  texto,
  onPress,
  icono,
  primario = true,
  color = 'verde',
  tema,
  deshabilitado = false,
  cargando = false,
  testID,
}: Props) {
  const isDisabled = deshabilitado || cargando
  const habilitado = primario && !isDisabled
  const colorAgrupador =
    color === 'verde' ? (getConfigLiga()?.colorBase ?? 'verde') : color === 'ambar' ? 'amarillo' : color
  const temaVisual = tema ?? temaBotonPrimario(colorAgrupador)
  const degradadoVertical = habilitado

  const colorTexto = habilitado ? '#fafafa' : isDisabled ? '#71717a' : '#e4e4e7'
  const colorIcono = colorTexto

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`w-full overflow-hidden rounded-2xl ${isDisabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
    >
      <View
        className="glass overflow-hidden rounded-2xl"
        style={{
          borderWidth: 1.5,
          borderColor: habilitado ? temaVisual.borde : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {habilitado ? (
          <LinearGradient
            colors={[...temaVisual.degradado]}
            start={degradadoVertical ? { x: 0, y: 0 } : { x: 0, y: 0.5 }}
            end={degradadoVertical ? { x: 0, y: 1 } : { x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}
        <View className="min-h-[48px] flex-row items-center justify-center gap-2 px-5 py-3">
          {cargando ? (
            <ActivityIndicator color={colorIcono} size="small" />
          ) : icono ? (
            <Feather name={icono} size={20} color={colorIcono} />
          ) : null}
          <Text
            className="text-sm uppercase tracking-wide"
            style={{
              fontFamily: FUENTE_DISPLAY,
              color: colorTexto,
              lineHeight: 20,
              ...(icono || cargando ? { transform: [{ translateY: 2 }] } : {}),
            }}
          >
            {texto}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
