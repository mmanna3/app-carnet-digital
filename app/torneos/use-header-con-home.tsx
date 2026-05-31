import { useCabeceraPublica } from '@/components/ui/cabecera-publica'

/** @deprecated Usar useCabeceraPublica — se mantiene el nombre por compatibilidad en torneos */
export function useHeaderConHome({
  titulo,
  backgroundColor: _backgroundColor,
}: {
  titulo: string
  backgroundColor?: string
}) {
  useCabeceraPublica({ titulo })
}
