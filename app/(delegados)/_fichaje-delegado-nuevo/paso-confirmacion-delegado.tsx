import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import ProgresoDelegado from '@/delegados/_registro-delegado/components/progreso-delegado'
import BotonWizard from '@/fichaje-jugador/_components/boton-wizard'
import { Titulo } from '@/design-system/componentes'

export default function PasoConfirmacionDelegado() {
  const {
    nombre,
    apellido,
    nombreClub,
    nombreUsuario,
    irAlPasoAnterior,
    irAlPasoSiguiente,
    obtenerNombreUsuario,
    enviarNuevoDelegado,
  } = useFichajeDelegadoStore()
  const [cargandoUsuario, setCargandoUsuario] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorNombreUsuario, setErrorNombreUsuario] = useState<string | null>(null)

  useEffect(() => {
    if (nombreUsuario) return

    let cancelado = false
    void (async () => {
      setCargandoUsuario(true)
      setErrorNombreUsuario(null)
      try {
        const result = await obtenerNombreUsuario()
        if (!cancelado && !result.ok) {
          setErrorNombreUsuario(result.error ?? 'Error al obtener el nombre de usuario')
        }
      } finally {
        if (!cancelado) setCargandoUsuario(false)
      }
    })()

    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch nombre solo al montar
  }, [])

  const handleEnviar = async () => {
    setError(null)
    setEnviando(true)
    const result = await enviarNuevoDelegado()
    setEnviando(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Hubo un error al enviar los datos')
    }
  }

  return (
    <View testID="paso-confirmacion-delegado" className="flex-1 bg-surface">
      <Cabecera titulo="Registro de nuevo delegado" onBack={() => irAlPasoAnterior()} />
      <ProgresoDelegado />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mb-6">
          <Titulo>Confirmar y enviar datos</Titulo>
          <Text className="text-zinc-400 text-sm">
            Fichando a{' '}
            <Text className="font-bold text-zinc-100">
              {nombre} {apellido}
            </Text>{' '}
            como delegado del club <Text className="font-bold text-zinc-100">{nombreClub}</Text>
          </Text>
        </View>

        <View className="glass rounded-2xl border border-border-glass p-5 mb-6">
          {cargandoUsuario ? (
            <View className="items-center py-4">
              <ActivityIndicator color="#a1a1aa" />
              <Text className="text-zinc-400 text-sm mt-2">Generando nombre de usuario...</Text>
            </View>
          ) : errorNombreUsuario ? (
            <View>
              <Text className="text-zinc-400 text-sm leading-relaxed mb-2">
                No se pudo generar el nombre de usuario.
              </Text>
              <Text className="text-red-400 text-sm font-medium">{errorNombreUsuario}</Text>
            </View>
          ) : nombreUsuario ? (
            <Text className="text-zinc-400 text-sm leading-relaxed">
              Una vez que la administración de la liga apruebe esta información, vas a poder iniciar
              sesión con el nombre de usuario:{' '}
              <Text className="font-bold text-zinc-100">{nombreUsuario}</Text>. La contraseña es tu
              DNI.
            </Text>
          ) : (
            <Text className="text-zinc-400 text-sm">
              Una vez que la administración de la liga apruebe, vas a poder iniciar sesión como
              delegado del club <Text className="font-bold text-zinc-100">{nombreClub}</Text>.
            </Text>
          )}
        </View>

        {error && <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>}

        <BotonWizard
          testID="boton-enviar-delegado"
          texto={enviando ? 'Enviando...' : 'Enviar'}
          icono="send"
          cargando={enviando}
          onPress={handleEnviar}
          deshabilitado={enviando || cargandoUsuario}
        />
      </ScrollView>
    </View>
  )
}
