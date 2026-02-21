import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import BotonWizard from '../boton-wizard'

const DECLARACION =
  'Al enviar los datos, declaro ser mayor de edad o estar acompañado por un mayor de edad que autoriza a que puedan publicarse fotos y videos de mi rostro en medios donde se difunda material sobre torneos organizados por la liga.'

export default function PasoAutorizacion() {
  const { irAPaso } = useFichajeStore()

  return (
    <View className="flex-1 bg-gray-50">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={() => irAPaso(4)} />
      <Progreso totalPasos={5} pasoActual={5} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Autorizar</Text>
        </View>

        <View className="gap-4">
          <View className="bg-blue-500 rounded-2xl p-5 shadow-md">
            <Text className="text-white text-sm text-center leading-relaxed">{DECLARACION}</Text>
          </View>

          <BotonWizard texto="Enviar" icono="send" onPress={() => irAPaso(6)} />
        </View>
      </ScrollView>
    </View>
  )
}
