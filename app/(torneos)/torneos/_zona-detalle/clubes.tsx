import React, { useCallback, useMemo } from 'react'
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import type { ClubesDTO } from '@/lib/api/clients'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { hexLinkAgrupadorOnLight } from '@/lib/design-system'
import { EstadoCarga, EstadoVacio } from '@/design-system/componentes'

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

function urlGoogleMaps(direccion: string | undefined, localidad: string | undefined): string | null {
  const query = lineaDireccionLocalidad(direccion, localidad)
  if (query === '—') return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

type DireccionClubProps = {
  direccion: string | undefined
  localidad: string | undefined
  colorLink: string
}

function DireccionClub({ direccion, localidad, colorLink }: DireccionClubProps) {
  const texto = lineaDireccionLocalidad(direccion, localidad)
  const url = urlGoogleMaps(direccion, localidad)

  if (!url) {
    return (
      <Text className="text-base leading-6 text-zinc-600" numberOfLines={4}>
        {texto}
      </Text>
    )
  }

  return (
    <TouchableOpacity
      onPress={() => void Linking.openURL(url)}
      activeOpacity={0.7}
      accessibilityRole="link"
      accessibilityLabel={`Abrir en Google Maps: ${texto}`}
      className="flex-row items-start gap-1.5"
    >
      <Ionicons name="location-outline" size={18} color={colorLink} style={{ marginTop: 2 }} />
      <Text
        className="min-w-0 flex-1 text-base leading-6 underline"
        style={{ color: colorLink }}
        numberOfLines={4}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  )
}

type ClubCardProps = {
  item: ClubesDTO
  uriEscudo: string | null
  colorLink: string
}

function ClubCard({ item, uriEscudo, colorLink }: ClubCardProps) {
  return (
    <View className="rounded-2xl border border-zinc-700 bg-white px-5 py-4">
      <View className="flex-row items-center gap-4">
        <View style={{ width: 50, height: 50 }} className="shrink-0 items-center justify-center">
          {uriEscudo ? (
            <Image
              source={{ uri: uriEscudo }}
              style={{ width: 50, height: 50 }}
              className="rounded-lg"
              resizeMode="contain"
            />
          ) : (
            <View className="h-11 w-11 rounded-lg bg-zinc-100" />
          )}
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-lg font-bold leading-6 text-zinc-900" numberOfLines={3}>
            {textoOGuion(item.equipo)}
          </Text>
          <DireccionClub
            direccion={item.direccion}
            localidad={item.localidad}
            colorLink={colorLink}
          />
          <Text className="text-base leading-6 text-zinc-600" numberOfLines={2}>
            Cancha: {textoOGuion(item.tipoCancha)}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default function Clubes() {
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

  const colorLink = useMemo(() => hexLinkAgrupadorOnLight(colorAgrupador), [colorAgrupador])

  const { data, isLoading, isError, error } = useApiQuery({
    key: queryKeys.zonas.clubes(zonaId),
    activado: zonaId != null,
    fn: () => api.clubes(zonaId),
  })

  const filas = data ?? []

  const keyExtractor = useCallback((item: ClubesDTO, index: number) => {
    return `${item.equipo ?? 'eq'}-${index}`
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: ClubesDTO }) => (
      <ClubCard
        item={item}
        uriEscudo={uriRecursoPublicoApi(configLiga?.apiUrl, item.escudo)}
        colorLink={colorLink}
      />
    ),
    [configLiga?.apiUrl, colorLink]
  )

  if (zonaId == null) {
    return <EstadoVacio mensaje="No hay zona para listar clubes." />
  }

  if (isLoading) {
    return <EstadoCarga />
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
    return <EstadoVacio mensaje="No hay clubes en esta zona." />
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
