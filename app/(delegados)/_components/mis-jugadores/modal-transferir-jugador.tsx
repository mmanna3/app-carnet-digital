import React, { useState } from 'react'
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { CarnetDigitalDTO, EfectuarPaseDTO, EquipoBaseDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import Boton from '@/design-system/componentes/boton'
import {
  ModalOscuro,
  ModalOscuroEncabezado,
  ModalOscuroCuerpo,
  ModalOscuroAcciones,
} from '@/design-system/componentes/modal-oscuro'

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

  const todosEquipos = (delegadoData?.clubsConEquipos ?? []).flatMap((club) => club.equipos ?? [])
  const otrosEquipos = todosEquipos.filter((e: EquipoBaseDTO) => e.id !== equipoSeleccionadoId)

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
    } catch (err) {
      Alert.alert('Error al transferir', parseApiError(err))
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
    <ModalOscuro visible={!!jugador} onClose={handleCerrar} className="max-h-[80%]">
      {equipoDestino ? (
        <View>
          <ModalOscuroCuerpo className="p-6">
            <Text className="text-lg font-bold text-zinc-100 mb-3">Confirmar transferencia</Text>
            <Text className="text-base text-zinc-400 leading-6">
              ¿Estás seguro de transferir al jugador{' '}
              <Text className="font-semibold text-zinc-100">
                {jugador.nombre} {jugador.apellido}
              </Text>{' '}
              (DNI: {jugador.dni}) del equipo{' '}
              <Text className="font-semibold text-zinc-100">{equipoSeleccionadoNombre}</Text> a{' '}
              <Text className="font-semibold text-zinc-100">{equipoDestino.nombre}</Text>?
            </Text>
            <Text className="text-zinc-400 mt-4">
              Al hacerlo, el jugador pasará al estado &quot;Aprobado pendiente de pago&quot;.
            </Text>
          </ModalOscuroCuerpo>
          <ModalOscuroAcciones>
            <Boton
              testID="boton-confirmar-transferencia"
              texto={cargando ? 'Transfiriendo...' : 'Sí, transferir'}
              icono="check"
              cargando={cargando}
              onPress={handleTransferir}
              deshabilitado={cargando}
            />
            <Boton
              texto="Cancelar"
              primario={false}
              onPress={() => setEquipoDestino(null)}
              deshabilitado={cargando}
            />
          </ModalOscuroAcciones>
        </View>
      ) : (
        <View className="flex-shrink">
          <ModalOscuroEncabezado className="p-6">
            <Text className="text-lg font-bold text-zinc-100">Transferir jugador</Text>
            <Text className="text-sm text-zinc-400 mt-1">
              Seleccioná el equipo de destino para{' '}
              <Text className="font-medium text-zinc-200">
                {jugador.nombre} {jugador.apellido}
              </Text>
            </Text>
          </ModalOscuroEncabezado>

          {isLoading ? (
            <View className="p-8 items-center">
              <ActivityIndicator color="#a1a1aa" />
            </View>
          ) : otrosEquipos.length === 0 ? (
            <ModalOscuroCuerpo className="p-6">
              <Text className="text-base text-zinc-400 text-center">
                No hay otro equipo donde transferir al jugador
              </Text>
            </ModalOscuroCuerpo>
          ) : (
            <ScrollView>
              {otrosEquipos.map((equipo: EquipoBaseDTO) => (
                <TouchableOpacity
                  key={equipo.id}
                  testID={`equipo-destino-${equipo.id}`}
                  className="p-4 border-b border-border-glass"
                  onPress={() => setEquipoDestino(equipo)}
                  activeOpacity={0.7}
                >
                  <Text className="text-base text-zinc-100">{equipo.nombre}</Text>
                  {equipo.torneo && (
                    <Text className="text-sm text-zinc-500">{equipo.torneo}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <ModalOscuroAcciones>
            <Boton texto="Cancelar" primario={false} onPress={handleCerrar} />
          </ModalOscuroAcciones>
        </View>
      )}
    </ModalOscuro>
  )
}
