import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import PasoDatosPersonales from '@/arbitros/_pasos/paso-datos-personales'
import PasoUbicacion from '@/arbitros/_pasos/paso-ubicacion'
import PasoPreferencias from '@/arbitros/_pasos/paso-preferencias'
import PasoAntecedentes from '@/arbitros/_pasos/paso-antecedentes'
import PantallaCompletado from '@/arbitros/_pasos/pantalla-completado'
import { useRegistroArbitroStore } from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export default function RegistroArbitroScreen() {
  const router = useRouter()
  const { paso, resetear } = useRegistroArbitroStore()

  useEffect(() => {
    resetear()
    console.log('Reset')
  }, [])

  const handleVolverInicio = () => {
    router.replace(RUTAS.HOME)
  }

  if (paso === 1) return <PasoDatosPersonales onVolverInicio={handleVolverInicio} />
  if (paso === 2) return <PasoUbicacion />
  if (paso === 3) return <PasoPreferencias />
  if (paso === 4) return <PasoAntecedentes />
  if (paso === 5) return <PantallaCompletado onVolverInicio={handleVolverInicio} />

  return null
}
