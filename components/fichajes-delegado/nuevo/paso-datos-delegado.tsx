import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  type LayoutChangeEvent,
} from 'react-native'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import CabeceraDelegado from '../cabecera-delegado'
import ProgresoDelegado from '../progreso-delegado'
import CampoTexto from '@/components/fichajes/campo-texto'
import BotonWizard from '@/components/fichajes/boton-wizard'
import ModalFechaNacimiento from '@/components/fichajes/modal-fecha-nacimiento'

const formatearFecha = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

const capitalizar = (s: string) =>
  s
    .slice(0, 14)
    .split(' ')
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : ''))
    .join(' ')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ErroresCampos = {
  nombre: string | null
  apellido: string | null
  dni: string | null
  fechaNac: string | null
  email: string | null
  celular: string | null
}

function validarNombre(v: string): string | null {
  if (!v.trim()) return 'El nombre es obligatorio'
  return null
}

function validarApellido(v: string): string | null {
  if (!v.trim()) return 'El apellido es obligatorio'
  return null
}

function validarDni(v: string): string | null {
  const n = v.trim()
  if (!n) return 'El DNI es obligatorio'
  if (n.length < 7 || n.length > 9) return 'El DNI debe tener entre 7 y 9 dígitos'
  return null
}

function validarEmail(v: string): string | null {
  if (!v.trim()) return 'El email es obligatorio'
  if (!EMAIL_REGEX.test(v.trim())) return 'Ingresá un email válido'
  return null
}

