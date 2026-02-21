import React from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import CampoTexto from '../campo-texto'
import BotonWizard from '../boton-wizard'

export default function PasoDni() {
  const { dni, setDni, irAPaso } = useFichajeStore()

  const handleVolver = () => {
    setDni('')
    irAPaso(1)
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecera titulo="Fichaje" onBack={handleVolver} />
      <Progreso totalPasos={3} pasoActual={2} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Datos generales</Text>
          <Text className="text-gray-500 text-sm">Ingresá tu DNI para identificarte</Text>
        </View>

        <View className="gap-3">
          <CampoTexto
            label="Tu DNI"
            placeholder="Ingresá tu DNI"
            value={dni}
            onChangeText={setDni}
            keyboardType="numeric"
          />
          <BotonWizard
            texto="Continuar"
            icono="arrow-right"
            onPress={() => irAPaso(3)}
            deshabilitado={!dni.trim()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
