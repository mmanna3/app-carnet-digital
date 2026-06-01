import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewProps,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { FUENTE_DISPLAY, FUENTE_SANS } from '@/lib/design-system/fuentes'
import {
  COLOR_TARJETA,
  ICONO_DONDE,
  TEMAS_TARJETA_ACCION,
  type ColorTarjeta,
  type IconoDonde,
} from '@/design-system/tokens/tarjeta-accion'

export { COLOR_TARJETA, ICONO_DONDE }
export type { ColorTarjeta, IconoDonde }

export const VARIANTE_TARJETA = {
  /** Título 15px — cards en fila del home (Fichaje, Delegados) */
  COMPACTA: 'compacta',
  /** Título 17px — cards apiladas con textos largos (intro fichaje) */
  AMPLIA: 'amplia',
} as const

export type VarianteTarjeta = (typeof VARIANTE_TARJETA)[keyof typeof VARIANTE_TARJETA]

type IconoName = React.ComponentProps<typeof Ionicons>['name']

const estilosIcono = StyleSheet.create({
  caja: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
})

type PropsBase = Omit<ViewProps, 'children'> & {
  className?: string
}

type PropsContenedor = PropsBase & {
  children: React.ReactNode
  icono?: never
  titulo?: never
  subtitulo?: never
  color?: never
  onPress?: never
}

type PropsAccion = PropsBase & {
  icono: IconoName
  iconoDonde?: IconoDonde
  titulo: string
  subtitulo: string
  color: ColorTarjeta
  onPress: () => void
  tamanoIcono?: number
  variante?: VarianteTarjeta
  mostrarChevron?: boolean
  accessibilityLabel?: string
  children?: never
}

export type PropsTarjeta = PropsContenedor | PropsAccion

function esTarjetaAccion(props: PropsTarjeta): props is PropsAccion {
  return 'onPress' in props
}

function CajaIcono({
  icono,
  tamano,
  tema,
}: {
  icono: IconoName
  tamano: number
  tema: (typeof TEMAS_TARJETA_ACCION)[ColorTarjeta]
}) {
  return (
    <View
      style={[estilosIcono.caja, { borderColor: tema.bordeIcono, backgroundColor: tema.fondoIcono }]}
    >
      <Ionicons name={icono} size={tamano} color={tema.colorIcono} />
    </View>
  )
}

function ContenidoArriba({
  icono,
  titulo,
  subtitulo,
  tema,
  tamanoIcono,
  variante,
}: {
  icono: IconoName
  titulo: string
  subtitulo: string
  tema: (typeof TEMAS_TARJETA_ACCION)[ColorTarjeta]
  tamanoIcono: number
  variante: VarianteTarjeta
}) {
  const esCompacta = variante === VARIANTE_TARJETA.COMPACTA

  return (
    <View
      style={
        esCompacta
          ? { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }
          : undefined
      }
      className={esCompacta ? '' : 'p-5'}
    >
      <CajaIcono icono={icono} tamano={tamanoIcono} tema={tema} />
      <Text
        className={esCompacta ? 'mb-1.5 mt-3 min-h-[20px]' : 'mb-2 mt-3 min-h-[20px]'}
        style={{
          fontFamily: FUENTE_DISPLAY,
          fontSize: esCompacta ? 15 : 17,
          lineHeight: esCompacta ? 20 : 26,
          letterSpacing: esCompacta ? 0 : 0.4,
          color: '#fafafa',
        }}
      >
        {titulo}
      </Text>
      <Text
        style={{
          fontFamily: FUENTE_SANS,
          fontSize: 13,
          lineHeight: 18,
          color: '#d4d4d8',
        }}
        numberOfLines={3}
      >
        {subtitulo}
      </Text>
    </View>
  )
}

function ContenidoAlCostado({
  icono,
  titulo,
  subtitulo,
  tema,
  tamanoIcono,
  mostrarChevron,
}: {
  icono: IconoName
  titulo: string
  subtitulo: string
  tema: (typeof TEMAS_TARJETA_ACCION)[ColorTarjeta]
  tamanoIcono: number
  mostrarChevron?: boolean
}) {
  return (
    <View className="flex-row items-start px-5 py-5">
      <CajaIcono icono={icono} tamano={tamanoIcono} tema={tema} />
      <View className="ml-4 min-w-0 flex-1">
        <Text
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 17,
            color: '#fafafa',
            lineHeight: 22,
            letterSpacing: 0.3,
          }}
        >
          {titulo}
        </Text>
        <Text
          style={{
            fontFamily: FUENTE_SANS,
            fontSize: 13,
            lineHeight: 18,
            color: '#d4d4d8',
            marginTop: 4,
          }}
          numberOfLines={2}
        >
          {subtitulo}
        </Text>
      </View>
      {mostrarChevron ? (
        <Ionicons
          name="chevron-forward"
          size={22}
          color="rgba(255, 255, 255, 0.45)"
          style={{ marginLeft: 8, alignSelf: 'center' }}
        />
      ) : null}
    </View>
  )
}

function TarjetaAccion({
  className = '',
  style,
  testID,
  icono,
  iconoDonde = ICONO_DONDE.ARRIBA,
  titulo,
  subtitulo,
  color,
  onPress,
  tamanoIcono,
  variante = VARIANTE_TARJETA.AMPLIA,
  mostrarChevron,
  accessibilityLabel,
  ...rest
}: PropsAccion) {
  const tema = TEMAS_TARJETA_ACCION[color]
  const esArriba = iconoDonde === ICONO_DONDE.ARRIBA
  const tamano = tamanoIcono ?? (esArriba ? 22 : 26)
  const minHeight = esArriba ? 152 : 112

  const cuerpo = (
    <View
      className="glass overflow-hidden rounded-2xl"
      style={[{ borderWidth: 1.5, borderColor: tema.borde, minHeight }, style]}
      {...rest}
    >
      <LinearGradient
        colors={[...tema.degradado]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {esArriba ? (
        <ContenidoArriba
          icono={icono}
          titulo={titulo}
          subtitulo={subtitulo}
          tema={tema}
          tamanoIcono={tamano}
          variante={variante}
        />
      ) : (
        <ContenidoAlCostado
          icono={icono}
          titulo={titulo}
          subtitulo={subtitulo}
          tema={tema}
          tamanoIcono={tamano}
          mostrarChevron={mostrarChevron}
        />
      )}
    </View>
  )

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      className={`overflow-hidden rounded-2xl ${className}`.trim()}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${titulo}. ${subtitulo}`}
    >
      {cuerpo}
    </TouchableOpacity>
  )
}

function TarjetaContenedor({ className = '', children, style, ...rest }: PropsContenedor) {
  return (
    <View className={`glass rounded-2xl p-5 ${className}`.trim()} style={style} {...rest}>
      {children}
    </View>
  )
}

export function Tarjeta(props: PropsTarjeta) {
  if (esTarjetaAccion(props)) {
    return <TarjetaAccion {...props} />
  }
  return <TarjetaContenedor {...props} />
}
