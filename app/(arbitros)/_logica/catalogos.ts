export const TIPOS_MOVILIDAD = ['MOTO', 'AUTO', 'BICICLETA', 'TRANSPORTE PUBLICO'] as const
export type TipoMovilidad = (typeof TIPOS_MOVILIDAD)[number]

export const TORNEOS_INTERES = [
  'BABY FUTBOL',
  'FUTSAL MASCULINO / MAYORES',
  'FUTSAL FEMENINO',
  'FUTBOL 11',
] as const
export type TorneoInteres = (typeof TORNEOS_INTERES)[number]

export const FRANJAS_HORARIAS = [
  'SABADOS 8 A 14',
  'SABADOS 13 A 20',
  'DOMINGOS 9 A 15',
  'DOMINGOS 15 A 22',
  'MARTES A VIERNES DE 20 A 23:30',
] as const
export type FranjaHoraria = (typeof FRANJAS_HORARIAS)[number]
