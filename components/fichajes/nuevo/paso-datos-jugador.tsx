import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import Cabecera from '../cabecera'
import Progreso from '../progreso'
import CampoTexto from '../campo-texto'
import BotonWizard from '../boton-wizard'

const FECHA_DEFAULT = new Date(2000, 0, 1)
const FECHA_MIN = new Date(1930, 0, 1)

const formatearFecha = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

export default function PasoDatosJugador() {
  const { nombre, apellido, dni, fechaNac, setNombre, setApellido, setDni, setFechaNac, irAPaso } =
    useFichajeStore()
  const [mostrarPicker, setMostrarPicker] = useState(false)

  const puedeAvanzar = nombre.trim() && apellido.trim() && dni.trim() && !!fechaNac

  const onCambioFecha = (_: any, date?: Date) => {
    if (Platform.OS === 'android') setMostrarPicker(false)
    if (date) setFechaNac(date)
  }

  return (
    <View testID="paso-datos-jugador" style={{ flex: 1 }} className="bg-gray-50">
      {/* Cabecera y progreso fuera del KeyboardAvoidingView para no comprimir el scroll */}
      <Cabecera titulo="Fichaje de nuevo jugador" onBack={() => irAPaso(1)} />
      <Progreso totalPasos={5} pasoActual={2} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className="text-gray-900 text-lg font-semibold mb-1">Datos generales</Text>
            <Text className="text-gray-500 text-sm">Ingresá tus datos personales</Text>
          </View>

          <View className="gap-3">
            <CampoTexto
              inputTestID="input-nombre"
              label="Tu nombre"
              placeholder="Ingresá tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <CampoTexto
              inputTestID="input-apellido"
              label="Tu apellido"
              placeholder="Ingresá tu apellido"
              value={apellido}
              onChangeText={setApellido}
            />
            <CampoTexto
              inputTestID="input-dni-jugador"
              label="Tu DNI"
              placeholder="Ingresá tu DNI"
              value={dni}
              onChangeText={(v) => setDni(v.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />

            <View>
              <Text className="text-gray-700 text-sm mb-1.5">Tu fecha de nacimiento</Text>
              <TouchableOpacity
                onPress={() => setMostrarPicker(true)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200"
              >
                <Text className={fechaNac ? 'text-gray-900' : 'text-[#9ca3af]'}>
                  {fechaNac ? formatearFecha(fechaNac) : 'Seleccioná tu fecha de nacimiento'}
                </Text>
              </TouchableOpacity>
            </View>

            {mostrarPicker && (
              <DateTimePicker
                value={fechaNac ?? FECHA_DEFAULT}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onCambioFecha}
                maximumDate={new Date()}
                minimumDate={FECHA_MIN}
                locale="es-AR"
              />
            )}

            {mostrarPicker && Platform.OS === 'ios' && (
              <TouchableOpacity onPress={() => setMostrarPicker(false)} className="items-end">
                <Text className="text-liga-600 font-semibold text-base">Listo</Text>
              </TouchableOpacity>
            )}

            <BotonWizard
              texto="Continuar"
              icono="arrow-right"
              onPress={() => irAPaso(3)}
              deshabilitado={!puedeAvanzar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
