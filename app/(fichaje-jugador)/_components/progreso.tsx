import React from 'react'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import BarraProgresoWizard from './barra-progreso-wizard'

export default function Progreso() {
  const { paso: pasoActual, calcularTotalPasos, esDelegado } = useFichajeStore()
  const totalPasos = calcularTotalPasos()

  return (
    <BarraProgresoWizard
      pasoActual={pasoActual}
      totalPasos={totalPasos}
      paddingTopExtra={esDelegado}
    />
  )
}
