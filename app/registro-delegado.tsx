import React from 'react'
import { useRouter } from 'expo-router'
import { useFichajeDelegadoStore } from '@/lib/hooks/use-fichaje-delegado-store'
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

  const handleVolverInicio = () => {
    resetear()
    router.replace('/home' as any)
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
