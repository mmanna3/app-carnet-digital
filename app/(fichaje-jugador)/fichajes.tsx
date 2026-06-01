import React from 'react'
import { View } from 'react-native'
import { PantallaPublica } from '@/design-system/componentes/pantalla'
import { EstadoCarga } from '@/design-system/componentes/estado-carga'
import { useRouter } from 'expo-router'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/fichaje-jugador/_pasos/pantalla-fichaje-deshabilitado'
import PantallaIntro from '@/fichaje-jugador/_pasos/pantalla-intro'
import PantallaConfirmacion from '@/fichaje-jugador/_pasos/pantalla-confirmacion'
import PasoCodigoEquipo from '@/fichaje-jugador/_pasos/paso-codigo-equipo'
import PasoDatosJugador from '@/fichaje-jugador/_pasos/fichaje-nuevo/paso-datos-jugador'
import PasoFoto from '@/fichaje-jugador/_pasos/fichaje-nuevo/paso-foto'
import PasoFotosDni from '@/fichaje-jugador/_pasos/fichaje-nuevo/paso-fotos-dni'
import PasoAutorizacion from '@/fichaje-jugador/_pasos/fichaje-nuevo/paso-autorizacion'
import PasoDni from '@/fichaje-jugador/_pasos/fichaje-existente/paso-dni'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

const MENSAJE_CONFIRMACION = 'Vas a recibir la confirmación de tu fichaje por parte de tu delegado.'

export default function FichajesScreen() {
  const router = useRouter()
  const { flujo, paso, resetear } = useFichajeStore()
  const fichajeEstaHabilitado = useConfiguracionFichajeStore((s) => s.fichajeEstaHabilitado)
  const cargando = useConfiguracionFichajeStore((s) => s.cargando)

  const handleVolverInicio = () => {
    resetear()
    router.replace(RUTAS.HOME)
  }

  if (fichajeEstaHabilitado === null || cargando) {
    return (
      <PantallaPublica className="bg-surface">
        <EstadoCarga />
      </PantallaPublica>
    )
  }

  if (fichajeEstaHabilitado === false) {
    return <PantallaFichajeDeshabilitado tituloCabecera="Fichaje" onVolver={handleVolverInicio} />
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
