import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { temaFranjaCarnet } from '@/lib/utilidades/color-carnet'
import { EstadoCarga, EstadoVacio } from '@/design-system/componentes'
import { JornadasConSelectorFecha } from '@/torneos/_zona-detalle/jornadas/selector-fecha-jornadas'

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

  const temaTorneo = useMemo(() => temaFranjaCarnet({ color: colorAgrupador }), [colorAgrupador])

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
