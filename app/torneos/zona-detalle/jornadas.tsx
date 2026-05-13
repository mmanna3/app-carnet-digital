import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { FechasParaJornadasDTO, JornadaPorEquipoDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { hexCabeceraPorColorAgrupadorApi, useConfigLiga } from '@/lib/config/liga'

function uriRecursoPublicoApi(apiUrl: string | undefined, ruta: string | undefined): string | null {
  const r = (ruta ?? '').trim()
  if (!r) return null
  if (/^(https?:|data:)/i.test(r)) return r
  const base = apiUrl?.trim()
  if (!base) return null
  return `${base.replace(/\/+$/, '')}${r.startsWith('/') ? r : `/${r}`}`
}

function textoOGuion(s: string | undefined) {
  const t = (s ?? '').trim()
  return t.length > 0 ? t : '—'
}

function numeroOGuion(n: number | undefined) {
  return n != null && Number.isFinite(n) ? String(n) : '—'
}

function fechaTieneResultados(fecha: FechasParaJornadasDTO): boolean {
  for (const j of fecha.jornadas ?? []) {
    const cats = categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias)
    for (const c of cats) {
      if ((c.resultado ?? '').trim().length > 0) return true
    }
  }
  return false
}

/** Índice de la última fecha con al menos un resultado cargado; si ninguna, la primera. */
function indiceUltimaFechaConResultados(fechas: FechasParaJornadasDTO[]): number {
  if (fechas.length === 0) return 0
  for (let i = fechas.length - 1; i >= 0; i--) {
    if (fechaTieneResultados(fechas[i])) return i
  }
  return 0
}

/** El API repite la misma lista en local y visitante; `resultado` sigue `FormatearResultadoPartido` (ej. "2 - 1 (3 - 4)"). */
function categoriasResultadoUnico(
  loc: { categoria?: string; resultado?: string }[] | undefined,
  vis: { categoria?: string; resultado?: string }[] | undefined
) {
  const a = loc?.length ? loc : vis
  return a ?? []
}

type MarcadorParseado =
  | { ok: true; local: string; visitante: string }
  | { ok: false; texto: string }

/** Separa el marcador combinado en goles local / visitante (y penales si vienen en paréntesis). */
function parseMarcadorPartido(s: string | undefined): MarcadorParseado {
  const t = (s ?? '').trim()
  if (!t) return { ok: false, texto: '—' }
  const main = t.match(/^(\S+)\s*-\s*(\S+)/)
  if (!main) return { ok: false, texto: t }
  let local = main[1]
  let visitante = main[2]
  const rest = t.slice(main[0].length).trim()
  const pen = rest.match(/^\((\S+)\s*-\s*(\S+)\)\s*$/)
  if (pen) {
    local = `${local} (${pen[1]})`
    visitante = `${visitante} (${pen[2]})`
  }
  return { ok: true, local, visitante }
}

/** Nombres de categoría en orden de aparición (unión de todos los partidos de la fecha). */
function nombresCategoriasDeFecha(fecha: FechasParaJornadasDTO): string[] {
  const seen = new Set<string>()
  const ordered: string[] = []
  for (const j of fecha.jornadas ?? []) {
    for (const row of categoriasResultadoUnico(j.local?.categorias, j.visitante?.categorias)) {
      const n = (row.categoria ?? '').trim()
      if (!n || seen.has(n)) continue
      seen.add(n)
      ordered.push(n)
    }
  }
  return ordered
}

function celdaResultadoCategoria(
  categorias: { categoria?: string; resultado?: string }[] | undefined,
  nombreCategoria: string,
  lado: 'local' | 'visitante'
): string {
  const row = (categorias ?? []).find((r) => (r.categoria ?? '').trim() === nombreCategoria)
  if (!row) return '—'
  const mar = parseMarcadorPartido(row.resultado)
  if (mar.ok) return lado === 'local' ? mar.local : mar.visitante
  if (mar.texto !== '—') return lado === 'local' ? mar.texto : '—'
  return '—'
}

/** `esc` / `equipo` / `pt` / `pj` alineados con posiciones; `cat` más ancho para títulos ~9 caracteres en una línea (padding de Celda). */
const ANCHO = {
  esc: 44,
  equipo: 148,
  cat: 102,
  pt: 40,
  pj: 40,
} as const

function anchoTablaJornadas(nCategorias: number): number {
  return ANCHO.esc + ANCHO.equipo + nCategorias * ANCHO.cat + ANCHO.pt + ANCHO.pj
}

