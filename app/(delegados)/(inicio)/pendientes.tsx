import React, { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { queryKeys } from '@/lib/api/query-keys'
import Carnet from '@/delegados/_components/mis-jugadores/carnet'
import { FranjaSeccion, COLOR_TARJETA } from '@/design-system/componentes'
import { EstadoJugador } from '@/lib/types/estado-jugador'

export default function PendientesScreen() {
  const { equipoSeleccionadoId } = useEquipoStore()
  const queryClient = useQueryClient()

  const [refreshing, setRefreshing] = useState(false)

  const {
    data: jugadores,
    isLoading,
    isError,
  } = useApiQuery({
    key: queryKeys.jugadores.pendientes(equipoSeleccionadoId),
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado')
      return await api.jugadoresPendientes(equipoSeleccionadoId)
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId,
  })

  if (!equipoSeleccionadoId) {
    return (
      <View className="flex-1 bg-surface">
        <Text className="text-base text-center p-5 text-zinc-400">
          Debes seleccionar un equipo primero
        </Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center gap-3">
        <ActivityIndicator size="large" color="#a1a1aa" />
        <Text className="text-base text-zinc-400">Cargando jugadores...</Text>
      </View>
    )
  }

  if (isError || !jugadores) {
    return (
      <View className="flex-1 bg-surface items-center justify-center p-5">
        <Text className="text-base text-center text-zinc-400">
          Error al cargar los jugadores pendientes.
        </Text>
      </View>
    )
  }

  const jugadoresRechazados = jugadores.filter((j) => j.estado === EstadoJugador.FichajeRechazado)
  const jugadoresPendientes = jugadores.filter(
    (j) => j.estado === EstadoJugador.FichajePendienteDeAprobacion
  )
  const jugadoresAprobadosPendientesDePago = jugadores.filter(
    (j) => j.estado === EstadoJugador.AprobadoPendienteDePago
  )

  const handleActualizar = async () => {
    if (!equipoSeleccionadoId) return
    setRefreshing(true)
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: queryKeys.carnets.byEquipo(equipoSeleccionadoId) }),
        queryClient.refetchQueries({
          queryKey: queryKeys.jugadores.pendientes(equipoSeleccionadoId),
        }),
      ])
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <ScrollView
      testID="pantalla-pendientes"
      className="flex-1 bg-surface"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleActualizar} />}
    >
      <View className="p-2.5">
        {jugadoresRechazados.length > 0 && (
          <View>
            <FranjaSeccion tema={COLOR_TARJETA.ROJO}>Fichajes Rechazados</FranjaSeccion>
            {jugadoresRechazados.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={true}
              />
            ))}
          </View>
        )}

        {jugadoresAprobadosPendientesDePago.length > 0 && (
          <View>
            <FranjaSeccion tema={COLOR_TARJETA.AZUL}>Pendientes de Pago</FranjaSeccion>
            {jugadoresAprobadosPendientesDePago.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={false}
              />
            ))}
          </View>
        )}

        {jugadoresPendientes.length > 0 && (
          <View>
            <FranjaSeccion tema="ambar">Pendientes de Aprobación</FranjaSeccion>
            {jugadoresPendientes.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={true}
              />
            ))}
          </View>
        )}

        {jugadoresRechazados.length === 0 &&
          jugadoresPendientes.length === 0 &&
          jugadoresAprobadosPendientesDePago.length === 0 && (
            <Text className="text-base text-center p-5 text-zinc-400">
              No hay jugadores pendientes
            </Text>
          )}
      </View>
    </ScrollView>
  )
}
