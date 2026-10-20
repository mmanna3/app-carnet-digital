import React, { useState } from 'react'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import { Texto } from '@/design-system/componentes'
import MarcoPaso from '@/arbitros/_components/marco-paso'
import GrupoOpciones from '@/arbitros/_components/grupo-opciones'
import { useConfigLiga } from '@/logica-compartida/config/liga'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { pasoAntecedentesCompleto } from '@/logica-compartida/utilidades/validacion-registro-arbitro'

function preguntaRelacionInstitucional(nombreLiga: string | undefined): string {
  const nombre = nombreLiga?.trim()
  const liga = nombre ? `la liga ${nombre}` : 'la liga'
  return `¿Tiene o tuvo relación con alguna institución que disputa torneos en ${liga}?`
}

export default function PasoAntecedentes() {
  const {
    paso,
    tieneRelacionInstitucional,
    institucion,
    setTieneRelacionInstitucional,
    setInstitucion,
    irAlPasoAnterior,
    irAlPasoSiguiente,
    enviarRegistro,
  } = useRegistroArbitroStore()
  const nombreLiga = useConfigLiga()?.leagueDisplayName
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const puedeFinalizar = pasoAntecedentesCompleto({ tieneRelacionInstitucional, institucion })
  const seleccion =
    tieneRelacionInstitucional === null ? [] : [tieneRelacionInstitucional ? 'Sí' : 'No']

  const handleFinalizar = async () => {
    setError(null)
    setLoading(true)
    const result = await enviarRegistro()
    setLoading(false)
    if (result.ok) {
      irAlPasoSiguiente()
    } else {
      setError(result.error ?? 'No se pudo enviar el registro')
    }
  }

  return (
    <MarcoPaso
      paso={paso}
      titulo="Antecedentes institucionales"
      subtitulo="Relaciones con clubes de la liga"
      onBack={irAlPasoAnterior}
    >
      <GrupoOpciones
        etiqueta={preguntaRelacionInstitucional(nombreLiga)}
        opciones={['Sí', 'No']}
        seleccionadas={seleccion}
        onPress={(valor) => setTieneRelacionInstitucional(valor === 'Sí')}
      />
      {tieneRelacionInstitucional ? (
        <CampoTexto
          inputTestID="input-institucion"
          label="Institución"
          placeholder="Indicar nombre de la institución"
          value={institucion}
          onChangeText={setInstitucion}
        />
      ) : null}
      {error ? (
        <Texto variante="caption" className="text-center text-red-400">
          {error}
        </Texto>
      ) : null}
      <Boton
        testID="boton-finalizar"
        texto="Finalizar"
        icono="check"
        onPress={handleFinalizar}
        deshabilitado={!puedeFinalizar}
        cargando={loading}
      />
    </MarcoPaso>
  )
}