/** Misma idea que `Celda` en posiciones.tsx (sin líneas verticales entre columnas). */
function Celda({
  children,
  ancho,
  alinear = 'left',
  negrita = false,
  tabular = false,
  numberOfLines = 2,
}: {
  children: React.ReactNode
  ancho: number
  alinear?: 'left' | 'center' | 'right'
  negrita?: boolean
  tabular?: boolean
  /** Cabeceras de categoría largas: más líneas para no truncar. */
  numberOfLines?: number
}) {
  const align = alinear === 'center' ? 'center' : alinear === 'right' ? 'right' : 'left'
  return (
    <View style={{ width: ancho, minWidth: ancho }} className="shrink-0 justify-center px-1.5 py-2">
      <Text
        className={`text-sm leading-5 text-gray-800 ${negrita ? 'font-semibold' : ''} ${tabular ? 'tabular-nums' : ''}`}
        style={{ textAlign: align }}
        numberOfLines={numberOfLines}
      >
        {children}
      </Text>
    </View>
  )
}

function FilaEncabezadoTablaJornadas({ nombresCategorias }: { nombresCategorias: string[] }) {
  return (
    <View className="flex-row border-b border-gray-300 bg-gray-100">
      <Celda ancho={ANCHO.esc} alinear="center" negrita>
        Esc
      </Celda>
      <Celda ancho={ANCHO.equipo} alinear="left" negrita>
        Equipo
      </Celda>
      {nombresCategorias.map((cat) => (
        <Celda key={cat} ancho={ANCHO.cat} alinear="center" negrita numberOfLines={4}>
          {cat}
        </Celda>
      ))}
      <Celda ancho={ANCHO.pt} alinear="center" negrita tabular>
        P.T.
      </Celda>
      <Celda ancho={ANCHO.pj} alinear="center" negrita tabular>
        P.J.
      </Celda>
    </View>
  )
}

function FilaEquipoTabla({
  equipo,
  nombresCategorias,
  lado,
  apiUrl,
  visitanteConMasPartidosDebajo,
}: {
  equipo: JornadaPorEquipoDTO | undefined
  nombresCategorias: string[]
  lado: 'local' | 'visitante'
  apiUrl: string | undefined
  /** Solo para la fila visitante: borde más marcado si sigue otro partido. */
  visitanteConMasPartidosDebajo?: boolean
}) {
  const uri = uriRecursoPublicoApi(apiUrl, equipo?.escudo)
  const bordeClase =
    lado === 'local'
      ? 'border-b border-gray-100'
      : visitanteConMasPartidosDebajo
        ? 'border-b border-gray-200'
        : 'border-b border-gray-100'

  return (
    <View className={`flex-row ${bordeClase}`}>
      <View
        style={{ width: ANCHO.esc, minWidth: ANCHO.esc }}
        className="shrink-0 items-center justify-center px-1 py-1.5"
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: 32, height: 32 }}
            className="rounded-md"
            resizeMode="contain"
          />
        ) : (
          <View className="h-8 w-8 rounded-md bg-gray-100" />
        )}
      </View>
      <Celda ancho={ANCHO.equipo} alinear="left">
        {textoOGuion(equipo?.equipo)}
      </Celda>
      {nombresCategorias.map((cat) => (
        <Celda key={cat} ancho={ANCHO.cat} alinear="center" tabular>
          {celdaResultadoCategoria(equipo?.categorias, cat, lado)}
        </Celda>
      ))}
      <Celda ancho={ANCHO.pt} alinear="center" tabular>
        {numeroOGuion(equipo?.puntosTotales)}
      </Celda>
      <Celda ancho={ANCHO.pj} alinear="center" tabular>
        {numeroOGuion(equipo?.partidosJugados)}
      </Celda>
    </View>
  )
}

