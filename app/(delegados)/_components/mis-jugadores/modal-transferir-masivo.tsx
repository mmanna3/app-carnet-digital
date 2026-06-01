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
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import {
  ModalOscuro,
  ModalOscuroEncabezado,
  ModalOscuroCuerpo,
  ModalOscuroAcciones,
} from '@/design-system/componentes/modal-oscuro'

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

  const todosEquipos = (delegadoData?.clubsConEquipos ?? []).flatMap((club) => club.equipos ?? [])
  const otrosEquipos = todosEquipos.filter((e: EquipoBaseDTO) => e.id !== equipoSeleccionadoId)

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

  if (!jugadores) return null

  return (
    <ModalOscuro visible={!!jugadores} onClose={handleCerrar} className="max-h-[80%]">
      {equipoDestino ? (
        <View>
          <ModalOscuroEncabezado className="p-6">
            <Text className="text-lg font-bold text-zinc-100 mb-3">Confirmar transferencia</Text>
            <Text className="text-base text-zinc-400 my-3">
              Al hacerlo, los jugadores pasarán al estado &quot;Aprobado pendiente de pago&quot;.
            </Text>
            <Text className="text-base text-zinc-400 leading-6">
              ¿Estás seguro de transferir a los siguientes jugadores del equipo{' '}
              <Text className="font-semibold text-zinc-100">{equipoSeleccionadoNombre}</Text> a{' '}
              <Text className="font-semibold text-zinc-100">{equipoDestino.nombre}</Text>?
            </Text>
          </ModalOscuroEncabezado>

          <ScrollView className="max-h-60">
            {jugadores.map((jugador) => (
              <View key={jugador.id} className="px-6 py-3 border-b border-border-glass">
                <Text className="text-base text-zinc-200">
                  {jugador.nombre} {jugador.apellido} - DNI: {jugador.dni}
                </Text>
              </View>
            ))}
          </ScrollView>

          <ModalOscuroAcciones className="pt-3">
            <BotonWizard
              texto={cargando ? 'Transfiriendo...' : 'Sí, transferir'}
              icono="check"
              cargando={cargando}
              onPress={handleTransferir}
              deshabilitado={cargando}
            />
            <BotonWizard
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
            <Text className="text-lg font-bold text-zinc-100">Transferir jugadores</Text>
            <Text className="text-sm text-zinc-400 mt-1">
              Seleccioná el equipo de destino para los {jugadores.length} jugadores seleccionados
            </Text>
          </ModalOscuroEncabezado>

          {isLoading ? (
            <View className="p-8 items-center">
              <ActivityIndicator color="#a1a1aa" />
            </View>
          ) : otrosEquipos.length === 0 ? (
            <ModalOscuroCuerpo className="p-6">
              <Text className="text-base text-zinc-400 text-center">
                No hay otro equipo donde transferir los jugadores
              </Text>
            </ModalOscuroCuerpo>
          ) : (
            <ScrollView>
              {otrosEquipos.map((equipo: EquipoBaseDTO) => (
                <TouchableOpacity
                  key={equipo.id}
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
            <BotonWizard texto="Cancelar" primario={false} onPress={handleCerrar} />
          </ModalOscuroAcciones>
        </View>
      )}
    </ModalOscuro>
  )
}
