import React, { useState } from 'react'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import GrupoOpciones from '@/arbitros/_components/grupo-opciones'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { TIPOS_MOVILIDAD, type TipoMovilidad } from '@/arbitros/catalogos'
import {
  pasoUbicacionCompleto,
  validarDireccion,
  validarLocalidad,
} from '@/arbitros/validacion-registro-arbitro'

type Errores = {
  direccion: string | null
  localidad: string | null
}

export default function PasoUbicacion() {
  const {
    paso,
    direccion,
    localidad,
    tipoMovilidad,
    setDireccion,
    setLocalidad,
    setTipoMovilidad,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useRegistroArbitroStore()
  const [errores, setErrores] = useState<Errores>({ direccion: null, localidad: null })
  const puedeAvanzar = pasoUbicacionCompleto({ direccion, localidad, tipoMovilidad })

  const actualizarError = (campo: keyof Errores, mensaje: string | null) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }))
  }

  return (
    <MarcoPaso
      testID="paso-ubicacion"
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
        error={errores.direccion ?? undefined}
        onBlur={() => actualizarError('direccion', validarDireccion(direccion))}
      />
      <CampoTexto
        inputTestID="input-localidad"
        label="Localidad"
        placeholder="Ingresá la localidad"
        value={localidad}
        onChangeText={setLocalidad}
        error={errores.localidad ?? undefined}
        onBlur={() => actualizarError('localidad', validarLocalidad(localidad))}
      />
      <GrupoOpciones
        testIDPrefijo="chip-movilidad"
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
    </MarcoPaso>
  )
}
