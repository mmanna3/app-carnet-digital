import React from 'react'
import { useRouter } from 'expo-router'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import PantallaIntro from '@/components/fichajes/pantalla-intro'
import PantallaConfirmacion from '@/components/fichajes/pantalla-confirmacion'
import PasoCodigoEquipo from '@/components/fichajes/paso-codigo-equipo'
import PasoDatosJugador from '@/components/fichajes/nuevo/paso-datos-jugador'
import PasoFoto from '@/components/fichajes/nuevo/paso-foto'
import PasoFotosDni from '@/components/fichajes/nuevo/paso-fotos-dni'
import PasoAutorizacion from '@/components/fichajes/nuevo/paso-autorizacion'
import PasoDni from '@/components/fichajes/ya-fichado/paso-dni'

const MENSAJE_CONFIRMACION = 'Vas a recibir la confirmación de tu fichaje por parte de tu delegado.'

export default function FichajesScreen() {
  const router = useRouter()
  const { flujo, paso, resetear } = useFichajeStore()

  const handleVolverInicio = () => {
    resetear()
    router.replace('/home' as any)
  }

  if (flujo === 'intro') {
    return <PantallaIntro onVolver={handleVolverInicio} />
  }

  if (flujo === 'nuevo') {
    if (paso === 1) return <PasoCodigoEquipo />
    if (paso === 2) return <PasoDatosJugador />
    if (paso === 3) return <PasoFoto />
    if (paso === 4) return <PasoFotosDni />
    if (paso === 5) return <PasoAutorizacion />
    if (paso === 6)
      return (
        <PantallaConfirmacion mensaje={MENSAJE_CONFIRMACION} onVolverInicio={handleVolverInicio} />
      )
  }

  if (flujo === 'yaFichado') {
    if (paso === 1) return <PasoCodigoEquipo />
    if (paso === 2) return <PasoDni />
    if (paso === 3)
      return (
        <PantallaConfirmacion mensaje={MENSAJE_CONFIRMACION} onVolverInicio={handleVolverInicio} />
      )
  }

  return null
}
