import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import CampoTexto from '../campo-texto'
import BotonWizard from '../boton-wizard'

export default function PasoDni() {
  const { dni, nombreEquipo, setDni, irAPaso, enviarFichajeYaFichado } = useFichajeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dniValido = dni.trim().length >= 7 && dni.trim().length <= 9

  const handleVolver = () => {
    setDni('')
    irAPaso(1)
  }

  const handleContinuar = async () => {
    setError(null)
    setLoading(true)
    const result = await enviarFichajeYaFichado()
    setLoading(false)
    if (result.ok) {
      irAPaso(3)
    } else {
      setError(result.error ?? 'Hubo un error al fichar')
    }
  }

  return (
    <KeyboardAvoidingView
      testID="paso-dni"
      className="flex-1 bg-gray-50"
      {...(Platform.OS === 'ios' && { behavior: 'padding' })}
    >
      <Cabecera titulo="Fichaje" onBack={handleVolver} />
      <Progreso totalPasos={3} pasoActual={2} />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Datos generales</Text>
          {nombreEquipo ? (
            <Text className="text-gray-500 text-sm">
              Fichándose en <Text className="font-bold">{nombreEquipo}</Text>
            </Text>
          ) : (
            <Text className="text-gray-500 text-sm">Ingresá tu DNI para identificarte</Text>
          )}
        </View>

        <View className="gap-3">
          <CampoTexto
            inputTestID="input-dni"
            label="Tu DNI"
            placeholder="Ingresá tu DNI (7-9 dígitos)"
            value={dni}
            onChangeText={(v) => {
              setDni(v.replace(/[^0-9]/g, '').slice(0, 9))
              setError(null)
            }}
            keyboardType="numeric"
          />

          {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-continuar"
            texto={loading ? 'Fichando...' : 'Continuar'}
            icono={loading ? undefined : 'arrow-right'}
            onPress={handleContinuar}
            deshabilitado={!dniValido || loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
