import { FranjaHorariaArbitroEnum, TipoMovilidadArbitroEnum } from '@/lib/api/clients'

export type OpcionCatalogo<T> = {
  valor: T
  etiqueta: string
  testID: string
}

export const OPCIONES_MOVILIDAD: readonly OpcionCatalogo<TipoMovilidadArbitroEnum>[] = [
  { valor: TipoMovilidadArbitroEnum._1, etiqueta: 'MOTO', testID: 'chip-movilidad-MOTO' },
  { valor: TipoMovilidadArbitroEnum._2, etiqueta: 'AUTO', testID: 'chip-movilidad-AUTO' },
  { valor: TipoMovilidadArbitroEnum._3, etiqueta: 'BICICLETA', testID: 'chip-movilidad-BICICLETA' },
  {
    valor: TipoMovilidadArbitroEnum._4,
    etiqueta: 'TRANSPORTE PUBLICO',
    testID: 'chip-movilidad-TRANSPORTE_PUBLICO',
  },
]

export const OPCIONES_FRANJAS: readonly OpcionCatalogo<FranjaHorariaArbitroEnum>[] = [
  { valor: FranjaHorariaArbitroEnum._1, etiqueta: 'SABADOS 8 A 14', testID: 'chip-franja-1' },
  { valor: FranjaHorariaArbitroEnum._2, etiqueta: 'SABADOS 13 A 20', testID: 'chip-franja-2' },
  { valor: FranjaHorariaArbitroEnum._3, etiqueta: 'DOMINGOS 9 A 15', testID: 'chip-franja-3' },
  { valor: FranjaHorariaArbitroEnum._4, etiqueta: 'DOMINGOS 15 A 22', testID: 'chip-franja-4' },
  {
    valor: FranjaHorariaArbitroEnum._5,
    etiqueta: 'MARTES A VIERNES DE 20 A 23:30',
    testID: 'chip-franja-5',
  },
]
