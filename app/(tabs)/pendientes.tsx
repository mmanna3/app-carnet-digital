import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { queryKeys } from '@/lib/api/query-keys'
import Carnet from '../components/carnet'
import { EstadoJugador } from '@/lib/types/estado-jugador'

export default function PendientesScreen() {
  const { equipoSeleccionadoId } = useEquipoStore()

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
      <View className="flex-1 bg-[#f8f8f8]">
        <Text className="text-base text-center p-5">Debes seleccionar un equipo primero</Text>
      </View>
    )
  }

  if (isLoading) {
    return <Text className="text-base text-center p-5">Cargando jugadores pendientes...</Text>
  }

  if (isError || !jugadores) {
    return (
      <Text className="text-base text-center p-5">Error al cargar los jugadores pendientes.</Text>
    )
  }

  const jugadoresRechazados = jugadores.filter((j) => j.estado === EstadoJugador.FichajeRechazado)
  const jugadoresPendientes = jugadores.filter(
    (j) => j.estado === EstadoJugador.FichajePendienteDeAprobacion
  )
  const jugadoresAprobadosPendientesDePago = jugadores.filter(
    (j) => j.estado === EstadoJugador.AprobadoPendienteDePago
  )

  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      <View className="p-2.5">
        {jugadoresRechazados.length > 0 && (
          <View>
            <View style={{ backgroundColor: '#EF5350' }} className="p-3 mb-4 rounded-lg shadow-md">
              <Text className="text-white text-lg font-bold text-center">Fichajes Rechazados</Text>
            </View>
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
            <View style={{ backgroundColor: '#2513c2' }} className="p-3 mb-4 rounded-lg shadow-md">
              <Text className="text-white text-lg font-bold text-center">Pendientes de Pago</Text>
            </View>
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
            <View style={{ backgroundColor: '#FFA726' }} className="p-3 mb-4 rounded-lg shadow-md">
              <Text className="text-white text-lg font-bold text-center">
                Pendientes de Aprobación
              </Text>
            </View>
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
            <Text className="text-base text-center p-5">No hay jugadores pendientes</Text>
          )}
      </View>
    </ScrollView>
  )
}
