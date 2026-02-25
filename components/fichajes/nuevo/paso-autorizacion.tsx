import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import BotonWizard from '../boton-wizard'

const DECLARACION =
  'Al enviar los datos, declaro ser mayor de edad o estar acompañado por un mayor de edad que autoriza a que puedan publicarse fotos y videos de mi rostro en medios donde se difunda material sobre torneos organizados por la liga.'

export default function PasoAutorizacion() {
  const { nombreEquipo, nombre, dni, irAlPasoSiguiente, irAlPasoAnterior, enviarFichajeNuevo } = useFichajeStore()
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
    <View testID="paso-autorizacion" className="flex-1 bg-gray-50">
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={() => irAlPasoAnterior()} />
      <Progreso />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Autorizar</Text>
          {nombreEquipo && (
            <Text className="text-gray-500 text-sm">
              Fichando a <Text className="font-bold">{nombre}</Text> en{' '}
              <Text className="font-bold">{nombreEquipo}</Text> (DNI:{' '}
              <Text className="font-bold">{dni}</Text>)
            </Text>
          )}
        </View>

        <View className="gap-4">
          <View className="bg-blue-500 rounded-2xl p-5 shadow-md">
            <Text className="text-white text-sm text-center leading-relaxed">{DECLARACION}</Text>
          </View>

          {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

          <BotonWizard
            testID="boton-enviar"
            texto={loading ? 'Enviando...' : 'Enviar'}
            icono={loading ? undefined : 'send'}
            onPress={handleEnviar}
            deshabilitado={loading}
          />
        </View>
      </ScrollView>
    </View>
  )
}
