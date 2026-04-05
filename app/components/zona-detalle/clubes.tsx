import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { EquipoConDatosDelClubDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'

/** La API devuelve ruta relativa (p. ej. `/Imagenes/Escudos/1.jpg`); Image necesita URL absoluta. */
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

function lineaDireccionLocalidad(direccion: string | undefined, localidad: string | undefined) {
  const d = (direccion ?? '').trim()
  const l = (localidad ?? '').trim()
  if (!d && !l) return '—'
  if (!d) return l
  if (!l) return d
  return `${d}, ${l}`
}

/** El API envía "Sí" / "No" (ver `AppCarnetDigitalCore`). */
function textoTechado(esTechado: string | undefined) {
  const t = (esTechado ?? '').trim().toLowerCase()
  if (t === 'sí' || t === 'si' || t === 'yes' || t === 'true') return 'Es techado'
  if (t === 'no' || t === 'false') return 'No es techado'
  return '—'
}

type ClubCardProps = {
  item: EquipoConDatosDelClubDTO
  uriEscudo: string | null
}

function ClubCard({ item, uriEscudo }: ClubCardProps) {
  return (
    <View className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <View className="flex-row items-start gap-3">
        <View style={{ width: 44, height: 44 }} className="items-center justify-center">
          {uriEscudo ? (
            <Image
              source={{ uri: uriEscudo }}
              style={{ width: 44, height: 44 }}
              className="rounded-lg"
              resizeMode="contain"
            />
          ) : (
            <View className="h-11 w-11 rounded-lg bg-gray-100" />
          )}
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-base font-bold leading-5 text-gray-900" numberOfLines={3}>
            {textoOGuion(item.equipo)}
          </Text>
          <Text className="text-sm leading-5 text-gray-500" numberOfLines={4}>
            {lineaDireccionLocalidad(item.direccion, item.localidad)}
          </Text>
          <Text className="text-sm leading-5 text-gray-500" numberOfLines={2}>
            {textoTechado(item.esTechado)}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function Clubes() {
  const configLiga = useConfigLiga()
  const { zonaId: zonaIdParam } = useLocalSearchParams<{ zonaId?: string }>()

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.clubes(zonaId),
    activado: zonaId != null,
    fn: () => api.clubes(zonaId),
  })

  const filas = data ?? []

  const keyExtractor = useCallback((item: EquipoConDatosDelClubDTO, index: number) => {
    return `${item.equipo ?? 'eq'}-${index}`
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: EquipoConDatosDelClubDTO }) => (
      <ClubCard item={item} uriEscudo={uriRecursoPublicoApi(configLiga?.apiUrl, item.escudo)} />
    ),
    [configLiga?.apiUrl]
  )

  if (zonaId == null) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay zona para listar clubes.</Text>
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
      <View className="flex-1 justify-center py-8 px-2">
        <Text className="text-center text-red-600">
          {error?.message ?? 'No se pudieron cargar los clubes.'}
        </Text>
      </View>
    )
  }

  if (filas.length === 0) {
    return (
      <View className="flex-1 justify-center py-8">
        <Text className="text-center text-gray-600">No hay clubes en esta zona.</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={filas}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator
    />
  )
}
