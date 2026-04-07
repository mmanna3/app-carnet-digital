import { useWindowDimensions } from 'react-native'

/** Devuelve true cuando el ancho de pantalla supera el breakpoint (default 768px). */
export function usePantallaGrande(breakpoint = 768): boolean {
  const { width } = useWindowDimensions()
  return width >= breakpoint
}
