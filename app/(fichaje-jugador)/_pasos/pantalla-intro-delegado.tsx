import React from 'react'
import { View } from 'react-native'
import { Tarjeta, COLOR_TARJETA } from '@/design-system/componentes'

interface Props {
  onNuevo: () => void
  onYaFichado: () => void
  onVolver?: () => void
}

export default function PantallaIntroDelegado({ onNuevo, onYaFichado }: Props) {
  return (
    <View testID="pantalla-intro-delegado" className="flex-1 bg-surface">
      <View className="gap-3 px-6 pt-6">
        <Tarjeta
          testID="card-nuevo"
          icono="person-add-outline"
          titulo="Fichar nuevo jugador"
          subtitulo="Para jugadores no fichados en ningún equipo de la liga"
          color={COLOR_TARJETA.AZUL}
          onPress={onNuevo}
        />
        <Tarjeta
          testID="card-ya-fichado"
          icono="people-outline"
          titulo="Jugador ya fichado en la liga"
          subtitulo="Para jugadores fichados en otro equipo de la liga"
          color={COLOR_TARJETA.VERDE}
          onPress={onYaFichado}
        />
      </View>
    </View>
  )
}
