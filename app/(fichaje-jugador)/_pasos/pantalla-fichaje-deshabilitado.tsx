import React from 'react'
import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Boton from '@/design-system/componentes/boton'

interface Props {
  tituloCabecera: string
  onVolver: () => void
}

export default function PantallaFichajeDeshabilitado({ tituloCabecera, onVolver }: Props) {
  return (
    <View testID="pantalla-fichaje-deshabilitado" className="flex-1 bg-surface">
      <Cabecera titulo={tituloCabecera} onBack={onVolver} />
      <View className="flex-1 px-6 justify-center items-center">
        <View className="glass w-full rounded-2xl border border-amber-500/30 p-6 mb-6">
          <View className="items-center gap-4">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-amber-500/20 border border-amber-400/50">
              <Feather name="alert-circle" size={32} color="#fbbf24" />
            </View>
            <Text className="text-zinc-100 text-xl font-semibold text-center">
              El fichaje está deshabilitado
            </Text>
            <Text className="text-zinc-400 text-sm text-center leading-relaxed">
              Por el momento no es posible ficharse. Volvé más tarde o consultá con tu delegado.
            </Text>
          </View>
        </View>

        <Boton
          testID="boton-volver-fichaje-deshabilitado"
          texto="Volver"
          icono="arrow-left"
          onPress={onVolver}
          primario={false}
        />
      </View>
    </View>
  )
}
