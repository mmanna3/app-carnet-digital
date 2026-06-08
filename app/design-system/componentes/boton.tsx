import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { getConfigLiga } from '@/lib/config/liga'
import { TEMAS_TARJETA_ACCION } from '@/design-system/tokens/tarjeta-accion'
import { temaBotonPrimario, type TemaDegradadoEquipo } from '@/lib/utilidades/color-carnet'

const temaVerdeNegro = TEMAS_TARJETA_ACCION.verde

const COLORES_BOTON = ['verde', 'rojo', 'azul', 'ambar'] as const
type ColorBoton = (typeof COLORES_BOTON)[number]

type IconoName = React.ComponentProps<typeof Feather>['name']

export type TamanioBoton = 'normal' | 'maschico'

const ESTILOS_TAMANIO = {
  normal: {
    contenedor: 'min-h-[60px] gap-2 px-5 py-5',
    redondeo: 'rounded-2xl',
    icono: 20,
    fontSize: 17,
    lineHeight: 26,
    letterSpacing: 2,
    translateYIcono: 2,
  },
  maschico: {
    contenedor: 'min-h-[48px] gap-1.5 px-4 py-3',
    redondeo: 'rounded-xl',
    icono: 17,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.5,
    translateYIcono: 1,
  },
} as const satisfies Record<
  TamanioBoton,
  {
    contenedor: string
    redondeo: string
    icono: number
    fontSize: number
    lineHeight: number
    letterSpacing: number
    translateYIcono: number
  }
>

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
  tamanio?: TamanioBoton
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
  tamanio = 'normal',
  deshabilitado = false,
  cargando = false,
  testID,
}: Props) {
  const estiloTamanio = ESTILOS_TAMANIO[tamanio]
  const isDisabled = deshabilitado || cargando
  const habilitado = primario && !isDisabled
  const colorAgrupador =
    color === 'verde'
      ? (getConfigLiga()?.colorBase ?? 'verde')
      : color === 'ambar'
        ? 'amarillo'
        : color
  const usaDegradadoVerde = !tema && color === 'verde' && colorAgrupador === 'verde'
  const temaVisual =
    tema ??
    (usaDegradadoVerde
      ? { degradado: temaVerdeNegro.degradado, borde: temaVerdeNegro.borde }
      : temaBotonPrimario(colorAgrupador))
  const degradadoHorizontal = usaDegradadoVerde

  const colorTexto = habilitado ? '#fafafa' : isDisabled ? '#71717a' : '#e4e4e7'
  const colorIcono = colorTexto

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`w-full overflow-hidden ${estiloTamanio.redondeo} ${isDisabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
    >
      <View
        className={`glass overflow-hidden ${estiloTamanio.redondeo}`}
        style={{
          borderWidth: 1.5,
          borderColor: habilitado ? temaVisual.borde : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {habilitado ? (
          <LinearGradient
            colors={temaVisual.degradado}
            start={degradadoHorizontal ? { x: 0, y: 0.5 } : { x: 0, y: 0 }}
            end={degradadoHorizontal ? { x: 1, y: 0.5 } : { x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}
        <View className={`flex-row items-center justify-center ${estiloTamanio.contenedor}`}>
          {cargando ? (
            <ActivityIndicator color={colorIcono} size="small" />
          ) : icono ? (
            <Feather name={icono} size={estiloTamanio.icono} color={colorIcono} />
          ) : null}
          <Text
            className="uppercase"
            style={{
              fontFamily: FUENTE_DISPLAY,
              color: colorTexto,
              fontSize: estiloTamanio.fontSize,
              lineHeight: estiloTamanio.lineHeight,
              letterSpacing: estiloTamanio.letterSpacing,
              ...(icono || cargando
                ? { transform: [{ translateY: estiloTamanio.translateYIcono }] }
                : {}),
            }}
          >
            {texto}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
