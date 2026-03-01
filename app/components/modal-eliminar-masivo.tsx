import React, { useState } from 'react'
import {
  Alert,
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { CarnetDigitalDTO, DesvincularJugadorDelEquipoDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'

interface Props {
  jugadores: CarnetDigitalDTO[] | null
  equipoId: number | null | undefined
  onEliminado: () => void
  onCerrar: () => void
}

export default function ModalEliminarMasivo({ jugadores, equipoId, onEliminado, onCerrar }: Props) {
  const [cargando, setCargando] = useState(false)

  if (!jugadores) return null

  const handleDesvincular = async () => {
    if (!equipoId) return
    setCargando(true)
    try {
      await Promise.all(
        jugadores.map((j) =>
          api.desvincularJugadorDelEquipo(
            new DesvincularJugadorDelEquipoDTO({ jugadorId: j.id!, equipoId })
          )
        )
      )
      onEliminado()
    } catch (err) {
      Alert.alert('Error al desvincular', parseApiError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal transparent animationType="fade" visible={!!jugadores} onRequestClose={onCerrar}>
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl w-full overflow-hidden max-h-[80%]">
          <View className="p-6 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Quitar jugadores del equipo
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              ¿Estás seguro que querés eliminar estos jugadores del equipo? Los jugadores que juegan
              en otros equipos no se eliminarán de ellos.
            </Text>
          </View>

          <ScrollView className="max-h-60">
            {jugadores.map((jugador) => (
              <View key={jugador.id} className="px-6 py-3 border-b border-gray-100">
                <Text className="text-base text-gray-800">
                  {jugador.nombre} {jugador.apellido} - DNI: {jugador.dni}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View className="px-4 pb-4 pt-3 gap-3">
            <TouchableOpacity
              className="bg-red-600 rounded-xl p-4 items-center"
              onPress={handleDesvincular}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Quitar {jugadores.length} jugadores del equipo
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-xl p-4 items-center"
              onPress={onCerrar}
              disabled={cargando}
            >
              <Text className="text-gray-500 text-base">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
