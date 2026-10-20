import React, { useState } from 'react'
import { Keyboard, Text, TouchableOpacity, View } from 'react-native'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import ModalFechaNacimiento from '@/fichaje-jugador/_components/modal-fecha-nacimiento'
import Boton from '@/design-system/componentes/boton'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import GrupoOpciones from '@/arbitros/_components/grupo-opciones'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import {
  TIPOS_MOVILIDAD,
  type TipoMovilidad,
} from '@/logica-compartida/constantes/registro-arbitro'
import { pasoUbicacionCompleto } from '@/logica-compartida/utilidades/validacion-registro-arbitro'
import { formatearFecha } from '@/logica-compartida/utilidades/formateo-formulario'

export default function PasoUbicacion() {
  const {
    paso,
    direccion,
    localidad,
    fechaNacimiento,
    tipoMovilidad,
    setDireccion,
    setLocalidad,
    setFechaNacimiento,
    setTipoMovilidad,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useRegistroArbitroStore()
  const [mostrarPicker, setMostrarPicker] = useState(false)
  const puedeAvanzar = pasoUbicacionCompleto({
    direccion,
    localidad,
    fechaNacimiento,
    tipoMovilidad,
  })

  return (
    <MarcoPaso
      paso={paso}
      titulo="Ubicación y movilidad"
      subtitulo="Dónde vive y cómo se traslada"
      onBack={irAlPasoAnterior}
    >
      <CampoTexto
        inputTestID="input-direccion"
        label="Dirección"
        placeholder="Ingresá la dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <CampoTexto
        inputTestID="input-localidad"
        label="Localidad"
        placeholder="Ingresá la localidad"
        value={localidad}
        onChangeText={setLocalidad}
      />
      <View>
        <Text className="mb-1.5 text-sm text-zinc-400">Fecha de nacimiento</Text>
        <TouchableOpacity
          testID="input-fecha-nacimiento"
          onPress={() => {
            Keyboard.dismiss()
            setMostrarPicker(true)
          }}
          className="glass w-full rounded-2xl border border-border-glass px-4 py-5"
        >
          <Text className={fechaNacimiento ? 'text-zinc-100' : 'text-zinc-500'}>
            {fechaNacimiento
              ? formatearFecha(fechaNacimiento)
              : 'Seleccioná la fecha de nacimiento'}
          </Text>
        </TouchableOpacity>
      </View>
      <GrupoOpciones
        etiqueta="Tipo de movilidad"
        opciones={TIPOS_MOVILIDAD}
        seleccionadas={tipoMovilidad ? [tipoMovilidad] : []}
        onPress={(valor) => setTipoMovilidad(valor as TipoMovilidad)}
      />
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
        onClose={() => setMostrarPicker(false)}
        onChange={setFechaNacimiento}
      />
    </MarcoPaso>
  )
}
