import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import Cabecera from '@/fichaje-jugador/_components/cabecera'
import Progreso from '@/fichaje-jugador/_components/progreso'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import ModalFechaNacimiento from '@/fichaje-jugador/_components/modal-fecha-nacimiento'
import { Titulo } from '@/design-system/componentes'

const formatearFecha = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

/** Primera letra en mayúscula, resto en minúscula (por palabra) */
const capitalizar = (s: string) =>
  s
    .slice(0, 14)
    .split(' ')
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : ''))
    .join(' ')

export default function PasoDatosJugador() {
  const {
    nombre,
    apellido,
    dni,
    fechaNac,
    nombreEquipo,
    setNombre,
    setApellido,
    setDni,
    setFechaNac,
    irAlPasoAnterior,
    irAlPasoSiguiente,
    validarDniNuevo,
  } = useFichajeStore()
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dniValido = dni.trim().length >= 7 && dni.trim().length <= 9
  const puedeAvanzar = nombre.trim() && apellido.trim() && dniValido && !!fechaNac

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
    <View testID="paso-datos-jugador" style={{ flex: 1 }} className="bg-surface">
      {/* Cabecera y progreso fuera del KeyboardAvoidingView para no comprimir el scroll */}
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={() => irAlPasoAnterior()} />
      <Progreso />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Titulo>Datos del jugador</Titulo>
            {nombreEquipo ? (
              <Text className="text-zinc-400 text-sm">
                Fichándose en <Text className="font-bold text-zinc-100">{nombreEquipo}</Text>
              </Text>
            ) : (
              <Text className="text-zinc-400 text-sm">Ingresá tus datos personales</Text>
            )}
          </View>

          <View className="gap-3">
            <CampoTexto
              inputTestID="input-nombre"
              label="Nombre"
              placeholder="Ingresá el nombre del jugador"
              value={nombre}
              onChangeText={(v) => setNombre(capitalizar(v))}
            />
            <CampoTexto
              inputTestID="input-apellido"
              label="Apellido"
              placeholder="Ingresá el apellido del jugador"
              value={apellido}
              onChangeText={(v) => setApellido(capitalizar(v))}
            />
            <CampoTexto
              inputTestID="input-dni-jugador"
              label="DNI"
              placeholder="Ingresá el DNI del jugador (7-9 dígitos)"
              value={dni}
              onChangeText={(v) => {
                setDni(v.replace(/[^0-9]/g, '').slice(0, 9))
                setError(null)
              }}
              keyboardType="numeric"
            />

            <View>
              <Text className="text-zinc-400 text-sm mb-1.5">Fecha de nacimiento</Text>
              <TouchableOpacity
                testID="input-fecha-nacimiento"
                onPress={() => {
                  Keyboard.dismiss()
                  setMostrarPicker(true)
                }}
                className="glass w-full px-4 py-5 rounded-2xl border border-border-glass"
              >
                <Text className={fechaNac ? 'text-zinc-100' : 'text-zinc-500'}>
                  {fechaNac ? formatearFecha(fechaNac) : 'Seleccioná la fecha de nacimiento'}
                </Text>
              </TouchableOpacity>
            </View>

            {error && <Text className="text-red-400 text-sm text-center">{error}</Text>}

            <Boton
              testID="boton-continuar"
              texto={loading ? 'Verificando...' : 'Continuar'}
              icono="arrow-right"
              cargando={loading}
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
        }}
        onChange={setFechaNac}
      />
    </View>
  )
}
