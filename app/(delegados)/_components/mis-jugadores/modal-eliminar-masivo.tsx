import React, { useState } from 'react'
import { Alert, View, Text, ScrollView } from 'react-native'
import { CarnetDigitalDTO, DesvincularJugadorDelEquipoDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import Boton from '@/design-system/componentes/boton'
import {
  ModalOscuro,
  ModalOscuroEncabezado,
  ModalOscuroAcciones,
} from '@/design-system/componentes/modal-oscuro'

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
    <ModalOscuro visible={!!jugadores} onClose={onCerrar} className="max-h-[80%]">
      <ModalOscuroEncabezado className="p-6">
        <Text className="text-lg font-bold text-zinc-100 mb-3">Quitar jugadores del equipo</Text>
        <Text className="text-base text-zinc-400 leading-6">
          ¿Estás seguro que querés eliminar estos jugadores del equipo? Los jugadores que juegan en
          otros equipos no se eliminarán de ellos.
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
        <Boton
          testID="boton-quitar-masivo"
          texto={`Quitar ${jugadores.length} jugadores del equipo`}
          icono="trash-2"
          color="rojo"
          onPress={handleDesvincular}
          cargando={cargando}
          deshabilitado={cargando}
        />

        <Boton texto="Cancelar" primario={false} onPress={onCerrar} deshabilitado={cargando} />
      </ModalOscuroAcciones>
    </ModalOscuro>
  )
}
