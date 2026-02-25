import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useEquipoStore } from '@/app/hooks/use-equipo-store'
import { useFichajeStore } from '@/app/hooks/use-fichaje-store'
import PantallaIntroDelegado from '@/components/fichajes/pantalla-intro-delegado'
import PantallaConfirmacion from '@/components/fichajes/pantalla-confirmacion'
import PasoDatosJugador from '@/components/fichajes/nuevo/paso-datos-jugador'
import PasoFoto from '@/components/fichajes/nuevo/paso-foto'
import PasoFotosDni from '@/components/fichajes/nuevo/paso-fotos-dni'
import PasoAutorizacion from '@/components/fichajes/nuevo/paso-autorizacion'
import PasoDni from '@/components/fichajes/ya-fichado/paso-dni'

const MENSAJE_CONFIRMACION = 'El fichaje fue completado exitosamente.'

export default function FichajeDelegadoScreen() {
  const router = useRouter()
  const { equipoSeleccionadoCodigo, equipoSeleccionadoNombre } = useEquipoStore()
  const {
    flujo,
    paso,
    resetear,
    reiniciarParaOtroJugador,
    irANuevo,
    irAYaFichado,
    irAlPasoInicial,
    setCodigoEquipo,
    setNombreEquipo,
    setEsDelegado,
  } = useFichajeStore()

  useEffect(() => {
    resetear()
    setCodigoEquipo(equipoSeleccionadoCodigo ?? '')
    setNombreEquipo(equipoSeleccionadoNombre ?? null)
    setEsDelegado(true)
  }, [])

  const handleVolverInicio = () => {
    resetear()
    router.back()
  }

  const handleFicharOtro = () => {
    reiniciarParaOtroJugador()
  }

  if (flujo === 'intro') {
    return (
      <PantallaIntroDelegado
        onNuevo={() => {
          irANuevo()
          irAlPasoInicial()
        }}
        onYaFichado={() => {
          irAYaFichado()
          irAlPasoInicial()
        }}
        onVolver={handleVolverInicio}
      />
    )
  }

  if (flujo === 'nuevo') {
    if (paso === 1) return <PasoDatosJugador />
    if (paso === 2) return <PasoFoto />
    if (paso === 3) return <PasoFotosDni />
    if (paso === 4) return <PasoAutorizacion />
    if (paso === 5)
      return (
        <PantallaConfirmacion
          mensaje={MENSAJE_CONFIRMACION}
          onVolverInicio={handleVolverInicio}
          onFicharOtro={handleFicharOtro}
        />
      )
  }

  if (flujo === 'yaFichado') {
    if (paso === 1) return <PasoDni />
    if (paso === 2)
      return (
        <PantallaConfirmacion
          mensaje={MENSAJE_CONFIRMACION}
          onVolverInicio={handleVolverInicio}
          onFicharOtro={handleFicharOtro}
        />
      )
  }

  return null
}
