import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { FUENTE_DISPLAY, FUENTE_SANS_SEMIBOLD } from '@/lib/design-system/fuentes'
import { temaPillEquipo } from '@/lib/utilidades/color-carnet'

type IconoFeatherFicha = React.ComponentProps<typeof Feather>['name']

function ColumnaCategoria({
  etiqueta,
  colorEquipo,
  compacto = false,
}: {
  etiqueta: string
  colorEquipo: string
  compacto?: boolean
}) {
  const tema = temaPillEquipo(colorEquipo)

  return (
    <View
      className="shrink-0 flex-[1.56] items-center justify-center px-1"
      accessibilityLabel={compacto ? 'Categoría: DT/Delegado' : `Categoría: ${etiqueta}`}
    >
      <View
        className={`overflow-hidden rounded-full ${compacto ? 'px-4 py-2' : 'px-7 py-2'}`}
        style={{
          borderWidth: 1.5,
          borderColor: tema.borde,
        }}
      >
        <LinearGradient
          colors={[...tema.degradado]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {compacto ? (
          <Text
            className="text-center uppercase text-zinc-50"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 13,
              lineHeight: 15,
              letterSpacing: 0.5,
            }}
          >
            DT/{'\n'}Delegado
          </Text>
        ) : (
          <Text
            className="text-center uppercase text-zinc-50"
            style={{
              fontFamily: FUENTE_DISPLAY,
              fontSize: 22,
              lineHeight: 26,
              letterSpacing: 1,
            }}
            numberOfLines={1}
          >
            {etiqueta}
          </Text>
        )}
      </View>
    </View>
  )
}

function ColumnaDato({
  iconoFeather,
  valor,
  descripcionAccesibilidad,
  colorIcono,
  classNameValor = 'text-zinc-900',
}: {
  iconoFeather: IconoFeatherFicha
  valor: string
  descripcionAccesibilidad: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View
      className="min-w-0 flex-[0.72] items-center px-0.5"
      accessibilityLabel={`${descripcionAccesibilidad}: ${valor}`}
    >
      <Feather name={iconoFeather} size={17} color={colorIcono} />
      <Text
        className={`mt-1.5 text-center text-sm tabular-nums ${classNameValor}`}
        style={{ fontFamily: FUENTE_SANS_SEMIBOLD }}
        numberOfLines={2}
      >
        {valor}
      </Text>
    </View>
  )
}

/** Tres datos en fila: DNI — categoría (pill) — fecha de nacimiento. */
export function FichaDatosJugador({
  dni,
  fechaNacimiento,
  etiquetaCategoria,
  esDelegado = false,
  colorEquipo,
  colorIcono,
  classNameValor,
}: {
  dni: string
  fechaNacimiento: string
  etiquetaCategoria: string
  esDelegado?: boolean
  colorEquipo: string
  colorIcono: string
  classNameValor?: string
}) {
  return (
    <View className="w-full max-w-sm flex-row items-center border-t border-zinc-200 pt-4">
      <ColumnaDato
        iconoFeather="credit-card"
        valor={dni}
        descripcionAccesibilidad="DNI"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaCategoria
        etiqueta={etiquetaCategoria}
        colorEquipo={colorEquipo}
        compacto={esDelegado}
      />
      <View className="w-px self-stretch bg-zinc-200" accessibilityElementsHidden />
      <ColumnaDato
        iconoFeather="calendar"
        valor={fechaNacimiento}
        descripcionAccesibilidad="Fecha de nacimiento"
        colorIcono={colorIcono}
        classNameValor={classNameValor}
      />
    </View>
  )
}
