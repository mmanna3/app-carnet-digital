import React, { useMemo } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import {
  CabeceraBloque,
  ContenedorTabla,
  EstadoCarga,
  EstadoVacio,
  Texto,
} from '@/design-system/componentes'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { InstanciasDTO, PartidoEliminacionDirectaDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { textoOGuion, uriRecursoPublicoApi } from '@/lib/utilidades/recursos-api'
import { useAnchoColumnaEquipo } from '@/torneos/_zona-detalle/anchos-tabla'

const ANCHO_ESCUDO = 36
const GAP_FILA = 6
const PADDING_FILA = 16
const ANCHO_RESULTADO_MIN = 88
const ANCHO_CHAR_RESULTADO = 7
const PADDING_RESULTADO = 16
const CLASS_TEXTO_EQUIPO = 'text-[12px] font-medium leading-4'

function Escudo({ uri, apiUrl }: { uri: string | undefined; apiUrl: string | undefined }) {
  const u = uriRecursoPublicoApi(apiUrl, uri)
  return (
    <View
      style={{ width: ANCHO_ESCUDO, minWidth: ANCHO_ESCUDO }}
      className="shrink-0 items-center justify-center"
    >
      {u ? (
        <Image
          source={{ uri: u }}
          style={{ width: ANCHO_ESCUDO, height: ANCHO_ESCUDO }}
          className="rounded-md"
          resizeMode="contain"
        />
      ) : (
        <View className="h-9 w-9 rounded-md bg-gray-100" />
      )}
    </View>
  )
}

function textoPenal(p: string | undefined) {
  const t = (p ?? '').trim()
  return t.length > 0 ? t : null
}

function textoResultadoPartido(partido: PartidoEliminacionDirectaDTO): string {
  const pLoc = textoPenal(partido.penalesLocal)
  const pVis = textoPenal(partido.penalesVisitante)
  const resL = textoOGuion(partido.resultadoLocal)
  const resV = textoOGuion(partido.resultadoVisitante)
  return `${resL}${pLoc != null ? `(${pLoc})` : ''} vs ${resV}${pVis != null ? `(${pVis})` : ''}`
}

function anchoResultadoPartidos(partidos: PartidoEliminacionDirectaDTO[]): number {
  let maxLen = '— vs —'.length
  for (const p of partidos) {
    maxLen = Math.max(maxLen, textoResultadoPartido(p).length)
  }
  return Math.max(ANCHO_RESULTADO_MIN, maxLen * ANCHO_CHAR_RESULTADO + PADDING_RESULTADO)
}

function anchoFilaPartido(anchoEquipo: number, anchoResultado: number): number {
  return (
    PADDING_FILA +
    ANCHO_ESCUDO +
    GAP_FILA +
    anchoEquipo +
    GAP_FILA +
    anchoResultado +
    GAP_FILA +
    anchoEquipo +
    GAP_FILA +
    ANCHO_ESCUDO +
    PADDING_FILA
  )
}

/** Parsea un resultado numérico; devuelve null si no hay valor jugable. */
function parseNumeroResultado(s: string | undefined): number | null {
  const t = (s ?? '').trim()
  if (!t || t === '—') return null
  const n = Number(String(t).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

type LadoGanador = 'local' | 'visitante'

function ganadorDelPartido(partido: PartidoEliminacionDirectaDTO): LadoGanador | null {
  const rL = parseNumeroResultado(partido.resultadoLocal)
  const rV = parseNumeroResultado(partido.resultadoVisitante)
  if (rL === null || rV === null) return null
  if (rL > rV) return 'local'
  if (rV > rL) return 'visitante'
  const pL = parseNumeroResultado(partido.penalesLocal)
  const pV = parseNumeroResultado(partido.penalesVisitante)
  if (pL === null || pV === null) return null
  if (pL > pV) return 'local'
  if (pV > pL) return 'visitante'
  return null
}

function esInstanciaFinal(instancia: InstanciasDTO): boolean {
  return (instancia.titulo ?? '').trim().toLowerCase() === 'final'
}

function partidoFinalConResultados(instancia: InstanciasDTO): PartidoEliminacionDirectaDTO | null {
  const partidos = instancia.partidos ?? []
  if (partidos.length === 0) return null
  const p = partidos[0]
  const rL = parseNumeroResultado(p.resultadoLocal)
  const rV = parseNumeroResultado(p.resultadoVisitante)
  if (rL === null || rV === null) return null
  return p
}

function FilaPartido({
  partido,
  apiUrl,
  anchoEquipo,
  anchoResultado,
}: {
  partido: PartidoEliminacionDirectaDTO
  apiUrl: string | undefined
  anchoEquipo: number
  anchoResultado: number
}) {
  const pLoc = textoPenal(partido.penalesLocal)
  const pVis = textoPenal(partido.penalesVisitante)
  const resL = textoOGuion(partido.resultadoLocal)
  const resV = textoOGuion(partido.resultadoVisitante)

  return (
    <View className="flex-row items-center border-b border-gray-100 py-2.5 last:border-b-0 px-2">
      <Escudo uri={partido.escudoLocal} apiUrl={apiUrl} />
      <View
        style={{ width: anchoEquipo, minWidth: anchoEquipo, marginLeft: GAP_FILA }}
        className="shrink-0 justify-center"
      >
        <Text className={`text-right ${CLASS_TEXTO_EQUIPO} text-gray-900`} numberOfLines={2}>
          {textoOGuion(partido.local)}
        </Text>
      </View>
      <View
        style={{ width: anchoResultado, minWidth: anchoResultado, marginLeft: GAP_FILA }}
        className="shrink-0 flex-row items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5"
      >
        <Text className="text-[12px] font-semibold tabular-nums text-gray-800">
          {resL}
          {pLoc != null ? `(${pLoc})` : ''}
        </Text>
        <Text className="shrink-0 px-0.5 text-[12px] font-semibold text-gray-400">vs</Text>
        <Text className="text-[12px] font-semibold tabular-nums text-gray-800">
          {resV}
          {pVis != null ? `(${pVis})` : ''}
        </Text>
      </View>
      <View
        style={{ width: anchoEquipo, minWidth: anchoEquipo, marginLeft: GAP_FILA }}
        className="shrink-0 justify-center"
      >
        <Text className={`text-left ${CLASS_TEXTO_EQUIPO} text-gray-900`} numberOfLines={2}>
          {textoOGuion(partido.visitante)}
        </Text>
      </View>
      <View style={{ marginLeft: GAP_FILA }}>
        <Escudo uri={partido.escudoVisitante} apiUrl={apiUrl} />
      </View>
    </View>
  )
}

function CardInstancia({
  instancia,
  apiUrl,
}: {
  instancia: InstanciasDTO
  apiUrl: string | undefined
}) {
  const partidos = instancia.partidos ?? []
  const nombresEquipos = useMemo(() => partidos.flatMap((p) => [p.local, p.visitante]), [partidos])
  const { anchoEquipo, medidorAnchoEquipo } = useAnchoColumnaEquipo(nombresEquipos, {
    classNameTextoEncabezado: `${CLASS_TEXTO_EQUIPO} font-semibold`,
    classNameTextoContenido: CLASS_TEXTO_EQUIPO,
  })
  const anchoResultado = useMemo(() => anchoResultadoPartidos(partidos), [partidos])
  const anchoFila = anchoFilaPartido(anchoEquipo, anchoResultado)

  return (
    <View className="mb-3">
      {medidorAnchoEquipo}
      <ContenedorTabla
        horizontal={partidos.length > 0}
        encabezado={
          <CabeceraBloque
            titulo={textoOGuion(instancia.titulo)}
            subtitulo={textoOGuion(instancia.dia)}
            centrado
          />
        }
      >
        {partidos.length === 0 ? (
          <Text className="px-3 py-4 text-sm leading-5 text-gray-600">No hay partidos.</Text>
        ) : (
          <View style={{ width: anchoFila, alignSelf: 'flex-start' }} className="py-2">
            {partidos.map((p, i) => (
              <FilaPartido
                key={`${p.local}-${p.visitante}-${i}`}
                partido={p}
                apiUrl={apiUrl}
                anchoEquipo={anchoEquipo}
                anchoResultado={anchoResultado}
              />
            ))}
          </View>
        )}
      </ContenedorTabla>
    </View>
  )
}

function BloqueCampeonFinal({
  partido,
  apiUrl,
}: {
  partido: PartidoEliminacionDirectaDTO
  apiUrl: string | undefined
}) {
  const lado = ganadorDelPartido(partido)
  if (lado === null) return null
  const nombre = lado === 'local' ? partido.local : partido.visitante
  const escudo = lado === 'local' ? partido.escudoLocal : partido.escudoVisitante
  const nombreLimpio = (nombre ?? '').trim()
  if (!nombreLimpio) return null

  return (
    <View className="my-6 items-center px-2 pt-1">
      <Ionicons
        className="mb-2"
        name="trophy"
        size={64}
        color="#ca8a04"
        accessibilityLabel="Trofeo"
      />
      <Escudo uri={escudo} apiUrl={apiUrl} />
      <View className="mt-2 flex-row items-center gap-2">
        <Texto variante="titulo" className="max-w-[220px] text-center text-base" numberOfLines={2}>
          {nombreLimpio}
        </Texto>
      </View>
      <Text className="mt-1 text-center text-md font-semibold uppercase tracking-wide text-amber-400">
        Campeón
      </Text>
    </View>
  )
}

export default function FixtureEliminacionDirecta() {
  const configLiga = useConfigLiga()
  const { zonaId: zonaIdParam } = useLocalSearchParams<{ zonaId?: string }>()

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.fixtureEliminacionDirecta(zonaId),
    activado: zonaId != null,
    fn: () => api.eliminacionDirecta(zonaId),
  })

  if (zonaId == null) {
    return <EstadoVacio mensaje="No hay zona para mostrar el fixture." />
  }

  if (isLoading) {
    return <EstadoCarga />
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center px-2 py-8">
        <Text className="text-center text-red-600">
          {error?.message ?? 'No se pudo cargar el fixture.'}
        </Text>
      </View>
    )
  }

  const instancias = data?.instancias ?? []

  if (instancias.length === 0) {
    return <EstadoVacio mensaje="No hay partidos para esta zona." />
  }

  const apiUrl = configLiga?.apiUrl

  const instanciaFinal = instancias.find((i) => esInstanciaFinal(i))
  const partidoDeLaFinal = instanciaFinal ? partidoFinalConResultados(instanciaFinal) : null

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator
    >
      {instancias.map((inst, idx) => (
        <CardInstancia
          key={`${inst.titulo ?? 'inst'}-${inst.dia ?? idx}-${idx}`}
          instancia={inst}
          apiUrl={apiUrl}
        />
      ))}
      {partidoDeLaFinal != null ? (
        <BloqueCampeonFinal partido={partidoDeLaFinal} apiUrl={apiUrl} />
      ) : null}
    </ScrollView>
  )
}
