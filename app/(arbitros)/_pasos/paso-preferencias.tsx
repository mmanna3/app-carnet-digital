import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import Boton from '@/design-system/componentes/boton'
import { Texto } from '@/design-system/componentes'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import GrupoOpciones from '@/arbitros/_components/grupo-opciones'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { OPCIONES_FRANJAS } from '@/arbitros/_logica/catalogos'
import { useTorneosParaArbitros } from '@/arbitros/_logica/use-torneos-para-arbitros'
import { pasoPreferenciasCompleto } from '@/arbitros/_logica/validacion-registro-arbitro'

export default function PasoPreferencias() {
  const {
    paso,
    torneoAgrupadorIds,
    franjasHorarias,
    alternarTorneo,
    alternarFranja,
    irAlPasoSiguiente,
    irAlPasoAnterior,
  } = useRegistroArbitroStore()
  const { torneos, cargando, huboError, reintentar } = useTorneosParaArbitros()
  const opcionesTorneos = torneos.map((torneo) => ({
    valor: torneo.id as number,
    etiqueta: torneo.nombre ?? '',
    testID: `chip-torneo-${torneo.id}`,
  }))
  const puedeAvanzar = pasoPreferenciasCompleto({
    torneoAgrupadorIds,
    torneosDisponibles: opcionesTorneos.map((opcion) => opcion.valor),
    franjasHorarias,
  })

  return (
    <MarcoPaso
      testID="paso-preferencias"
      paso={paso}
      titulo="Preferencias deportivas"
      subtitulo="Qué torneos quiere arbitrar y cuándo puede hacerlo"
      onBack={irAlPasoAnterior}
    >
      {cargando ? (
        <View testID="torneos-cargando" className="items-center py-4">
          <ActivityIndicator />
        </View>
      ) : huboError ? (
        <View className="items-center gap-3 py-2">
          <Text testID="torneos-error" className="text-center text-sm text-red-400">
            No se pudieron cargar los torneos
          </Text>
          <Boton testID="boton-reintentar-torneos" texto="Reintentar" onPress={reintentar} />
        </View>
      ) : opcionesTorneos.length === 0 ? (
        <Texto testID="torneos-vacios" variante="caption" className="text-center text-zinc-400">
          No hay torneos disponibles por el momento. Probá de nuevo más tarde.
        </Texto>
      ) : (
        <GrupoOpciones
          etiqueta="Torneo de interés"
          opciones={opcionesTorneos}
          seleccionadas={torneoAgrupadorIds}
          onPress={alternarTorneo}
        />
      )}
      <GrupoOpciones
        etiqueta="Disponibilidad horaria"
        opciones={OPCIONES_FRANJAS}
        seleccionadas={franjasHorarias}
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
