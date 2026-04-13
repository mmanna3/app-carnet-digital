import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { FechasParaJornadasDTO, JornadasPorFechaDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { hexCabeceraPorColorAgrupadorApi, useConfigLiga } from '@/lib/config/liga'
import { estiloAccentoPorColor } from '@/components/tarjeta-con-fondo-de-color'

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

function Escudo({ uri, apiUrl }: { uri: string | undefined; apiUrl: string | undefined }) {
  const u = uriRecursoPublicoApi(apiUrl, uri)
  return (
    <View style={{ width: 36, height: 36 }} className="shrink-0 items-center justify-center">
      {u ? (
        <Image
          source={{ uri: u }}
          style={{ width: 36, height: 36 }}
          className="rounded-md"
          resizeMode="contain"
        />
      ) : (
        <View className="h-9 w-9 rounded-md bg-gray-100" />
      )}
    </View>
  )
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

function FilaJornada({
  par,
  apiUrl,
  colorCategoria,
}: {
  par: JornadasPorFechaDTO
  apiUrl: string | undefined
  colorCategoria: string
}) {
  const local = par.local
  const visitante = par.visitante
  const categorias = categoriasResultadoUnico(local?.categorias, visitante?.categorias)

  return (
    <View className="border-b border-gray-100 py-2.5 last:border-b-0">
      <View className="flex-row items-center gap-1.5 px-2">
        <Escudo uri={local?.escudo} apiUrl={apiUrl} />
        <View className="min-w-0 flex-1 items-end justify-center">
          <Text className="text-right text-sm font-medium text-gray-900" numberOfLines={2}>
            {textoOGuion(local?.equipo)}
          </Text>
        </View>
        <View className="w-[52px] shrink-0 items-center justify-center">
          <Text className="text-xs font-semibold text-gray-400">vs</Text>
        </View>
        <View className="min-w-0 flex-1 items-start justify-center">
          <Text className="text-left text-sm font-medium text-gray-900" numberOfLines={2}>
            {textoOGuion(visitante?.equipo)}
          </Text>
        </View>
        <Escudo uri={visitante?.escudo} apiUrl={apiUrl} />
      </View>
      {categorias.length > 0 && (
        <View className="mt-2.5 gap-2 rounded-lg bg-gray-100 px-1.5 py-2.5">
          {categorias.map((row, i) => {
            const mar = parseMarcadorPartido(row.resultado)
            return (
              <View key={`${row.categoria}-${i}`} className="flex-row items-center gap-1.5 px-1.5">
                <View style={{ width: 36 }} />
                <View className="min-w-0 flex-1 justify-center">
                  {mar.ok ? (
                    <Text
                      className="text-right text-sm font-semibold tabular-nums text-gray-800"
                      numberOfLines={2}
                    >
                      {mar.local}
                    </Text>
                  ) : (
                    <Text className="text-right text-xs text-gray-400">—</Text>
                  )}
                </View>
                <View className="min-w-[52px] max-w-[40%] shrink items-center justify-center px-0.5">
                  <Text
                    className="text-center text-xs font-semibold leading-4"
                    style={{ color: colorCategoria }}
                    numberOfLines={3}
                  >
                    {textoOGuion(row.categoria)}
                  </Text>
                  {!mar.ok && mar.texto !== '—' ? (
                    <Text
                      className="mt-0.5 text-center text-[11px] leading-4 text-gray-800"
                      numberOfLines={3}
                    >
                      {mar.texto}
                    </Text>
                  ) : null}
                </View>
                <View className="min-w-0 flex-1 justify-center">
                  {mar.ok ? (
                    <Text
                      className="text-left text-sm font-semibold tabular-nums text-gray-800"
                      numberOfLines={2}
                    >
                      {mar.visitante}
                    </Text>
                  ) : (
                    <Text className="text-left text-xs text-gray-400">—</Text>
                  )}
                </View>
                <View style={{ width: 36 }} />
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

function CardFechaJornadas({
  fecha,
  apiUrl,
  colorCategoria,
}: {
  fecha: FechasParaJornadasDTO
  apiUrl: string | undefined
  colorCategoria: string
}) {
  const jornadas = fecha.jornadas ?? []
  return (
    <View className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm elevation-3">
      <View className="mb-1 flex-row items-baseline justify-between gap-2 border-b border-gray-200 px-2 py-2">
        <Text className="shrink text-base font-semibold text-gray-900" numberOfLines={2}>
          {textoOGuion(fecha.titulo)}
        </Text>
        <Text className="shrink-0 text-sm text-gray-500">{textoOGuion(fecha.dia)}</Text>
      </View>
      {jornadas.map((j, i) => (
        <FilaJornada
          key={`${fecha.titulo ?? 'f'}-${i}`}
          par={j}
          apiUrl={apiUrl}
          colorCategoria={colorCategoria}
        />
      ))}
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

  const colorCategoria = useMemo(
    () => estiloAccentoPorColor(colorAgrupador).iconoColor,
    [colorAgrupador]
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
      colorCategoria={colorCategoria}
      colorFondoChipSeleccionado={colorFondoChipSeleccionado}
    />
  )
}

type JornadasConSelectorFechaProps = {
  zonaId: number
  fechas: FechasParaJornadasDTO[]
  apiUrl: string | undefined
  colorCategoria: string
  colorFondoChipSeleccionado: string
}

function JornadasConSelectorFecha({
  zonaId,
  fechas,
  apiUrl,
  colorCategoria,
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
          <CardFechaJornadas
            fecha={fechaMostrada}
            apiUrl={apiUrl}
            colorCategoria={colorCategoria}
          />
        </ScrollView>
      ) : null}
    </View>
  )
}
