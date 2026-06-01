import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import { Tarjeta } from '@/design-system/componentes'
import { FUENTE_DISPLAY, FUENTE_SANS } from '@/lib/design-system/fuentes'

type FeatherName = React.ComponentProps<typeof Feather>['name']

const OPACIDAD_COLOR_CARD = 0.72
const OPACIDAD_NEGRO_CARD = 0.55

const CARD_NUEVO = {
  borde: 'rgba(56, 189, 248, 0.7)',
  degradado: [
    `rgba(37, 99, 235, ${OPACIDAD_COLOR_CARD})`,
    `rgba(0, 0, 0, ${OPACIDAD_NEGRO_CARD})`,
  ] as const,
  bordeIcono: 'rgba(56, 189, 248, 0.7)',
  fondoIcono: 'rgba(37, 99, 235, 0.2)',
  colorIcono: '#38bdf8',
}

const CARD_YA_FICHADO = {
  borde: 'rgba(74, 222, 128, 0.7)',
  degradado: [
    `rgba(22, 163, 74, ${OPACIDAD_COLOR_CARD})`,
    `rgba(0, 0, 0, ${OPACIDAD_NEGRO_CARD})`,
  ] as const,
  bordeIcono: 'rgba(74, 222, 128, 0.7)',
  fondoIcono: 'rgba(22, 163, 74, 0.2)',
  colorIcono: '#4ade80',
}

const estilosIconoCard = StyleSheet.create({
  caja: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
})

function TarjetaOpcion({
  testID,
  titulo,
  subtitulo,
  iconName,
  onPress,
  borde,
  degradado,
  bordeIcono,
  fondoIcono,
  colorIcono,
}: {
  testID: string
  titulo: string
  subtitulo: string
  iconName: FeatherName
  onPress: () => void
  borde: string
  degradado: readonly [string, string]
  bordeIcono: string
  fondoIcono: string
  colorIcono: string
}) {
  return (
    <TouchableOpacity testID={testID} onPress={onPress} activeOpacity={0.85} accessibilityRole="button">
      <Tarjeta degradado={degradado} borde={borde}>
        <View style={[estilosIconoCard.caja, { borderColor: bordeIcono, backgroundColor: fondoIcono }]}>
          <Feather name={iconName} size={20} color={colorIcono} />
        </View>
        <Text
          className="mb-2 mt-3 min-h-[20px]"
          style={{
            fontFamily: FUENTE_DISPLAY,
            fontSize: 17,
            lineHeight: 26,
            letterSpacing: 0.4,
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
        >
          {subtitulo}
        </Text>
      </Tarjeta>
    </TouchableOpacity>
  )
}

interface Props {
  onVolver: () => void
}

export default function PantallaIntro({ onVolver }: Props) {
  const { irANuevo, irAYaFichado } = useFichajeStore()

  return (
    <View testID="pantalla-intro" className="flex-1 bg-surface">
      <Cabecera titulo="Fichaje" onBack={onVolver} />

      <View className="gap-3 px-6 pt-6">
        <TarjetaOpcion
          testID="card-nuevo"
          titulo="¿Es la primera vez que te fichás?"
          subtitulo="Fichate con el código de equipo que te dio tu delegado y completando tus datos"
          iconName="user-plus"
          onPress={irANuevo}
          borde={CARD_NUEVO.borde}
          degradado={CARD_NUEVO.degradado}
          bordeIcono={CARD_NUEVO.bordeIcono}
          fondoIcono={CARD_NUEVO.fondoIcono}
          colorIcono={CARD_NUEVO.colorIcono}
        />
        <TarjetaOpcion
          testID="card-ya-fichado"
          titulo="¿Ya jugás en un equipo y querés ficharte en otro?"
          subtitulo="Fichate solo con el código de equipo y tu DNI"
          iconName="users"
          onPress={irAYaFichado}
          borde={CARD_YA_FICHADO.borde}
          degradado={CARD_YA_FICHADO.degradado}
          bordeIcono={CARD_YA_FICHADO.bordeIcono}
          fondoIcono={CARD_YA_FICHADO.fondoIcono}
          colorIcono={CARD_YA_FICHADO.colorIcono}
        />
      </View>
    </View>
  )
}
