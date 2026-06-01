import React from 'react'
import { View } from 'react-native'
import { PantallaPublica } from '@/design-system/componentes/pantalla'
import { EstadoCarga } from '@/design-system/componentes/estado-carga'
import { useRouter } from 'expo-router'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/app/flujos/fichaje-jugador/pantalla-fichaje-deshabilitado'
import PantallaIntro from '@/app/flujos/fichaje-jugador/pantalla-intro'
import PantallaConfirmacion from '@/app/flujos/fichaje-jugador/pantalla-confirmacion'
import PasoCodigoEquipo from '@/app/flujos/fichaje-jugador/paso-codigo-equipo'
import PasoDatosJugador from '@/app/flujos/fichaje-jugador/fichaje-jugador-nuevo/paso-datos-jugador'
import PasoFoto from '@/app/flujos/fichaje-jugador/fichaje-jugador-nuevo/paso-foto'
import PasoFotosDni from '@/app/flujos/fichaje-jugador/fichaje-jugador-nuevo/paso-fotos-dni'
import PasoAutorizacion from '@/app/flujos/fichaje-jugador/fichaje-jugador-nuevo/paso-autorizacion'
import PasoDni from '@/app/flujos/fichaje-jugador/fichaje-jugador-existente/paso-dni'

const MENSAJE_CONFIRMACION = 'Vas a recibir la confirmación de tu fichaje por parte de tu delegado.'

export default function FichajesScreen() {
  const router = useRouter()
  const { flujo, paso, resetear } = useFichajeStore()
  const fichajeEstaHabilitado = useConfiguracionFichajeStore((s) => s.fichajeEstaHabilitado)
  const cargando = useConfiguracionFichajeStore((s) => s.cargando)

  const handleVolverInicio = () => {
    resetear()
    router.replace('/home' as any)
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
