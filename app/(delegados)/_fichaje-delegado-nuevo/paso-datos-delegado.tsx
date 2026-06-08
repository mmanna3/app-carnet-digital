import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Keyboard, Platform } from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import { useScrollAlCampo } from '@/lib/hooks/use-scroll-al-campo'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import ProgresoDelegado from '@/delegados/_registro-delegado/components/progreso-delegado'
import ModalFechaNacimiento from '@/fichaje-jugador/_components/modal-fecha-nacimiento'
import { Titulo } from '@/design-system/componentes'
import FormularioDatosDelegado from './formulario-datos-delegado'
import {
  ERRORES_INICIALES,
  type ErroresCamposDelegado,
  puedeAvanzarDatosDelegado,
} from './validacion-datos-delegado'

export default function PasoDatosDelegado() {
  const {
    nombre,
    apellido,
    dni,
    fechaNac,
    email,
    celular,
    nombreClub,
    setNombre,
    setApellido,
    setDni,
    setFechaNac,
    setEmail,
    setCelular,
    irAlPasoAnterior,
    irAlPasoSiguiente,
    validarDniNuevo,
  } = useFichajeDelegadoStore()
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fechaSeleccionadaEnModal = useRef<Date | null>(null)
  const [errores, setErrores] = useState<ErroresCamposDelegado>(ERRORES_INICIALES)

  const scrollViewRef = useRef<ScrollView>(null)
  const { handleFormLayout, handleFieldLayout, scrollToField } = useScrollAlCampo(scrollViewRef)

  const actualizarError = (campo: keyof ErroresCamposDelegado, mensaje: string | null) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }))
  }

  const puedeAvanzar = puedeAvanzarDatosDelegado({
    nombre,
    apellido,
    dni,
    fechaNac,
    email,
    celular,
  })

  const handleContinuar = async () => {
    setError(null)
    setLoading(true)
    const result = await validarDniNuevo()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'Error al validar el DNI')
    }
  }

  return (
    <View testID="paso-datos-delegado" style={{ flex: 1 }} className="bg-surface">
      <Cabecera titulo="Registro de nuevo delegado" onBack={() => irAlPasoAnterior()} />
      <ProgresoDelegado />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Titulo>Datos del delegado</Titulo>
            {nombreClub ? (
              <Text className="text-zinc-400 text-sm">
                Fichándose en <Text className="font-bold text-zinc-100">{nombreClub}</Text>
              </Text>
            ) : (
              <Text className="text-zinc-400 text-sm">Ingresá tus datos personales</Text>
            )}
          </View>

          <FormularioDatosDelegado
            nombre={nombre}
            apellido={apellido}
            dni={dni}
            fechaNac={fechaNac}
            email={email}
            celular={celular}
            errores={errores}
            error={error}
            loading={loading}
            puedeAvanzar={puedeAvanzar}
            onFormLayout={handleFormLayout}
            handleFieldLayout={handleFieldLayout}
            scrollToField={scrollToField}
            actualizarError={actualizarError}
            setNombre={setNombre}
            setApellido={setApellido}
            setDni={setDni}
            setEmail={setEmail}
            setCelular={setCelular}
            setError={setError}
            onAbrirFecha={() => {
              fechaSeleccionadaEnModal.current = fechaNac
              setMostrarPicker(true)
            }}
            onContinuar={handleContinuar}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalFechaNacimiento
        visible={mostrarPicker}
        value={fechaNac}
        onClose={() => {
          Keyboard.dismiss()
          setMostrarPicker(false)
          const fechaActual = fechaSeleccionadaEnModal.current ?? fechaNac
          actualizarError('fechaNac', fechaActual ? null : 'La fecha de nacimiento es obligatoria')
          fechaSeleccionadaEnModal.current = null
        }}
        onChange={(f) => {
          fechaSeleccionadaEnModal.current = f
          setFechaNac(f)
          actualizarError('fechaNac', null)
        }}
      />
    </View>
  )
}
