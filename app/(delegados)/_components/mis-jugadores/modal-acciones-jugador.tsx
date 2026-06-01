import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import {
  ModalOscuro,
  ModalOscuroEncabezado,
  ModalOscuroAcciones,
} from '@/design-system/componentes/modal-oscuro'

interface Props {
  jugador: CarnetDigitalDTO | null
  onEliminar: () => void
  onTransferir: () => void
  onCerrar: () => void
}

export default function ModalAccionesJugador({
  jugador,
  onEliminar,
  onTransferir,
  onCerrar,
}: Props) {
  if (!jugador) return null

  return (
    <ModalOscuro visible={!!jugador} onClose={onCerrar} variante="inferior">
      <ModalOscuroEncabezado>
        <Text className="text-base font-semibold text-center text-zinc-100">
          {jugador.nombre} {jugador.apellido}
        </Text>
        <Text className="text-sm text-center text-zinc-400 mt-1">DNI: {jugador.dni}</Text>
      </ModalOscuroEncabezado>

      <ModalOscuroAcciones>
        <TouchableOpacity
          testID="boton-eliminar-jugador"
          className="bg-red-600 rounded-2xl p-4 items-center"
          onPress={onEliminar}
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold text-base">Eliminar jugador</Text>
        </TouchableOpacity>

        <BotonWizard
          testID="boton-transferir-jugador"
          texto="Transferir"
          icono="external-link"
          onPress={onTransferir}
        />

        <BotonWizard testID="boton-cancelar-acciones" texto="Cancelar" primario={false} onPress={onCerrar} />
      </ModalOscuroAcciones>
    </ModalOscuro>
  )
}
