import React, { useState } from 'react'
import {
  Alert,
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'

interface Props {
  jugador: CarnetDigitalDTO | null
  onEliminado: () => void
  onCerrar: () => void
}

export default function ModalEliminarJugador({ jugador, onEliminado, onCerrar }: Props) {
  const [cargando, setCargando] = useState(false)

  if (!jugador) return null

  const handleEliminar = async () => {
    if (!jugador.id) return
    setCargando(true)
    try {
      await api.jugadorDELETE(jugador.id)
      onEliminado()
    } catch (err) {
      Alert.alert('Error al eliminar', parseApiError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <Modal transparent animationType="fade" visible={!!jugador} onRequestClose={onCerrar}>
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl w-full overflow-hidden">
          <View className="p-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Eliminar jugador</Text>
            <Text className="text-base text-gray-600 leading-6">
              ¿Estás seguro que querés eliminar este jugador? Los datos se perderán para siempre y no
              podrán ser recuperados.
            </Text>
          </View>

          <View className="px-4 pb-4 gap-3">
            <TouchableOpacity
              className="bg-red-600 rounded-xl p-4 items-center"
              onPress={handleEliminar}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Eliminar jugador del sistema
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
