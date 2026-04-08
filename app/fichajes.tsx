import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/components/fichajes/pantalla-fichaje-deshabilitado'
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
  const fichajeEstaHabilitado = useConfiguracionFichajeStore((s) => s.fichajeEstaHabilitado)
  const cargando = useConfiguracionFichajeStore((s) => s.cargando)

  const handleVolverInicio = () => {
    resetear()
    router.replace('/home' as any)
  }

  if (fichajeEstaHabilitado === null || cargando) {
    return (
      <View className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
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
