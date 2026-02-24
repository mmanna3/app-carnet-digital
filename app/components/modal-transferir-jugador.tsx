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
  jugador: CarnetDigitalDTO | null
  onTransferido: () => void
  onCerrar: () => void
}

export default function ModalTransferirJugador({ jugador, onTransferido, onCerrar }: Props) {
  const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore()
  const [equipoDestino, setEquipoDestino] = useState<EquipoBaseDTO | null>(null)
  const [cargando, setCargando] = useState(false)

  const { data: delegadoData, isLoading } = useApiQuery({
    key: ['equipos-del-delegado'],
    fn: () => api.equiposDelDelegado(),
    activado: !!jugador,
  })

  const otrosEquipos = (delegadoData?.equipos ?? []).filter(
    (e) => e.id !== equipoSeleccionadoId
  )

  const handleTransferir = async () => {
    if (!jugador?.id || !equipoSeleccionadoId || !equipoDestino?.id) return
    setCargando(true)
    try {
      await api.efectuarPases([
        new EfectuarPaseDTO({
          jugadorId: jugador.id,
          equipoOrigenId: equipoSeleccionadoId,
          equipoDestinoId: equipoDestino.id,
        }),
      ])
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

  if (!jugador) return null

  return (
    <Modal transparent animationType="fade" visible={!!jugador} onRequestClose={handleCerrar}>
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl w-full overflow-hidden max-h-[80%]">
          {equipoDestino ? (
            // Pantalla de confirmación
            <View>
              <View className="p-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">Confirmar transferencia</Text>
                <Text className="text-base text-gray-600 leading-6">
                  ¿Estás seguro de transferir al jugador{' '}
                  <Text className="font-semibold text-gray-900">
                    {jugador.nombre} {jugador.apellido}
                  </Text>{' '}
                  (DNI: {jugador.dni}) del equipo{' '}
                  <Text className="font-semibold text-gray-900">{equipoSeleccionadoNombre}</Text> a{' '}
                  <Text className="font-semibold text-gray-900">{equipoDestino.nombre}</Text>?
                </Text>
              </View>
              <View className="px-4 pb-4 gap-3">
                <TouchableOpacity
                  className="bg-liga-600 rounded-xl p-4 items-center"
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
            // Pantalla de selección de equipo
            <View className="flex-shrink">
              <View className="p-6 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-900">Transferir jugador</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Seleccioná el equipo de destino para{' '}
                  <Text className="font-medium">
                    {jugador.nombre} {jugador.apellido}
                  </Text>
                </Text>
              </View>

              {isLoading ? (
                <View className="p-8 items-center">
                  <ActivityIndicator />
                </View>
              ) : otrosEquipos.length === 0 ? (
                <View className="p-6">
                  <Text className="text-base text-gray-500 text-center">
                    No hay otro equipo donde transferir al jugador
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
