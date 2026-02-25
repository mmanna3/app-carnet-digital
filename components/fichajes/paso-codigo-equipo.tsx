import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from './cabecera'
import Progreso from './progreso'
import CampoTexto from './campo-texto'
import BotonWizard from './boton-wizard'

export default function PasoCodigoEquipo() {
  const {
    flujo,
    codigoEquipo,
    nombreEquipo,
    setCodigoEquipo,
    irAIntro,
    irAlPasoSiguiente,
    validarCodigoEquipo,
  } = useFichajeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPasos = flujo === 'nuevo' ? 5 : 3
  const titulo = flujo === 'nuevo' ? 'Fichaje de nuevo jugador' : 'Fichaje'

  const handleValidar = async () => {
    setError(null)
    setLoading(true)
    const result = await validarCodigoEquipo()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Código inválido')
    }
  }

  return (
    <KeyboardAvoidingView
      testID="paso-codigo-equipo"
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecera titulo={titulo} onBack={irAIntro} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1" testID="titulo-codigo-equipo">
            Ingresá el código de tu equipo
          </Text>
          <Text className="text-gray-500 text-sm">Pedíselo a tu delegado</Text>
        </View>

        <View className="gap-3">
          <CampoTexto
            inputTestID="input-codigo-equipo"
            placeholder="Ingresá el código"
            value={codigoEquipo}
            onChangeText={(v) => {
              setCodigoEquipo(v)
              setError(null)
            }}
            autoCapitalize="characters"
          />

          {nombreEquipo && !error && (
            <Text className="text-green-600 text-sm font-medium text-center">
              Tu equipo es: <Text className="font-bold">{nombreEquipo}</Text>
            </Text>
          )}

          {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-validar"
            texto={loading ? 'Validando...' : 'Validar'}
            icono={loading ? undefined : 'check'}
            onPress={handleValidar}
            deshabilitado={!codigoEquipo.trim() || loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
