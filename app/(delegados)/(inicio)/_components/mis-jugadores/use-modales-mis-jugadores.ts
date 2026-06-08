import { useCallback, useState } from 'react'
import { CarnetDigitalDTO } from '@/lib/api/clients'

export type ModalActiva = 'acciones' | 'eliminar' | 'transferir' | null
export type ModalBulk = 'eliminar' | 'transferir' | null

type UseModalesMisJugadoresOptions = {
  invalidarCarnets: () => void
  desactivarSeleccion: () => void
}

export function useModalesMisJugadores({
  invalidarCarnets,
  desactivarSeleccion,
}: UseModalesMisJugadoresOptions) {
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<CarnetDigitalDTO | null>(null)
  const [modalActiva, setModalActiva] = useState<ModalActiva>(null)
  const [modalBulk, setModalBulk] = useState<ModalBulk>(null)

  const handleLongPress = useCallback((jugador: CarnetDigitalDTO) => {
    setJugadorSeleccionado(jugador)
    setModalActiva('acciones')
  }, [])

  const cerrarModales = useCallback(() => {
    setModalActiva(null)
    setJugadorSeleccionado(null)
  }, [])

  const handleEliminado = useCallback(() => {
    cerrarModales()
    invalidarCarnets()
  }, [cerrarModales, invalidarCarnets])

  const handleTransferido = useCallback(() => {
    cerrarModales()
    invalidarCarnets()
  }, [cerrarModales, invalidarCarnets])

  const handleEliminadoMasivo = useCallback(() => {
    setModalBulk(null)
    desactivarSeleccion()
    invalidarCarnets()
  }, [desactivarSeleccion, invalidarCarnets])

  const handleTransferidoMasivo = useCallback(() => {
    setModalBulk(null)
    desactivarSeleccion()
    invalidarCarnets()
  }, [desactivarSeleccion, invalidarCarnets])

  return {
    jugadorSeleccionado,
    modalActiva,
    setModalActiva,
    modalBulk,
    setModalBulk,
    handleLongPress,
    cerrarModales,
    handleEliminado,
    handleTransferido,
    handleEliminadoMasivo,
    handleTransferidoMasivo,
  }
}
