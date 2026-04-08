import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/components/fichajes/pantalla-fichaje-deshabilitado'
import PantallaIntroDelegadoRegistro from '@/components/fichajes-delegado/pantalla-intro'
import PasoCodigoClub from '@/components/fichajes-delegado/paso-codigo-club'
import PasoDatosDelegado from '@/components/fichajes-delegado/nuevo/paso-datos-delegado'
import PasoFotoDelegado from '@/components/fichajes-delegado/nuevo/paso-foto-delegado'
import PasoFotosDniDelegado from '@/components/fichajes-delegado/nuevo/paso-fotos-dni-delegado'
import PasoConfirmacionDelegado from '@/components/fichajes-delegado/nuevo/paso-confirmacion-delegado'
import PasoDniDelegado from '@/components/fichajes-delegado/ya-registrado/paso-dni-delegado'
import PasoConfirmacionYaRegistrado from '@/components/fichajes-delegado/ya-registrado/paso-confirmacion-ya-registrado'
import PantallaCompletado from '@/components/fichajes-delegado/pantalla-completado'

export default function RegistroDelegadoScreen() {
  const router = useRouter()
  const { flujo, paso, resetear } = useFichajeDelegadoStore()
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
    return (
      <PantallaFichajeDeshabilitado tituloCabecera="Registro de delegado" onVolver={handleVolverInicio} />
    )
  }

  if (flujo === 'intro') {
    return <PantallaIntroDelegadoRegistro onVolver={handleVolverInicio} />
  }

  if (flujo === 'azul') {
    if (paso === 1) return <PasoCodigoClub />
    if (paso === 2) return <PasoDatosDelegado />
    if (paso === 3) return <PasoFotoDelegado />
    if (paso === 4) return <PasoFotosDniDelegado />
    if (paso === 5) return <PasoConfirmacionDelegado />
    if (paso === 6) return <PantallaCompletado onVolverInicio={handleVolverInicio} />
  }

  if (flujo === 'verde') {
    if (paso === 1) return <PasoCodigoClub />
    if (paso === 2) return <PasoDniDelegado />
    if (paso === 3) return <PasoConfirmacionYaRegistrado />
    if (paso === 4) return <PantallaCompletado onVolverInicio={handleVolverInicio} />
  }

  return null
}
