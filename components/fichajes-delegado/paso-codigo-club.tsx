import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from './cabecera-delegado'
import ProgresoDelegado from './progreso-delegado'
import CampoTexto from '@/components/fichajes/campo-texto'
import BotonWizard from '@/components/fichajes/boton-wizard'

export default function PasoCodigoClub() {
  const {
    flujo,
    codigoEquipo,
    nombreClub,
    setCodigoEquipo,
    irAIntro,
    irAlPasoSiguiente,
    validarCodigoClub,
  } = useFichajeDelegadoStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const titulo = flujo === 'azul' ? 'Registro de nuevo delegado' : 'Registro de delegado'

  const handleValidar = async () => {
    setError(null)
    setLoading(true)
    const result = await validarCodigoClub()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Código inválido')
    }
  }

  return (
    <KeyboardAvoidingView
      testID="paso-codigo-club"
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <CabeceraDelegado titulo={titulo} onBack={irAIntro} />
      <ProgresoDelegado />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text testID="titulo-codigo-club" className="text-gray-900 text-lg font-semibold mb-1">
            Ingresá el código de cualquiera de los equipos de tu club
          </Text>
          <Text className="text-gray-500 text-sm">Si no lo tenés, pedíselo a la liga</Text>
        </View>

        <View className="gap-3">
          <CampoTexto
            inputTestID="input-codigo-club"
            placeholder="Ingresá el código"
            value={codigoEquipo}
            onChangeText={(v) => {
              setCodigoEquipo(v)
              setError(null)
            }}
            autoCapitalize="characters"
          />

          {nombreClub && !error && (
            <Text className="text-green-600 text-sm font-medium text-center">
              Tu club es: <Text className="font-bold">{nombreClub}</Text>
            </Text>
          )}

          {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-validar-club"
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
