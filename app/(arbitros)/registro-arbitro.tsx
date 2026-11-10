import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'
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
  const { paso, resetear, irAlPasoAnterior } = useRegistroArbitroStore()

  useEffect(() => {
    resetear()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init solo al montar; las deps del store no deben re-ejecutar
  }, [])

  const handleVolverInicio = () => {
    router.replace(RUTAS.HOME)
  }

  // Botón atrás de Android. Si la app arrancó por el link, no hay pantalla anterior en el stack:
  // en el paso 1 y en la pantalla final se va al Home en vez de cerrar la app.
  useEffect(() => {
    const suscripcion = BackHandler.addEventListener('hardwareBackPress', () => {
      if (paso > 1 && paso <= TOTAL_PASOS) {
        irAlPasoAnterior()
      } else {
        router.replace(RUTAS.HOME)
      }
      return true
    })
    return () => suscripcion.remove()
  }, [paso, irAlPasoAnterior, router])

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
