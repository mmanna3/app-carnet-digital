import React from 'react'
import { View } from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import { Tarjeta, COLOR_TARJETA } from '@/design-system/componentes'

interface Props {
  onVolver: () => void
}

export default function PantallaIntro({ onVolver }: Props) {
  const { irANuevo, irAYaFichado } = useFichajeStore()

  return (
    <View testID="pantalla-intro" className="flex-1 bg-surface">
      <Cabecera titulo="Fichaje" onBack={onVolver} />

      <View className="gap-3 px-6 pt-6">
        <Tarjeta
          testID="card-nuevo"
          icono="person-add-outline"
          titulo="¿Es la primera vez que te fichás?"
          subtitulo="Fichate con el código de equipo que te dio tu delegado y completando tus datos"
          color={COLOR_TARJETA.AZUL}
          onPress={irANuevo}
        />
        <Tarjeta
          testID="card-ya-fichado"
          icono="people-outline"
          titulo="¿Ya jugás en un equipo y querés ficharte en otro?"
          subtitulo="Fichate solo con el código de equipo y tu DNI"
          color={COLOR_TARJETA.VERDE}
          onPress={irAYaFichado}
        />
      </View>
    </View>
  )
}
