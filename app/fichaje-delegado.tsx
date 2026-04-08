import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useEquipoStore } from '@/lib/hooks/use-equipo-store'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/components/fichajes/pantalla-fichaje-deshabilitado'
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
  const fichajeEstaHabilitado = useConfiguracionFichajeStore((s) => s.fichajeEstaHabilitado)
  const cargando = useConfiguracionFichajeStore((s) => s.cargando)

  useEffect(() => {
    resetear()
    setCodigoEquipo(equipoSeleccionadoCodigo ?? '')
    setNombreEquipo(equipoSeleccionadoNombre ?? null)
    setEsDelegado(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init solo al montar; las deps del store no deben re-ejecutar
  }, [])

  const handleVolverInicio = () => {
    resetear()
    router.back()
  }

  const handleFicharOtro = () => {
    reiniciarParaOtroJugador()
  }

  if (fichajeEstaHabilitado === null || cargando) {
    return (
      <View className="flex-1 bg-blue-50 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (fichajeEstaHabilitado === false) {
    return (
      <PantallaFichajeDeshabilitado tituloCabecera="Fichar jugador" onVolver={handleVolverInicio} />
    )
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
