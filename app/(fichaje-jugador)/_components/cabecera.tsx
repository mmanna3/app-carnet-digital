import React from 'react'
import { CabeceraPaso } from '@/design-system/componentes/cabecera-paso'
import { useFichajeStore } from '@/lib/hooks/use-fichaje-store'

interface Props {
  titulo: string
  onBack: () => void
}

export default function Cabecera({ titulo, onBack }: Props) {
  const { esDelegado } = useFichajeStore()

  if (esDelegado) return null

  return <CabeceraPaso titulo={titulo} onBack={onBack} />
}
