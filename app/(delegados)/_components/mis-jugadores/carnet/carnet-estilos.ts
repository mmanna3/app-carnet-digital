import { StyleSheet } from 'react-native'

/** Logos por liga (require estático para Metro; mismas rutas que home). */
export const LOGOS_LIGAS: Record<string, number> = {
  edefi: require('@/assets/ligas/edefi/icon.png'),
  luefi: require('@/assets/ligas/luefi/icono.png'),
}

export const ANCHO_FOTO = 192
export const GAP_FOTO_TARJETAS = 12

export const COLORES_ESTADO = {
  ROJO_CLAUSURA: '#B71C1C',
  ROJO_CLAUSURA_BORDE: '#5D0000',
  AMARILLO_INHABILITADO: '#FACC15',
  GRIS_TEXTO_INHABILITADO: '#71717A',
  GRIS_FRANJA_INHABILITADO: '#D4D4D8',
} as const

export const estilosFoto = StyleSheet.create({
  marco: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  carnet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
})