function CardFechaJornadas({
  fecha,
  apiUrl,
}: {
  fecha: FechasParaJornadasDTO
  apiUrl: string | undefined
}) {
  const jornadas = fecha.jornadas ?? []
  const nombresCategorias = useMemo(() => nombresCategoriasDeFecha(fecha), [fecha])
  const anchoTotal = anchoTablaJornadas(nombresCategorias.length)
  const ultimoIndicePartido = jornadas.length - 1

  return (
    <View className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm elevation-3">
      <View className="mb-1 flex-row items-baseline justify-between gap-2 border-b border-gray-200 px-2 py-2">
        <Text className="shrink text-base font-semibold text-gray-900" numberOfLines={2}>
          {textoOGuion(fecha.titulo)}
        </Text>
        <Text className="shrink-0 text-sm text-gray-500">{textoOGuion(fecha.dia)}</Text>
      </View>
      {jornadas.length === 0 ? (
        <Text className="px-0.5 py-4 text-sm leading-5 text-gray-600">
          No hay partidos en esta fecha.
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
          <View style={{ width: anchoTotal, alignSelf: 'flex-start' }}>
            <FilaEncabezadoTablaJornadas nombresCategorias={nombresCategorias} />
            {jornadas.map((j, i) => {
              const hayMasPartidos = i < ultimoIndicePartido
              return (
                <View key={`${fecha.titulo ?? 'f'}-partido-${i}`}>
                  <FilaEquipoTabla
                    equipo={j.local}
                    nombresCategorias={nombresCategorias}
                    lado="local"
                    apiUrl={apiUrl}
                  />
                  <FilaEquipoTabla
                    equipo={j.visitante}
                    nombresCategorias={nombresCategorias}
                    lado="visitante"
                    apiUrl={apiUrl}
                    visitanteConMasPartidosDebajo={hayMasPartidos}
                  />
                </View>
              )
            })}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default function Jornadas() {
  const configLiga = useConfigLiga()
  const { zonaId: zonaIdParam, color: colorParam } = useLocalSearchParams<{
    zonaId?: string
    color?: string
  }>()

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const colorAgrupador = useMemo(
    () => (colorParam != null && String(colorParam).length > 0 ? String(colorParam) : undefined),
    [colorParam]
  )

  const colorFondoChipSeleccionado = useMemo(
    () => hexCabeceraPorColorAgrupadorApi(colorAgrupador),
    [colorAgrupador]
  )

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.jornadas(zonaId),
    activado: zonaId != null,
    fn: () => api.jornadasTodosContraTodos(zonaId),
  })

  if (zonaId == null) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay zona para mostrar las jornadas.</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center px-2 py-8">
        <Text className="text-center text-red-600">
          {error?.message ?? 'No se pudieron cargar las jornadas.'}
        </Text>
      </View>
    )
  }

  const fechas = data?.fechas ?? []

  if (fechas.length === 0) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay jornadas para esta zona.</Text>
      </View>
    )
  }

  return (
    <JornadasConSelectorFecha
      zonaId={zonaId}
      fechas={fechas}
      apiUrl={configLiga?.apiUrl}
      colorFondoChipSeleccionado={colorFondoChipSeleccionado}
    />
  )
}

type JornadasConSelectorFechaProps = {
  zonaId: number
  fechas: FechasParaJornadasDTO[]
  apiUrl: string | undefined
  colorFondoChipSeleccionado: string
}

function JornadasConSelectorFecha({
  zonaId,
  fechas,
  apiUrl,
  colorFondoChipSeleccionado,
}: JornadasConSelectorFechaProps) {
  const indiceDefault = useMemo(() => indiceUltimaFechaConResultados(fechas), [fechas])

  const [indiceElegido, setIndiceElegido] = useState<number | null>(null)

  useEffect(() => {
    setIndiceElegido(null)
  }, [zonaId])

  const indiceActivo = indiceElegido ?? indiceDefault

  const indiceSeguro = Math.min(Math.max(0, indiceActivo), Math.max(0, fechas.length - 1))

  const fechaMostrada = fechas[indiceSeguro]

  return (
    <View className="flex-1 bg-gray-50">
      <View className="border-b border-gray-200 bg-white px-2 py-2.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          {fechas.map((fecha, index) => {
            const seleccionada = index === indiceSeguro
            return (
              <TouchableOpacity
                key={`fecha-${index}`}
                className={`rounded-full px-4 py-2 ${seleccionada ? '' : 'bg-gray-200'}`}
                style={seleccionada ? { backgroundColor: colorFondoChipSeleccionado } : undefined}
                onPress={() => setIndiceElegido(index)}
                accessibilityRole="button"
                accessibilityState={{ selected: seleccionada }}
                accessibilityLabel={textoOGuion(fecha.titulo)}
              >
                <Text
                  className={`text-sm font-semibold ${seleccionada ? 'text-white' : 'text-gray-800'}`}
                  numberOfLines={1}
                >
                  {textoOGuion(fecha.titulo)}
                </Text>
              </TouchableOpacity>
            )
          })}
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
