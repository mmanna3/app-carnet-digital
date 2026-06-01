import React from 'react'
import { Text } from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Boton from '@/design-system/componentes/boton'
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
        <Boton
          testID="boton-eliminar-jugador"
          texto="Eliminar jugador"
          icono="trash-2"
          color="rojo"
          onPress={onEliminar}
        />

        <Boton
          testID="boton-transferir-jugador"
          texto="Transferir"
          icono="external-link"
          onPress={onTransferir}
        />

        <Boton testID="boton-cancelar-acciones" texto="Cancelar" primario={false} onPress={onCerrar} />
      </ModalOscuroAcciones>
    </ModalOscuro>
  )
}
