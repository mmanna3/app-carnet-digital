import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FUENTE_DISPLAY } from '@/lib/design-system/fuentes'
import { TEMAS_TARJETA_ACCION } from '@/design-system/tokens/tarjeta-accion'

const temaVerde = TEMAS_TARJETA_ACCION.verde
const TAMANO_PASO = 40

const estilosNumero = StyleSheet.create({
  base: {
    fontFamily: FUENTE_DISPLAY,
    fontSize: 14,
    lineHeight: 14,
    marginTop: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  activo: {
    color: '#fafafa',
  },
  inactivo: {
    color: '#9ca3af',
  },
})

function PasoIndicador({ paso, activo }: { paso: number; activo: boolean }) {
  if (activo) {
    return (
      <View
        className="glass overflow-hidden rounded-full items-center justify-center"
        style={{
          width: TAMANO_PASO,
          height: TAMANO_PASO,
          borderWidth: 1.5,
          borderColor: temaVerde.borde,
        }}
      >
        <LinearGradient
          colors={[...temaVerde.degradado]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Text style={[estilosNumero.base, estilosNumero.activo]}>{paso}</Text>
      </View>
    )
  }

  return (
    <View
      className="items-center justify-center rounded-full border-2 border-border-glass bg-surface-elevated"
      style={{ width: TAMANO_PASO, height: TAMANO_PASO }}
    >
      <Text style={[estilosNumero.base, estilosNumero.inactivo]}>{paso}</Text>
    </View>
  )
}

interface Props {
  pasoActual: number
  totalPasos: number
  paddingTopExtra?: boolean
}

export default function BarraProgresoWizard({ pasoActual, totalPasos, paddingTopExtra }: Props) {
  return (
    <View
      className={`${paddingTopExtra ? 'pt-4' : ''} flex-row items-center justify-center border-b border-border-glass bg-surface px-6 pb-6 pt-1`}
    >
      {Array.from({ length: totalPasos }, (_, i) => i + 1).map((paso, index) => (
        <View key={paso} className="flex-row items-center">
          <PasoIndicador paso={paso} activo={paso <= pasoActual} />
          {index < totalPasos - 1 && (
            <View
              className="h-0.5 w-6"
              style={{
                backgroundColor:
                  paso < pasoActual ? temaVerde.bordeIcono : 'rgba(255, 255, 255, 0.08)',
              }}
            />
          )}
        </View>
      ))}
    </View>
  )
}
