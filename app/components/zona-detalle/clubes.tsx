import React, { useCallback, useMemo } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { EquipoConDatosDelClubDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { TableHeader, TableRow } from '@/app/components/zona-detalle/clubes-table'

/** La API devuelve ruta relativa (p. ej. `/Imagenes/Escudos/1.jpg`); Image necesita URL absoluta. */
function uriRecursoPublicoApi(apiUrl: string | undefined, ruta: string | undefined): string | null {
  const r = (ruta ?? '').trim()
  if (!r) return null
  if (/^(https?:|data:)/i.test(r)) return r
  const base = apiUrl?.trim()
  if (!base) return null
  return `${base.replace(/\/+$/, '')}${r.startsWith('/') ? r : `/${r}`}`
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
  const minAnchoTabla = 560

  const keyExtractor = useCallback((item: EquipoConDatosDelClubDTO, index: number) => {
    return `${item.equipo ?? 'eq'}-${index}`
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: EquipoConDatosDelClubDTO; index: number }) => (
      <TableRow
        item={item}
        index={index}
        uriEscudo={uriRecursoPublicoApi(configLiga?.apiUrl, item.escudo)}
      />
    ),
    [configLiga?.apiUrl]
  )

  const listHeader = useMemo(() => <TableHeader />, [])

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
    <ScrollView
      horizontal
      className="flex-1"
      showsHorizontalScrollIndicator
      bounces
      nestedScrollEnabled
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ minWidth: minAnchoTabla, flex: 1 }}>
        <FlatList
          data={filas}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          renderItem={renderItem}
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </ScrollView>
  )
}
