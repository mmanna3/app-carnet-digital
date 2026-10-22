import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import PasoDatosPersonales from '@/arbitros/_pasos/paso-datos-personales'
import PasoUbicacion from '@/arbitros/_pasos/paso-ubicacion'
import PasoPreferencias from '@/arbitros/_pasos/paso-preferencias'
import PasoAntecedentes from '@/arbitros/_pasos/paso-antecedentes'
import PantallaCompletado from '@/design-system/componentes/pantalla-completado'
import {
  TOTAL_PASOS,
  useRegistroArbitroStore,
} from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export default function RegistroArbitroScreen() {
  const router = useRouter()
  const { paso, resetear } = useRegistroArbitroStore()

  useEffect(() => {
    resetear()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init solo al montar; las deps del store no deben re-ejecutar
  }, [])

  const handleVolverInicio = () => {
    router.replace(RUTAS.HOME)
  }

  if (paso === 1) return <PasoDatosPersonales onVolverInicio={handleVolverInicio} />
  if (paso === 2) return <PasoUbicacion />
  if (paso === 3) return <PasoPreferencias />
  if (paso === 4) return <PasoAntecedentes />
  if (paso === TOTAL_PASOS + 1) {
    return (
      <PantallaCompletado
        titulo="¡Registro enviado!"
        mensaje="La liga se va a comunicar con vos."
        testID="pantalla-completado-arbitro"
        testIDBoton="boton-volver-inicio-arbitro"
        onVolverInicio={handleVolverInicio}
      />
    )
  }

  return null
}
