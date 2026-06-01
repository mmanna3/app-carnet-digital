import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Progreso from '@/fichaje-jugador/_components/progreso'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import { Titulo } from '@/design-system/componentes'

const DECLARACION =
  'Al enviar los datos, declaro ser mayor de edad o estar acompañado por un mayor de edad que autoriza que puedan publicarse fotos y videos de mi rostro en medios donde se difunda material sobre torneos organizados por la liga.'

export default function PasoAutorizacion() {
  const { nombreEquipo, nombre, dni, irAlPasoSiguiente, irAlPasoAnterior, enviarFichajeNuevo } =
    useFichajeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnviar = async () => {
    setError(null)
    setLoading(true)
    const result = await enviarFichajeNuevo()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Hubo un error al enviar el fichaje')
    }
  }

  return (
    <View testID="paso-autorizacion" className="flex-1 bg-surface">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={() => irAlPasoAnterior()} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Titulo>Autorizar</Titulo>
          {nombreEquipo && (
            <Text className="text-zinc-400 text-sm">
              Fichando a <Text className="font-bold text-zinc-100">{nombre}</Text> en{' '}
              <Text className="font-bold text-zinc-100">{nombreEquipo}</Text> (DNI:{' '}
              <Text className="font-bold text-zinc-100">{dni}</Text>)
            </Text>
          )}
        </View>

        <View className="gap-4">
          <View className="glass rounded-2xl border border-border-glass p-5">
            <Text className="text-zinc-200 text-sm text-center leading-relaxed">{DECLARACION}</Text>
          </View>

          {error && <Text className="text-red-400 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-enviar"
            texto={loading ? 'Enviando...' : 'Enviar'}
            icono="send"
            cargando={loading}
            onPress={handleEnviar}
            deshabilitado={loading}
          />
        </View>
      </ScrollView>
    </View>
  )
}
