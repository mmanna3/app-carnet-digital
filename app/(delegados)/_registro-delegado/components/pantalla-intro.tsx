import React from 'react'
import { View } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import { Tarjeta, COLOR_TARJETA } from '@/design-system/componentes'

interface Props {
  onVolver: () => void
}

export default function PantallaIntroDelegadoRegistro({ onVolver }: Props) {
  const { irAAzul, irAVerde } = useFichajeDelegadoStore()

  return (
    <View testID="pantalla-intro-delegado" className="flex-1 bg-surface">
      <Cabecera titulo="Registro de delegado" onBack={onVolver} />

      <View className="gap-3 px-6 pt-6">
        <Tarjeta
          testID="card-nuevo-delegado"
          icono="person-add-outline"
          titulo="¿Es la primera vez que te registrás en la liga?"
          subtitulo="Fichate acá si nunca te registraste"
          color={COLOR_TARJETA.AZUL}
          onPress={irAAzul}
        />
        <Tarjeta
          testID="card-ya-registrado"
          icono="people-outline"
          titulo="¿Ya estás registrado como jugador en la liga?"
          subtitulo="Fichate como delegado solo con el DNI"
          color={COLOR_TARJETA.VERDE}
          onPress={irAVerde}
        />
      </View>
    </View>
  )
}
