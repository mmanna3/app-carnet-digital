import React, { useState } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Progreso from '@/fichaje-jugador/_components/progreso'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import { Titulo } from '@/design-system/componentes'

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
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecera titulo={titulo} onBack={irAIntro} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Titulo testID="titulo-codigo-equipo">Ingresá el código de tu equipo</Titulo>
          <Text className="text-zinc-400 text-sm">Pedíselo a tu delegado</Text>
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
            <Text className="text-green-400 text-sm font-medium text-center">
              Tu equipo es: <Text className="font-bold text-zinc-100">{nombreEquipo}</Text>
            </Text>
          )}

          {error && <Text className="text-red-400 text-sm text-center">{error}</Text>}

          <Boton
            testID="boton-validar"
            texto={loading ? 'Validando...' : 'Validar'}
            icono="check"
            cargando={loading}
            onPress={handleValidar}
            deshabilitado={!codigoEquipo.trim() || loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
