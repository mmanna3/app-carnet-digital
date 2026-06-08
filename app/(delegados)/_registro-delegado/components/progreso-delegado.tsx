import React from 'react'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import BarraProgresoWizard from '@/fichaje-jugador/_components/barra-progreso-wizard'

export default function ProgresoDelegado() {
  const { paso: pasoActual, calcularTotalPasos } = useFichajeDelegadoStore()
  const totalPasos = calcularTotalPasos()

  return <BarraProgresoWizard pasoActual={pasoActual} totalPasos={totalPasos} />
}
