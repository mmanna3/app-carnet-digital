import React from 'react'
import Boton from '@/design-system/componentes/boton'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import GrupoOpciones from '@/arbitros/_components/grupo-opciones'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { FRANJAS_HORARIAS, TORNEOS_INTERES } from '@/logica-compartida/constantes/registro-arbitro'
import { pasoPreferenciasCompleto } from '@/logica-compartida/utilidades/validacion-registro-arbitro'

export default function PasoPreferencias() {
  const {
    paso,
    torneosInteres,
    disponibilidadHoraria,
    alternarTorneo,
    alternarFranja,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useRegistroArbitroStore()
  const puedeAvanzar = pasoPreferenciasCompleto({ torneosInteres, disponibilidadHoraria })

  return (
    <MarcoPaso
      paso={paso}
      titulo="Preferencias deportivas"
      subtitulo="Qué torneos quiere arbitrar y cuándo puede hacerlo"
      onBack={irAlPasoAnterior}
    >
      <GrupoOpciones
        etiqueta="Torneo de interés"
        opciones={TORNEOS_INTERES}
        seleccionadas={torneosInteres}
        onPress={alternarTorneo}
      />
      <GrupoOpciones
        etiqueta="Disponibilidad horaria"
        opciones={FRANJAS_HORARIAS}
        seleccionadas={disponibilidadHoraria}
        onPress={alternarFranja}
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
