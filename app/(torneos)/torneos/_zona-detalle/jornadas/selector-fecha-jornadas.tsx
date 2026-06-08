import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View, type LayoutChangeEvent } from 'react-native'
import type { FechasParaJornadasDTO } from '@/lib/api/clients'
import { FranjaSeccion, Texto, type TemaFranja } from '@/design-system/componentes'
import { textoOGuion } from '@/lib/utilidades/recursos-api'
import { CardFechaJornadas } from './tabla-jornadas'
import {
  DIAMETRO_PILL_JORNADA,
  indiceUltimaFechaConResultados,
  MARGEN_HORIZONTAL_PILL,
  numeroDeTituloFecha,
  PADDING_HORIZONTAL_SELECTOR,
} from './utilidades-jornadas'

type JornadasConSelectorFechaProps = {
  fechas: FechasParaJornadasDTO[]
  apiUrl: string | undefined
  temaTorneo: TemaFranja
}

function PillJornada({
  seleccionada,
  label,
  titulo,
  temaTorneo,
  onPress,
  onLayout,
}: {
  seleccionada: boolean
  label: string
  titulo: string | undefined
  temaTorneo: TemaFranja
  onPress: () => void
  onLayout: (event: LayoutChangeEvent) => void
}) {
  return (
    <View
      onLayout={onLayout}
      style={{
        width: DIAMETRO_PILL_JORNADA + MARGEN_HORIZONTAL_PILL * 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {seleccionada ? (
        <FranjaSeccion
          variante="pill"
          formaPill="circulo"
          tema={temaTorneo}
          className="mb-0"
          style={{
            width: DIAMETRO_PILL_JORNADA,
            height: DIAMETRO_PILL_JORNADA,
          }}
          onPress={onPress}
        >
          {label}
        </FranjaSeccion>
      ) : (
        <TouchableOpacity
          className="items-center justify-center rounded-full border border-border-glass bg-white/10"
          style={{ width: DIAMETRO_PILL_JORNADA, height: DIAMETRO_PILL_JORNADA }}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityState={{ selected: false }}
          accessibilityLabel={textoOGuion(titulo)}
        >
          <Texto
            variante="titulo"
            className={`${Platform.OS === 'web' ? 'text-xl' : 'text-lg'} text-center text-zinc-400`}
            numberOfLines={1}
          >
            {label}
          </Texto>
        </TouchableOpacity>
      )}
    </View>
  )
}

export function JornadasConSelectorFecha({
  fechas,
  apiUrl,
  temaTorneo,
}: JornadasConSelectorFechaProps) {
  const indiceDefault = useMemo(() => indiceUltimaFechaConResultados(fechas), [fechas])

  const [indiceElegido, setIndiceElegido] = useState<number | null>(null)

  const indiceActivo = indiceElegido ?? indiceDefault

  const indiceSeguro = Math.min(Math.max(0, indiceActivo), Math.max(0, fechas.length - 1))

  const fechaMostrada = fechas[indiceSeguro]

  const scrollRef = useRef<ScrollView>(null)
  const pillLayouts = useRef<Map<number, { x: number; width: number }>>(new Map())
  const [anchoContenedor, setAnchoContenedor] = useState(0)
  const [anchoFilaPills, setAnchoFilaPills] = useState(0)

  const anchoPillsEstimado =
    fechas.length * (DIAMETRO_PILL_JORNADA + MARGEN_HORIZONTAL_PILL * 2) +
    PADDING_HORIZONTAL_SELECTOR * 2
  const necesitaScroll =
    anchoContenedor > 0 &&
    (anchoFilaPills > anchoContenedor || anchoPillsEstimado > anchoContenedor)

  const scrollHastaIndice = useCallback(
    (index: number, animated: boolean) => {
      if (!necesitaScroll) return
      const layout = pillLayouts.current.get(index)
      if (!layout || !scrollRef.current || anchoContenedor <= 0) return
      const offset = layout.x - (anchoContenedor / 2 - layout.width / 2)
      scrollRef.current.scrollTo({ x: Math.max(0, offset), animated })
    },
    [anchoContenedor, necesitaScroll]
  )

  const esSeleccionUsuario = indiceElegido !== null

  useEffect(() => {
    if (!necesitaScroll) {
      scrollRef.current?.scrollTo({ x: 0, animated: false })
      return
    }
    scrollHastaIndice(indiceSeguro, esSeleccionUsuario)
  }, [indiceSeguro, esSeleccionUsuario, scrollHastaIndice, necesitaScroll])

  const onPillLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout
    pillLayouts.current.set(index, { x, width })
  }, [])

  const pills = fechas.map((fecha, index) => {
    const seleccionada = index === indiceSeguro
    const label = numeroDeTituloFecha(fecha.titulo)

    return (
      <PillJornada
        key={`fecha-${index}`}
        seleccionada={seleccionada}
        label={label}
        titulo={fecha.titulo}
        temaTorneo={temaTorneo}
        onPress={() => setIndiceElegido(index)}
        onLayout={(e) => onPillLayout(index, e)}
      />
    )
  })

  const filaPills = (
    <View
      className="flex-row items-center"
      style={{
        paddingHorizontal: PADDING_HORIZONTAL_SELECTOR,
        minWidth: anchoContenedor > 0 ? anchoContenedor : undefined,
        justifyContent: 'center',
      }}
      onLayout={(e) => setAnchoFilaPills(e.nativeEvent.layout.width)}
    >
      {pills}
    </View>
  )

  return (
    <View className="flex-1">
      <View className="z-[1] border-b border-border-glass bg-surface-elevated py-2.5">
        <ScrollView
          ref={scrollRef}
          horizontal
          scrollEnabled={necesitaScroll}
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => setAnchoContenedor(e.nativeEvent.layout.width)}
        >
          {filaPills}
        </ScrollView>
      </View>

      {fechaMostrada ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
          showsVerticalScrollIndicator
        >
          <CardFechaJornadas fecha={fechaMostrada} apiUrl={apiUrl} />
        </ScrollView>
      ) : null}
    </View>
  )
}
