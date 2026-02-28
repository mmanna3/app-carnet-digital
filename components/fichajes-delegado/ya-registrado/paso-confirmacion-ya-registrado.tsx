import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from '../cabecera-delegado'
import ProgresoDelegado from '../progreso-delegado'
import BotonWizard from '@/components/fichajes/boton-wizard'

export default function PasoConfirmacionYaRegistrado() {
  const {
    nombreClub,
    nombreUsuario,
    irAlPasoAnterior,
    irAlPasoSiguiente,
    obtenerNombreUsuarioVerde,
    enviarDelegadoYaRegistrado,
  } = useFichajeDelegadoStore()
  const [cargandoUsuario, setCargandoUsuario] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorNombreUsuario, setErrorNombreUsuario] = useState<string | null>(null)

  useEffect(() => {
    if (!nombreUsuario) {
      setCargandoUsuario(true)
      setErrorNombreUsuario(null)
      obtenerNombreUsuarioVerde()
        .then((result) => {
          if (!result.ok) {
            setErrorNombreUsuario(result.error ?? 'Error al obtener el nombre de usuario')
          }
        })
        .finally(() => setCargandoUsuario(false))
    }
  }, [])

  const handleEnviar = async () => {
    setError(null)
    setEnviando(true)
    const result = await enviarDelegadoYaRegistrado()
    setEnviando(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Hubo un error al enviar los datos')
    }
  }

  return (
    <View testID="paso-confirmacion-ya-registrado" className="flex-1 bg-gray-50">
      <CabeceraDelegado titulo="Fichaje de delegado" onBack={() => irAlPasoAnterior()} />
      <ProgresoDelegado />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-semibold mb-1">Confirmar y enviar datos</Text>
          <Text className="text-gray-500 text-sm">
            Fichando como delegado del club <Text className="font-bold">{nombreClub}</Text>
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          {cargandoUsuario ? (
            <View className="items-center py-4">
              <ActivityIndicator />
              <Text className="text-gray-500 text-sm mt-2">Obteniendo nombre de usuario...</Text>
            </View>
          ) : errorNombreUsuario ? (
            <View>
              <Text className="text-gray-700 text-sm leading-relaxed mb-2">
                No se pudo obtener el nombre de usuario.
              </Text>
              <Text className="text-red-500 text-sm font-medium">{errorNombreUsuario}</Text>
            </View>
          ) : nombreUsuario ? (
            <Text className="text-gray-700 text-sm leading-relaxed">
              Una vez que la administración de la liga apruebe, vas a poder iniciar sesión con el
              nombre de usuario:{' '}
              <Text className="font-bold text-gray-900">{nombreUsuario}</Text>. La contraseña es tu
              DNI.
            </Text>
          ) : (
            <Text className="text-gray-700 text-sm leading-relaxed">
              Una vez que la administración de la liga apruebe, vas a poder iniciar sesión como
              delegado del club <Text className="font-bold text-gray-900">{nombreClub}</Text>. La
              contraseña es tu DNI.
            </Text>
          )}
        </View>

        {error && <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>}

        <BotonWizard
          testID="boton-enviar-ya-registrado"
          texto={enviando ? 'Enviando...' : 'Enviar'}
          icono={enviando ? undefined : 'send'}
          onPress={handleEnviar}
          deshabilitado={enviando || cargandoUsuario}
        />
      </ScrollView>
    </View>
  )
}
