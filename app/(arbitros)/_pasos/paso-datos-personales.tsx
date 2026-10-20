import React from 'react'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { pasoDatosPersonalesCompleto } from '@/logica-compartida/utilidades/validacion-registro-arbitro'
import { capitalizar } from '@/logica-compartida/utilidades/formateo-formulario'

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
    setDni,
    setApellido,
    setNombre,
    setTelefonoCelular,
    irAlPasoSiguiente,
  } = useRegistroArbitroStore()

  const puedeAvanzar = pasoDatosPersonalesCompleto({ dni, apellido, nombre, telefonoCelular })

  return (
    <MarcoPaso
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
      />
      <CampoTexto
        inputTestID="input-apellido"
        label="Apellidos"
        placeholder="Ingresá los apellidos"
        value={apellido}
        onChangeText={(valor) => setApellido(capitalizar(valor))}
      />
      <CampoTexto
        inputTestID="input-dni"
        label="DNI"
        placeholder="Ingresá el DNI (7-9 dígitos)"
        value={dni}
        onChangeText={(valor) => setDni(valor.replace(/\D/g, '').slice(0, 9))}
        keyboardType="numeric"
      />
      <CampoTexto
        inputTestID="input-telefono"
        label="Teléfono celular"
        placeholder="Ingresá el teléfono celular"
        value={telefonoCelular}
        onChangeText={(valor) => setTelefonoCelular(valor.replace(/\D/g, ''))}
        keyboardType="phone-pad"
      />
      <Boton
        testID="boton-continuar"
        texto="Continuar"
        icono="arrow-right"
        onPress={irAlPasoSiguiente}
        deshabilitado={!puedeAvanzar}
      />
    </MarcoPaso>
  )
}
