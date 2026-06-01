import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Progreso from '@/fichaje-jugador/_components/progreso'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import { Titulo } from '@/design-system/componentes'

export default function PasoDni() {
  const { dni, nombreEquipo, setDni, irAlPasoAnterior, irAlPasoSiguiente, enviarFichajeYaFichado } =
    useFichajeStore()
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
    const result = await enviarFichajeYaFichado()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Hubo un error al fichar')
    }
  }

  return (
    <KeyboardAvoidingView
      testID="paso-dni"
      className="flex-1 bg-surface"
      {...(Platform.OS === 'ios' && { behavior: 'padding' })}
    >
      <Cabecera titulo="Fichaje" onBack={handleVolver} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Titulo>Datos generales</Titulo>
          {nombreEquipo ? (
            <Text className="text-zinc-400 text-sm">
              Fichándose en <Text className="font-bold text-zinc-100">{nombreEquipo}</Text>
            </Text>
          ) : (
            <Text className="text-zinc-400 text-sm">Ingresá tu DNI para identificarte</Text>
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

          {error && <Text className="text-red-400 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-continuar"
            texto={loading ? 'Fichando...' : 'Continuar'}
            icono="arrow-right"
            cargando={loading}
            onPress={handleContinuar}
            deshabilitado={!dniValido || loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
