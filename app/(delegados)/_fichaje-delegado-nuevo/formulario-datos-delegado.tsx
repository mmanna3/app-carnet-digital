import React from 'react'
import { View, Text, TouchableOpacity, Keyboard, type LayoutChangeEvent } from 'react-native'
import { capitalizar, formatearFecha } from '@/lib/utilidades/formateo-formulario'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import {
  type ErroresCamposDelegado,
  validarApellido,
  validarCelular,
  validarDni,
  validarEmail,
  validarNombre,
} from './validacion-datos-delegado'

type FormularioDatosDelegadoProps = {
  nombre: string
  apellido: string
  dni: string
  fechaNac: Date | null
  email: string
  celular: string
  errores: ErroresCamposDelegado
  error: string | null
  loading: boolean
  puedeAvanzar: boolean
  onFormLayout: (e: LayoutChangeEvent) => void
  handleFieldLayout: (fieldKey: string) => (e: LayoutChangeEvent) => void
  scrollToField: (fieldKey: string) => void
  actualizarError: (campo: keyof ErroresCamposDelegado, mensaje: string | null) => void
  setNombre: (v: string) => void
  setApellido: (v: string) => void
  setDni: (v: string) => void
  setEmail: (v: string) => void
  setCelular: (v: string) => void
  setError: (v: string | null) => void
  onAbrirFecha: () => void
  onContinuar: () => void
}

export default function FormularioDatosDelegado({
  nombre,
  apellido,
  dni,
  fechaNac,
  email,
  celular,
  errores,
  error,
  loading,
  puedeAvanzar,
  onFormLayout,
  handleFieldLayout,
  scrollToField,
  actualizarError,
  setNombre,
  setApellido,
  setDni,
  setEmail,
  setCelular,
  setError,
  onAbrirFecha,
  onContinuar,
}: FormularioDatosDelegadoProps) {
  return (
    <View className="gap-3" onLayout={onFormLayout}>
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
        <Text className="text-zinc-400 text-sm mb-1.5">Fecha de nacimiento</Text>
        <TouchableOpacity
          testID="input-fecha-nacimiento-delegado"
          onPress={() => {
            Keyboard.dismiss()
            onAbrirFecha()
          }}
          className={`glass w-full px-4 py-5 rounded-2xl border ${
            errores.fechaNac ? 'border-red-500/80' : 'border-border-glass'
          }`}
        >
          <Text className={fechaNac ? 'text-zinc-100' : 'text-zinc-500'}>
            {fechaNac ? formatearFecha(fechaNac) : 'Seleccioná la fecha de nacimiento'}
          </Text>
        </TouchableOpacity>
        {errores.fechaNac ? (
          <Text className="text-red-400 text-sm mt-1">{errores.fechaNac}</Text>
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

      {error && <Text className="text-red-400 text-sm text-center">{error}</Text>}

      <Boton
        testID="boton-continuar-datos"
        texto={loading ? 'Verificando...' : 'Continuar'}
        icono="arrow-right"
        cargando={loading}
        onPress={onContinuar}
        deshabilitado={!puedeAvanzar || loading}
      />
    </View>
  )
}
