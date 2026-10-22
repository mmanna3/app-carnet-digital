import React, { useRef, useState } from 'react'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import ModalFechaNacimiento from '@/fichaje-jugador/_components/modal-fecha-nacimiento'
import Boton from '@/design-system/componentes/boton'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import {
  DIGITOS_CELULAR,
  LARGO_MAXIMO_NOMBRE,
  pasoDatosPersonalesCompleto,
  validarApellido,
  validarCelular,
  validarDni,
  validarFechaNacimiento,
  validarNombre,
} from '@/arbitros/_logica/validacion-registro-arbitro'
import { capitalizar, formatearFecha } from '@/logica-compartida/utilidades/formateo-formulario'

type Errores = {
  nombre: string | null
  apellido: string | null
  dni: string | null
  telefonoCelular: string | null
  fechaNacimiento: string | null
}

const ERRORES_INICIALES: Errores = {
  nombre: null,
  apellido: null,
  dni: null,
  telefonoCelular: null,
  fechaNacimiento: null,
}

type Props = {
  onVolverInicio: () => void
}

export default function PasoDatosPersonales({ onVolverInicio }: Props) {
  const {
    paso,
    dni,
    apellido,
    nombre,
    telefonoCelular,
    fechaNacimiento,
    setDni,
    setApellido,
    setNombre,
    setTelefonoCelular,
    setFechaNacimiento,
    irAlPasoSiguiente,
  } = useRegistroArbitroStore()
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const [errores, setErrores] = useState<Errores>(ERRORES_INICIALES)
  const fechaSeleccionadaEnModal = useRef<Date | null>(null)

  const actualizarError = (campo: keyof Errores, mensaje: string | null) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }))
  }

  const puedeAvanzar = pasoDatosPersonalesCompleto({
    dni,
    apellido,
    nombre,
    telefonoCelular,
    fechaNacimiento,
  })

  return (
    <MarcoPaso
      testID="paso-datos-personales"
      paso={paso}
      titulo="Datos personales"
      subtitulo="Identificación y contacto"
      onBack={onVolverInicio}
    >
      <CampoTexto
        inputTestID="input-nombre"
        label="Nombre"
        placeholder="Ingresá el nombre"
        value={nombre}
        onChangeText={(valor) => setNombre(capitalizar(valor))}
        error={errores.nombre ?? undefined}
        onBlur={() => actualizarError('nombre', validarNombre(nombre))}
        maxLength={LARGO_MAXIMO_NOMBRE}
      />
      <CampoTexto
        inputTestID="input-apellido"
        label="Apellidos"
        placeholder="Ingresá los apellidos"
        value={apellido}
        onChangeText={(valor) => setApellido(capitalizar(valor))}
        error={errores.apellido ?? undefined}
        onBlur={() => actualizarError('apellido', validarApellido(apellido))}
        maxLength={LARGO_MAXIMO_NOMBRE}
      />
      <CampoTexto
        inputTestID="input-dni"
        label="DNI"
        placeholder="Ingresá el DNI (7-9 dígitos)"
        value={dni}
        onChangeText={(valor) => setDni(valor.replace(/\D/g, '').slice(0, 9))}
        error={errores.dni ?? undefined}
        onBlur={() => actualizarError('dni', validarDni(dni))}
        keyboardType="numeric"
      />
      <CampoTexto
        inputTestID="input-telefono"
        label="Teléfono celular"
        placeholder="Ingresá el teléfono celular"
        value={telefonoCelular}
        onChangeText={(valor) =>
          setTelefonoCelular(valor.replace(/\D/g, '').slice(0, DIGITOS_CELULAR))
        }
        error={errores.telefonoCelular ?? undefined}
        onBlur={() => actualizarError('telefonoCelular', validarCelular(telefonoCelular))}
        keyboardType="phone-pad"
        maxLength={DIGITOS_CELULAR}
      />
      <View>
        <Text className="mb-1.5 text-sm text-zinc-400">Fecha de nacimiento</Text>
        <TouchableOpacity
          testID="input-fecha-nacimiento"
          onPress={() => {
            Keyboard.dismiss()
            fechaSeleccionadaEnModal.current = fechaNacimiento
            setMostrarPicker(true)
          }}
          className={`glass w-full rounded-2xl border px-4 py-5 ${
            errores.fechaNacimiento ? 'border-red-500/80' : 'border-border-glass'
          }`}
        >
          <Text className={fechaNacimiento ? 'text-zinc-100' : 'text-zinc-500'}>
            {fechaNacimiento
              ? formatearFecha(fechaNacimiento)
              : 'Seleccioná la fecha de nacimiento'}
          </Text>
        </TouchableOpacity>
        {errores.fechaNacimiento ? (
          <Text className="mt-1 text-sm text-red-400">{errores.fechaNacimiento}</Text>
        ) : null}
      </View>
      <Boton
        testID="boton-continuar"
        texto="Continuar"
        icono="arrow-right"
        onPress={irAlPasoSiguiente}
        deshabilitado={!puedeAvanzar}
      />
      <ModalFechaNacimiento
        visible={mostrarPicker}
        value={fechaNacimiento}
        onClose={() => {
          Keyboard.dismiss()
          setMostrarPicker(false)
          const fechaActual = fechaSeleccionadaEnModal.current ?? fechaNacimiento
          actualizarError('fechaNacimiento', validarFechaNacimiento(fechaActual))
          fechaSeleccionadaEnModal.current = null
        }}
        onChange={(fecha) => {
          fechaSeleccionadaEnModal.current = fecha
          setFechaNacimiento(fecha)
          actualizarError('fechaNacimiento', null)
        }}
      />
    </MarcoPaso>
  )
}
