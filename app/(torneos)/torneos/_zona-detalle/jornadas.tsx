import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { FechasParaJornadasDTO, JornadaPorEquipoDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { temaFranjaCarnet } from '@/lib/utilidades/color-carnet'
import {
  ContenedorTabla,
  EstadoCarga,
  EstadoVacio,
  FranjaSeccion,
  Texto,
  type TemaFranja,
} from '@/design-system/componentes'

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

/** Ancho por header: el título manda (contenido ≤ 2 caracteres). Misma lógica para P.T. / P.J. */
const ANCHO_CHAR_HEADER = 9
const PADDING_HEADER = 16
const ANCHO_MIN_COL = 28

function anchoColumnaPorHeader(texto: string): number {
  const n = texto.trim().length
  return Math.max(ANCHO_MIN_COL, n * ANCHO_CHAR_HEADER + PADDING_HEADER)
}

const ANCHO = {
  esc: 44,
  equipo: 148,
  pt: anchoColumnaPorHeader('P.T.'),
  pj: anchoColumnaPorHeader('P.J.'),
} as const

function anchosColumnasCategorias(nombres: string[]): number[] {
  return nombres.map(anchoColumnaPorHeader)
}

function anchoTablaJornadas(nombresCategorias: string[]): number {
  const cats = anchosColumnasCategorias(nombresCategorias)
  return ANCHO.esc + ANCHO.equipo + cats.reduce((a, b) => a + b, 0) + ANCHO.pt + ANCHO.pj
}

function numeroDeTituloFecha(titulo: string | undefined): string {
  const t = (titulo ?? '').trim()
  const sinPrefijo = t.replace(/^Fecha\s+/i, '').trim()
  return sinPrefijo.length > 0 ? sinPrefijo : textoOGuion(titulo)
}

/** Mismo diámetro para seleccionada y no seleccionada → círculo, no óvalo. */
const DIAMETRO_PILL_JORNADA = 48

function clasePaddingCelda(encabezado: boolean, borde?: 'inicio' | 'fin'): string {
  const py = 'py-2.5'
  if (borde === 'inicio') return encabezado ? `pl-3 pr-2 ${py}` : `pl-3 pr-1.5 ${py}`
  if (borde === 'fin') return encabezado ? `pl-2 pr-3 ${py}` : `pl-1.5 pr-3 ${py}`
  return encabezado ? `px-2 ${py}` : `px-1.5 ${py}`
}

/** Misma idea que `Celda` en posiciones.tsx (sin líneas verticales entre columnas). */
function Celda({
  children,
  ancho,
  alinear = 'left',
  negrita = false,
  tabular = false,
  numberOfLines = 2,
  encabezado = false,
  borde,
}: {
  children: React.ReactNode
  ancho: number
  alinear?: 'left' | 'center' | 'right'
  negrita?: boolean
  tabular?: boolean
  numberOfLines?: number
  encabezado?: boolean
  borde?: 'inicio' | 'fin'
}) {
  const align = alinear === 'center' ? 'center' : alinear === 'right' ? 'right' : 'left'
  const colorTexto = encabezado ? 'text-zinc-100' : 'text-gray-900'
  return (
    <View
      style={{ width: ancho, minWidth: ancho }}
      className={`shrink-0 justify-center ${clasePaddingCelda(encabezado, borde)}`}
    >
      <Text
        className={`text-base leading-6 ${encabezado ? 'font-semibold' : 'font-medium'} ${colorTexto} ${tabular ? 'tabular-nums' : ''}`}
        style={{ textAlign: align }}
        numberOfLines={numberOfLines}
      >
        {children}
      </Text>
    </View>
  )
}

function FilaEncabezadoTablaJornadas({
  nombresCategorias,
  anchosCategorias,
}: {
  nombresCategorias: string[]
  anchosCategorias: number[]
}) {
  return (
    <View className="flex-row rounded-t-2xl border-b border-zinc-700 bg-zinc-900">
      <Celda ancho={ANCHO.esc} alinear="center" negrita encabezado borde="inicio">
        Esc
      </Celda>
      <Celda ancho={ANCHO.equipo} alinear="left" negrita encabezado>
        Equipo
      </Celda>
      {nombresCategorias.map((cat, i) => (
        <Celda key={cat} ancho={anchosCategorias[i]} alinear="center" negrita encabezado>
          {cat}
        </Celda>
      ))}
      <Celda ancho={ANCHO.pt} alinear="center" negrita encabezado tabular>
        P.T.
      </Celda>
      <Celda ancho={ANCHO.pj} alinear="center" negrita encabezado tabular borde="fin">
        P.J.
      </Celda>
    </View>
  )
}

function FilaEquipoTabla({
  equipo,
  nombresCategorias,
  anchosCategorias,
  lado,
  apiUrl,
  visitanteConMasPartidosDebajo,
}: {
  equipo: JornadaPorEquipoDTO | undefined
  nombresCategorias: string[]
  anchosCategorias: number[]
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
        className="shrink-0 items-center justify-center py-1.5 pl-3 pr-1"
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
      {nombresCategorias.map((cat, i) => (
        <Celda key={cat} ancho={anchosCategorias[i]} alinear="center" tabular>
          {celdaResultadoCategoria(equipo?.categorias, cat, lado)}
        </Celda>
      ))}
      <Celda ancho={ANCHO.pt} alinear="center" tabular>
        {numeroOGuion(equipo?.puntosTotales)}
      </Celda>
      <Celda ancho={ANCHO.pj} alinear="center" tabular borde="fin">
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
  const anchosCategorias = useMemo(
    () => anchosColumnasCategorias(nombresCategorias),
    [nombresCategorias]
  )
  const anchoTotal = anchoTablaJornadas(nombresCategorias)
  const ultimoIndicePartido = jornadas.length - 1

  return (
    <View className="mb-3">
      <Texto
        variante="titulo"
        className={`mb-1 px-0.5 text-center text-zinc-100 ${Platform.OS === 'web' ? 'text-2xl' : 'text-xl'}`}
        numberOfLines={2}
      >
        {textoOGuion(fecha.titulo)}
      </Texto>
      <Texto className="mb-3 text-center text-md  text-zinc-300" numberOfLines={1}>
        {textoOGuion(fecha.dia)}
      </Texto>
      <ContenedorTabla horizontal={jornadas.length > 0}>
        {jornadas.length === 0 ? (
          <Text className="px-3 py-4 text-sm leading-5 text-gray-600">
            No hay partidos en esta fecha.
          </Text>
        ) : (
          <View style={{ width: anchoTotal, alignSelf: 'flex-start' }}>
            <FilaEncabezadoTablaJornadas
              nombresCategorias={nombresCategorias}
              anchosCategorias={anchosCategorias}
            />
            {jornadas.map((j, i) => {
              const hayMasPartidos = i < ultimoIndicePartido
              return (
                <View key={`${fecha.titulo ?? 'f'}-partido-${i}`}>
                  <FilaEquipoTabla
                    equipo={j.local}
                    nombresCategorias={nombresCategorias}
                    anchosCategorias={anchosCategorias}
                    lado="local"
                    apiUrl={apiUrl}
                  />
                  <FilaEquipoTabla
                    equipo={j.visitante}
                    nombresCategorias={nombresCategorias}
                    anchosCategorias={anchosCategorias}
                    lado="visitante"
                    apiUrl={apiUrl}
                    visitanteConMasPartidosDebajo={hayMasPartidos}
                  />
                </View>
              )
            })}
          </View>
        )}
      </ContenedorTabla>
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

  const temaTorneo = useMemo(
    () => temaFranjaCarnet({ color: colorAgrupador }),
    [colorAgrupador]
  )

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.jornadas(zonaId),
    activado: zonaId != null,
    fn: () => api.jornadasTodosContraTodos(zonaId),
  })

  if (zonaId == null) {
    return <EstadoVacio mensaje="No hay zona para mostrar las jornadas." />
  }

  if (isLoading) {
    return <EstadoCarga />
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
    return <EstadoVacio mensaje="No hay jornadas para esta zona." />
  }

  return (
    <JornadasConSelectorFecha
      key={zonaId}
      fechas={fechas}
      apiUrl={configLiga?.apiUrl}
      temaTorneo={temaTorneo}
    />
  )
}

type JornadasConSelectorFechaProps = {
  fechas: FechasParaJornadasDTO[]
  apiUrl: string | undefined
  temaTorneo: TemaFranja
}

function JornadasConSelectorFecha({ fechas, apiUrl, temaTorneo }: JornadasConSelectorFechaProps) {
  const indiceDefault = useMemo(() => indiceUltimaFechaConResultados(fechas), [fechas])

  const [indiceElegido, setIndiceElegido] = useState<number | null>(null)

  const indiceActivo = indiceElegido ?? indiceDefault

  const indiceSeguro = Math.min(Math.max(0, indiceActivo), Math.max(0, fechas.length - 1))

  const fechaMostrada = fechas[indiceSeguro]

  const scrollRef = useRef<ScrollView>(null)
  const pillLayouts = useRef<Map<number, { x: number; width: number }>>(new Map())
  const anchoScroll = useRef(0)

  const scrollHastaIndice = useCallback((index: number, animated: boolean) => {
    const layout = pillLayouts.current.get(index)
    if (!layout || !scrollRef.current) return
    const offset = layout.x - (anchoScroll.current / 2 - layout.width / 2)
    scrollRef.current.scrollTo({ x: Math.max(0, offset), animated })
  }, [])

  const esSeleccionUsuario = indiceElegido !== null

  useEffect(() => {
    scrollHastaIndice(indiceSeguro, esSeleccionUsuario)
  }, [indiceSeguro, esSeleccionUsuario, scrollHastaIndice])

  const onPillLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout
      pillLayouts.current.set(index, { x, width })
      if (index === indiceSeguro) {
        scrollHastaIndice(index, esSeleccionUsuario)
      }
    },
    [indiceSeguro, esSeleccionUsuario, scrollHastaIndice]
  )

  return (
    <View className="flex-1">
      <View className="z-[1] border-b border-border-glass bg-surface-elevated py-2.5">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center' }}
          onLayout={(e) => {
            anchoScroll.current = e.nativeEvent.layout.width
            scrollHastaIndice(indiceSeguro, esSeleccionUsuario)
          }}
        >
          {fechas.map((fecha, index) => {
            const seleccionada = index === indiceSeguro
            const label = numeroDeTituloFecha(fecha.titulo)

            if (seleccionada) {
              return (
                <View key={`fecha-${index}`} onLayout={(e) => onPillLayout(index, e)}>
                  <FranjaSeccion
                    variante="pill"
                    tema={temaTorneo}
                    className="mx-1.5 mb-0 items-center justify-center p-0"
                    style={{
                      width: DIAMETRO_PILL_JORNADA,
                      height: DIAMETRO_PILL_JORNADA,
                    }}
                    onPress={() => setIndiceElegido(index)}
                  >
                    {label}
                  </FranjaSeccion>
                </View>
              )
            }

            return (
              <TouchableOpacity
                key={`fecha-${index}`}
                className="mx-1.5 items-center justify-center rounded-full border border-border-glass bg-white/10"
                style={{ width: DIAMETRO_PILL_JORNADA, height: DIAMETRO_PILL_JORNADA }}
                onLayout={(e) => onPillLayout(index, e)}
                onPress={() => setIndiceElegido(index)}
                accessibilityRole="button"
                accessibilityState={{ selected: false }}
                accessibilityLabel={textoOGuion(fecha.titulo)}
              >
                <Texto
                  variante="titulo"
                  className={`${Platform.OS === 'web' ? 'text-xl' : 'text-lg'} text-center text-zinc-400`}
                  numberOfLines={1}
                >
                  {label}
                </Texto>
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
