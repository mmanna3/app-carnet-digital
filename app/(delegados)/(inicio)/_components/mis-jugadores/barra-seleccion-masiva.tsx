import React from 'react'
import { View } from 'react-native'
import Boton from '@/design-system/componentes/boton'

type BarraSeleccionMasivaProps = {
  haySeleccionados: boolean
  onEliminar: () => void
  onTransferir: () => void
  onCancelar: () => void
}

export default function BarraSeleccionMasiva({
  haySeleccionados,
  onEliminar,
  onTransferir,
  onCancelar,
}: BarraSeleccionMasivaProps) {
  return (
    <View className="bg-surface-elevated border-t border-border-glass px-4 pt-3 pb-6 gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Boton
            testID="boton-bulk-eliminar"
            texto="Eliminar"
            icono="trash-2"
            color="rojo"
            onPress={onEliminar}
            deshabilitado={!haySeleccionados}
          />
        </View>
        <View className="flex-1">
          <Boton
            texto="Transferir"
            icono="external-link"
            onPress={onTransferir}
            deshabilitado={!haySeleccionados}
          />
        </View>
      </View>
      <Boton texto="Cancelar" primario={false} onPress={onCancelar} />
    </View>
  )
}
