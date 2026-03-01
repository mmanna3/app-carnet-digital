import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from '../cabecera-delegado'
import ProgresoDelegado from '../progreso-delegado'
import CampoTexto from '@/components/fichajes/campo-texto'
import BotonWizard from '@/components/fichajes/boton-wizard'

export default function PasoDniDelegado() {
  const { dni, nombreClub, setDni, irAlPasoAnterior, irAlPasoSiguiente, validarDniVerde } =
    useFichajeDelegadoStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dniValido = dni.trim().length >= 7 && dni.trim().length <= 9

  const handleVolver = () => {
    setDni('')
    irAlPasoAnterior()
  }

  const handleContinuar = async () => {
    setError(null)
    setLoading(true)
    const result = await validarDniVerde()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Hubo un error al validar el DNI')
    }
  }

  return (
    <KeyboardAvoidingView
      testID="paso-dni-delegado"
      className="flex-1 bg-gray-50"
      {...(Platform.OS === 'ios' && { behavior: 'padding' })}
    >
      <CabeceraDelegado titulo="Fichaje de delegado" onBack={handleVolver} />
      <ProgresoDelegado />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Tu DNI</Text>
          {nombreClub ? (
            <Text className="text-gray-500 text-sm">
              Fichando en club <Text className="font-bold">{nombreClub}</Text>
            </Text>
          ) : (
            <Text className="text-gray-500 text-sm">Ingresá tu DNI para identificarte</Text>
          )}
        </View>

        <View className="gap-3">
          <CampoTexto
            inputTestID="input-dni-verde"
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
            testID="boton-continuar-dni-verde"
            texto={loading ? 'Verificando...' : 'Continuar'}
            icono={loading ? undefined : 'arrow-right'}
            onPress={handleContinuar}
            deshabilitado={!dniValido || loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
