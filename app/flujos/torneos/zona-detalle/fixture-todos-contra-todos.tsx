import React, { useMemo } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { CabeceraBloque, ContenedorTabla, EstadoCarga, EstadoVacio } from '@/design-system/componentes'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { FixtureFechaDTO, FixturePartidoDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'

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

function FilaPartido({
  partido,
  apiUrl,
}: {
  partido: FixturePartidoDTO
  apiUrl: string | undefined
}) {
  return (
    <View className="flex-row items-center gap-2 border-b border-gray-100 py-2.5 last:border-b-0 px-2">
      <Escudo uri={partido.localEscudo} apiUrl={apiUrl} />
      <Text
        className="min-w-0 flex-1 text-sm text-right font-medium text-gray-900"
        numberOfLines={2}
      >
        {textoOGuion(partido.local)}
      </Text>
      <Text className="shrink-0 px-1 text-xs font-semibold text-gray-400">vs</Text>
      <Text
        className="min-w-0 flex-1 text-left text-sm font-medium text-gray-900"
        numberOfLines={2}
      >
        {textoOGuion(partido.visitante)}
      </Text>
      <Escudo uri={partido.visitanteEscudo} apiUrl={apiUrl} />
    </View>
  )
}

function CardFecha({ fecha, apiUrl }: { fecha: FixtureFechaDTO; apiUrl: string | undefined }) {
  const partidos = fecha.partidos ?? []
  return (
    <View className="mb-3">
      <ContenedorTabla>
        <CabeceraBloque titulo={textoOGuion(fecha.titulo)} subtitulo={textoOGuion(fecha.dia)} />
        <View className="px-3 py-2">
          {partidos.map((p, i) => (
            <FilaPartido key={`${p.local}-${p.visitante}-${i}`} partido={p} apiUrl={apiUrl} />
          ))}
        </View>
      </ContenedorTabla>
    </View>
  )
}

export default function FixtureTodosContraTodos() {
  const configLiga = useConfigLiga()
  const { zonaId: zonaIdParam } = useLocalSearchParams<{ zonaId?: string }>()

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.fixture(zonaId),
    activado: zonaId != null,
    fn: () => api.fixtureTodosContraTodos(zonaId),
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

  const fechas = data?.fechas ?? []

  if (fechas.length === 0) {
    return <EstadoVacio mensaje="No hay fechas para esta zona." />
  }

  const apiUrl = configLiga?.apiUrl

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator
    >
      {fechas.map((f, idx) => (
        <CardFecha
          key={`${f.titulo ?? 'fecha'}-${f.dia ?? idx}-${idx}`}
          fecha={f}
          apiUrl={apiUrl}
        />
      ))}
    </ScrollView>
  )
}
