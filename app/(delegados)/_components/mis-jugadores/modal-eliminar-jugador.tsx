import React, { useState } from 'react'
import { Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { CarnetDigitalDTO, DesvincularJugadorDelEquipoDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import {
  ModalOscuro,
  ModalOscuroCuerpo,
  ModalOscuroAcciones,
} from '@/design-system/componentes/modal-oscuro'

interface Props {
  jugador: CarnetDigitalDTO | null
  equipoId: number | null | undefined
  onEliminado: () => void
  onCerrar: () => void
}

export default function ModalEliminarJugador({ jugador, equipoId, onEliminado, onCerrar }: Props) {
  const [cargando, setCargando] = useState(false)

  if (!jugador) return null

  const handleDesvincular = async () => {
    if (!jugador.id || !equipoId) return
    setCargando(true)
    try {
      await api.desvincularJugadorDelEquipo(
        new DesvincularJugadorDelEquipoDTO({ jugadorId: jugador.id, equipoId })
      )

      onEliminado()
    } catch (err) {
      console.error(err)
      Alert.alert('Error al desvincular', parseApiError(err))
    } finally {
      setCargando(false)
    }
  }

  return (
    <ModalOscuro visible={!!jugador} onClose={onCerrar}>
      <ModalOscuroCuerpo className="p-6">
        <Text className="text-lg font-bold text-zinc-100 mb-3">Quitar jugador del equipo</Text>
        <Text className="text-base text-zinc-400 leading-6">
          ¿Estás seguro que querés eliminar este jugador del equipo? Si el jugador juega en otros
          equipos, no se eliminará de ellos.
        </Text>
      </ModalOscuroCuerpo>

      <ModalOscuroAcciones>
        <TouchableOpacity
          testID="boton-quitar-del-equipo"
          className="bg-red-600 rounded-2xl p-4 items-center"
          onPress={handleDesvincular}
          disabled={cargando}
          activeOpacity={0.85}
        >
          {cargando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Quitar del equipo</Text>
          )}
        </TouchableOpacity>

        <BotonWizard
          testID="boton-cancelar-eliminar"
          texto="Cancelar"
          primario={false}
          onPress={onCerrar}
          deshabilitado={cargando}
        />
      </ModalOscuroAcciones>
    </ModalOscuro>
  )
}