function validarCelular(v: string): string | null {
  if (!v.trim()) return 'El celular es obligatorio'
  if (v.trim().length < 8) return 'El celular debe tener al menos 8 dígitos'
  return null
}

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
  const [errores, setErrores] = useState<ErroresCampos>({
    nombre: null,
    apellido: null,
    dni: null,
    fechaNac: null,
    email: null,
    celular: null,
  })

  const scrollViewRef = useRef<ScrollView>(null)
  const formTopRef = useRef(0)
  const fieldOffsets = useRef<Record<string, number>>({})

  const handleFieldLayout = useCallback((fieldKey: string) => (e: LayoutChangeEvent) => {
    const { y } = e.nativeEvent.layout
    fieldOffsets.current[fieldKey] = y
  }, [])

  const scrollToField = useCallback((fieldKey: string) => {
    const fieldY = fieldOffsets.current[fieldKey]
    if (fieldY === undefined) return
    const totalY = formTopRef.current + fieldY
    const targetY = Math.max(0, totalY - 80)
    // Pequeño delay para que el scroll ocurra después de que el teclado empiece a aparecer
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: targetY,
        animated: true,
      })
    }, 100)
  }, [])

  const actualizarError = (campo: keyof ErroresCampos, mensaje: string | null) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }))
  }

  const puedeAvanzar =
    !validarNombre(nombre) &&
    !validarApellido(apellido) &&
    !validarDni(dni) &&
    !!fechaNac &&
    !validarEmail(email) &&
    !validarCelular(celular)

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
    <View testID="paso-datos-delegado" style={{ flex: 1 }} className="bg-gray-50">
      <CabeceraDelegado titulo="Registro de nuevo delegado" onBack={() => irAlPasoAnterior()} />
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
            <Text className="text-gray-900 text-lg font-semibold mb-1">Datos del delegado</Text>
            {nombreClub ? (
              <Text className="text-gray-500 text-sm">
                Fichándose en <Text className="font-bold">{nombreClub}</Text>
              </Text>
            ) : (
              <Text className="text-gray-500 text-sm">Ingresá tus datos personales</Text>
            )}
          </View>

          <View
            className="gap-3"
            onLayout={(e) => { formTopRef.current = e.nativeEvent.layout.y }}
          >
            <View onLayout={handleFieldLayout('nombre')}>
              <CampoTexto
                inputTestID="input-nombre-delegado"
                label="Nombre"
                placeholder="Ingresá tu nombre"
                value={nombre}
                onChangeText={(v) => setNombre(capitalizar(v))}
                error={errores.nombre ?? undefined}
                onBlur={() => actualizarError('nombre', validarNombre(nombre))}
                onFocus={() => scrollToField('nombre')}
              />
            </View>
            <View onLayout={handleFieldLayout('apellido')}>
              <CampoTexto
                inputTestID="input-apellido-delegado"
                label="Apellido"
                placeholder="Ingresá tu apellido"
                value={apellido}
                onChangeText={(v) => setApellido(capitalizar(v))}
                error={errores.apellido ?? undefined}
                onBlur={() => actualizarError('apellido', validarApellido(apellido))}
                onFocus={() => scrollToField('apellido')}
              />
            </View>
            <View onLayout={handleFieldLayout('dni')}>
              <CampoTexto
                inputTestID="input-dni-delegado"
                label="DNI"
                placeholder="Ingresá tu DNI (7-9 dígitos)"
                value={dni}
                onChangeText={(v) => {
                  setDni(v.replace(/[^0-9]/g, '').slice(0, 9))
                  setError(null)
                }}
                onBlur={() => actualizarError('dni', validarDni(dni))}
                error={errores.dni ?? undefined}
                keyboardType="numeric"
                onFocus={() => scrollToField('dni')}
              />
            </View>

            <View onLayout={handleFieldLayout('fecha')}>
              <Text className="text-gray-700 text-sm mb-1.5">Fecha de nacimiento</Text>
              <TouchableOpacity
                testID="input-fecha-nacimiento-delegado"
                onPress={() => {
                  Keyboard.dismiss()
                  fechaSeleccionadaEnModal.current = fechaNac
                  setMostrarPicker(true)
                }}
                className={`w-full px-4 py-5 rounded-2xl bg-gray-50 border-2 ${
                  errores.fechaNac ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <Text className={fechaNac ? 'text-gray-900' : 'text-[#9ca3af]'}>
                  {fechaNac ? formatearFecha(fechaNac) : 'Seleccioná la fecha de nacimiento'}
                </Text>
              </TouchableOpacity>
              {errores.fechaNac ? (
                <Text className="text-red-500 text-sm mt-1">{errores.fechaNac}</Text>
              ) : null}
            </View>

            <View onLayout={handleFieldLayout('email')}>
              <CampoTexto
                inputTestID="input-email-delegado"
                label="Email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={(v) => setEmail(v.trim())}
                onBlur={() => actualizarError('email', validarEmail(email))}
                error={errores.email ?? undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => scrollToField('email')}
              />
            </View>
            <View onLayout={handleFieldLayout('celular')}>
              <CampoTexto
                inputTestID="input-celular-delegado"
                label="Celular"
                placeholder="Ingresá tu número de celular"
                value={celular}
                onChangeText={(v) => setCelular(v.replace(/[^0-9]/g, ''))}
                onBlur={() => actualizarError('celular', validarCelular(celular))}
                error={errores.celular ?? undefined}
                keyboardType="numeric"
                onFocus={() => scrollToField('celular')}
              />
            </View>

            {error && <Text className="text-red-500 text-sm text-center">{error}</Text>}

            <BotonWizard
              testID="boton-continuar-datos"
              texto={loading ? 'Verificando...' : 'Continuar'}
              icono={loading ? undefined : 'arrow-right'}
              onPress={handleContinuar}
              deshabilitado={!puedeAvanzar || loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalFechaNacimiento
        visible={mostrarPicker}
        value={fechaNac}
        onClose={() => {
          Keyboard.dismiss()
          setMostrarPicker(false)
          const fechaActual = fechaSeleccionadaEnModal.current ?? fechaNac
          actualizarError(
            'fechaNac',
            fechaActual ? null : 'La fecha de nacimiento es obligatoria'
          )
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
