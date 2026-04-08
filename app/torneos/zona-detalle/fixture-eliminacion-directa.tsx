import React, { useMemo } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { InstanciasDTO, PartidoEliminacionDirectaDTO } from '@/lib/api/clients'
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

function textoPenal(p: string | undefined) {
  const t = (p ?? '').trim()
  return t.length > 0 ? t : null
}

function FilaPartido({
  partido,
  apiUrl,
}: {
  partido: PartidoEliminacionDirectaDTO
  apiUrl: string | undefined
}) {
  const pLoc = textoPenal(partido.penalesLocal)
  const pVis = textoPenal(partido.penalesVisitante)
  const resL = textoOGuion(partido.resultadoLocal)
  const resV = textoOGuion(partido.resultadoVisitante)

  return (
    <View className="flex-row items-center gap-1.5 border-b border-gray-100 py-2.5 last:border-b-0 px-2">
      <Escudo uri={partido.escudoLocal} apiUrl={apiUrl} />
      <Text
        className="min-w-0 flex-1 text-right text-[12px] font-medium text-gray-900"
        numberOfLines={2}
      >
        {textoOGuion(partido.local)}
      </Text>
      <View className="shrink-0 flex-row flex-wrap items-center justify-center gap-x-0.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5">
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
      <Text
        className="min-w-0 flex-1 text-left text-[12px] font-medium text-gray-900"
        numberOfLines={2}
      >
        {textoOGuion(partido.visitante)}
      </Text>
      <Escudo uri={partido.escudoVisitante} apiUrl={apiUrl} />
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
  return (
    <View className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm elevation-3">
      <View className="mb-1 border-b border-gray-200 px-2 py-2">
        <Text className="text-center text-base font-semibold text-gray-900" numberOfLines={2}>
          {textoOGuion(instancia.titulo)}
        </Text>
        <Text className="mt-1 text-center text-sm text-gray-400">{textoOGuion(instancia.dia)}</Text>
      </View>
      {partidos.map((p, i) => (
        <FilaPartido key={`${p.local}-${p.visitante}-${i}`} partido={p} apiUrl={apiUrl} />
      ))}
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
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay zona para mostrar el fixture.</Text>
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
          {error?.message ?? 'No se pudo cargar el fixture.'}
        </Text>
      </View>
    )
  }

  const instancias = data?.instancias ?? []

  if (instancias.length === 0) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay partidos para esta zona.</Text>
      </View>
    )
  }

  const apiUrl = configLiga?.apiUrl

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
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
    </ScrollView>
  )
}
