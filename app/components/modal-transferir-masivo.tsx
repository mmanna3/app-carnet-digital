import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { CarnetDigitalDTO, EfectuarPaseDTO, EquipoBaseDTO } from '@/app/api/clients'
import { api } from '@/app/api/api'
import useApiQuery from '@/app/api/custom-hooks/use-api-query'
import { useEquipoStore } from '@/app/hooks/use-equipo-store'

interface Props {
  jugadores: CarnetDigitalDTO[] | null
  onTransferido: () => void
  onCerrar: () => void
}

export default function ModalTransferirMasivo({ jugadores, onTransferido, onCerrar }: Props) {
  const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore()
  const [equipoDestino, setEquipoDestino] = useState<EquipoBaseDTO | null>(null)
  const [cargando, setCargando] = useState(false)

  const { data: delegadoData, isLoading } = useApiQuery({
    key: ['equipos-del-delegado'],
    fn: () => api.equiposDelDelegado(),
    activado: !!jugadores,
  })

  const otrosEquipos = (delegadoData?.equipos ?? []).filter((e) => e.id !== equipoSeleccionadoId)

  const handleTransferir = async () => {
    if (!jugadores || !equipoSeleccionadoId || !equipoDestino?.id) return
    setCargando(true)
    try {
      await api.efectuarPases(
        jugadores.map(
          (j) =>
            new EfectuarPaseDTO({
              jugadorId: j.id!,
              equipoOrigenId: equipoSeleccionadoId,
              equipoDestinoId: equipoDestino.id!,
            })
        )
      )
      setEquipoDestino(null)
      onTransferido()
    } finally {
      setCargando(false)
    }
  }

  const handleCerrar = () => {
    setEquipoDestino(null)
    onCerrar()
  }

  if (!jugadores) return null

  return (
    <Modal transparent animationType="fade" visible={!!jugadores} onRequestClose={handleCerrar}>
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl w-full overflow-hidden max-h-[80%]">
          {equipoDestino ? (
            // Fase 2: confirmación
            <View>
              <View className="p-6 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Confirmar transferencia
                </Text>
                <Text className="text-md text-gray-600 my-3">
                  Al hacerlo, los jugadores pasarán al estado "Aprobado pendiente de pago".
                </Text>
                <Text className="text-base text-gray-600 leading-6">
                  ¿Estás seguro de transferir a los siguientes jugadores del equipo{' '}
                  <Text className="font-semibold text-gray-900">{equipoSeleccionadoNombre}</Text> a{' '}
                  <Text className="font-semibold text-gray-900">{equipoDestino.nombre}</Text>?
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
                  className="bg-liga-600 rounded-xl p-4 items-center shadow-md"
                  onPress={handleTransferir}
                  disabled={cargando}
                >
                  {cargando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-base">Sí, transferir</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-xl p-4 items-center"
                  onPress={() => setEquipoDestino(null)}
                  disabled={cargando}
                >
                  <Text className="text-gray-500 text-base">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Fase 1: selección de equipo destino
            <View className="flex-shrink">
              <View className="p-6 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-900">Transferir jugadores</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Seleccioná el equipo de destino para los {jugadores.length} jugadores seleccionados
                </Text>
              </View>

              {isLoading ? (
                <View className="p-8 items-center">
                  <ActivityIndicator />
                </View>
              ) : otrosEquipos.length === 0 ? (
                <View className="p-6">
                  <Text className="text-base text-gray-500 text-center">
                    No hay otro equipo donde transferir los jugadores
                  </Text>
                </View>
              ) : (
                <ScrollView>
                  {otrosEquipos.map((equipo) => (
                    <TouchableOpacity
                      key={equipo.id}
                      className="p-4 border-b border-gray-100"
                      onPress={() => setEquipoDestino(equipo)}
                    >
                      <Text className="text-base text-gray-800">{equipo.nombre}</Text>
                      {equipo.torneo && (
                        <Text className="text-sm text-gray-400">{equipo.torneo}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity className="p-4 border-t border-gray-100" onPress={handleCerrar}>
                <Text className="text-base text-center text-gray-400">Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
