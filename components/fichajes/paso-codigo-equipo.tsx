import React from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from './cabecera'
import Progreso from './progreso'
import CampoTexto from './campo-texto'
import BotonWizard from './boton-wizard'

export default function PasoCodigoEquipo() {
  const { flujo, codigoEquipo, setCodigoEquipo, irAIntro, irAPaso } = useFichajeStore()

  const totalPasos = flujo === 'nuevo' ? 5 : 3
  const titulo = flujo === 'nuevo' ? 'Fichaje de nuevo jugador' : 'Fichaje'

  return (
    <KeyboardAvoidingView
      testID="paso-codigo-equipo"
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecera titulo={titulo} onBack={irAIntro} />
      <Progreso totalPasos={totalPasos} pasoActual={1} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">
            Ingresá el código de tu equipo
          </Text>
          <Text className="text-gray-500 text-sm">Pedíselo a tu delegado</Text>
        </View>

        <View className="gap-3">
          <CampoTexto
            inputTestID="input-codigo-equipo"
            placeholder="Ingresá el código"
            value={codigoEquipo}
            onChangeText={setCodigoEquipo}
            autoCapitalize="characters"
          />
          <BotonWizard
            testID="boton-validar"
            texto="Validar"
            icono="check"
            onPress={() => irAPaso(2)}
            deshabilitado={!codigoEquipo.trim()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
