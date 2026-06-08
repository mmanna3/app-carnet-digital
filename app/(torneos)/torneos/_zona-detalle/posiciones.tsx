import React, { useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'
import { EstadoCarga, EstadoVacio } from '@/design-system/componentes'
import { TablaCategoria } from '@/torneos/_zona-detalle/posiciones/tabla-posiciones'

export default function Posiciones() {
  const configLiga = useConfigLiga()
  const grande = usePantallaGrande()
  const { zonaId: zonaIdParam, tipoDeFase: tipoDeFaseParam } = useLocalSearchParams<{
    zonaId?: string
    tipoDeFase?: string
  }>()
  const esAnual = (tipoDeFaseParam != null ? String(tipoDeFaseParam) : '') === 'Anual'

  const zonaId = useMemo(() => {
    if (zonaIdParam == null || zonaIdParam === '') return undefined
    const n = Number(zonaIdParam)
    return Number.isFinite(n) ? n : undefined
  }, [zonaIdParam])

  const { data, isLoading, isError, error } = useApiQuery({
    key: esAnual ? queryKeys.zonas.posicionesAnual(zonaId) : queryKeys.zonas.posiciones(zonaId),
    activado: zonaId != null,
    fn: () => (esAnual ? api.posicionesAnual(zonaId) : api.posicionesTodosContraTodos(zonaId)),
  })

  const apiUrl = configLiga?.apiUrl

  if (zonaId == null) {
    return <EstadoVacio mensaje="No hay zona para mostrar posiciones." />
  }

  if (isLoading) {
    return <EstadoCarga />
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center px-2 py-8">
        <Text className="text-center text-red-600">
          {error?.message ?? 'No se pudieron cargar las posiciones.'}
        </Text>
      </View>
    )
  }

  const categorias = data?.posiciones ?? []
  const mostrarGoles = data?.verGoles !== false

  if (categorias.length === 0) {
    return <EstadoVacio mensaje="No hay posiciones para esta zona." />
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: 24,
        alignItems: grande ? 'center' : 'stretch',
      }}
      showsVerticalScrollIndicator
    >
      {categorias.map((bloque, idx) => (
        <TablaCategoria
          key={`${bloque.categoria ?? 'cat'}-${idx}`}
          bloque={bloque}
          apiUrl={apiUrl}
          mostrarGoles={mostrarGoles}
        />
      ))}
    </ScrollView>
  )
}
