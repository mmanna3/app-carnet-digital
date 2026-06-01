import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
import { useConfiguracionFichajeStore } from '@/lib/hooks/use-configuracion-fichaje-store'
import PantallaFichajeDeshabilitado from '@/fichaje-jugador/_pasos/pantalla-fichaje-deshabilitado'
import PantallaIntroDelegadoRegistro from '@/delegados/_registro-delegado/components/pantalla-intro'
import PasoCodigoClub from '@/delegados/_registro-delegado/components/paso-codigo-club'
import PasoDatosDelegado from '@/delegados/_fichaje-delegado-nuevo/paso-datos-delegado'
import PasoFotoDelegado from '@/delegados/_fichaje-delegado-nuevo/paso-foto-delegado'
import PasoFotosDniDelegado from '@/delegados/_fichaje-delegado-nuevo/paso-fotos-dni-delegado'
import PasoConfirmacionDelegado from '@/delegados/_fichaje-delegado-nuevo/paso-confirmacion-delegado'
import PasoDniDelegado from '@/delegados/_fichaje-delegado-existente/paso-dni-delegado'
import PasoConfirmacionYaRegistrado from '@/delegados/_fichaje-delegado-existente/paso-confirmacion-ya-registrado'
import PantallaCompletado from '@/delegados/_registro-delegado/components/pantalla-completado'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export default function RegistroDelegadoScreen() {
  const router = useRouter()
  const { flujo, paso, resetear } = useFichajeDelegadoStore()
  const fichajeEstaHabilitado = useConfiguracionFichajeStore((s) => s.fichajeEstaHabilitado)
  const cargando = useConfiguracionFichajeStore((s) => s.cargando)

  const handleVolverInicio = () => {
    resetear()
    router.replace(RUTAS.HOME)
  }

  if (fichajeEstaHabilitado === null || cargando) {
    return (
      <View className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (fichajeEstaHabilitado === false) {
    return (
      <PantallaFichajeDeshabilitado
        tituloCabecera="Registro de delegado"
        onVolver={handleVolverInicio}
      />
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
