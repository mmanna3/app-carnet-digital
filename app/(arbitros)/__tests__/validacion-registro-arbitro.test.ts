import type { FranjaHorariaArbitroEnum, TipoMovilidadArbitroEnum } from '@/lib/api/clients'
import { OPCIONES_FRANJAS, OPCIONES_MOVILIDAD } from '@/arbitros/_logica/catalogos'
import {
  pasoAntecedentesCompleto,
  pasoDatosPersonalesCompleto,
  pasoPreferenciasCompleto,
  pasoUbicacionCompleto,
  validarCelular,
} from '@/arbitros/_logica/validacion-registro-arbitro'

const FECHA_NACIMIENTO = new Date(1990, 0, 1)

const DATOS_PERSONALES = {
  dni: '12345678',
  apellido: 'Perez',
  nombre: 'Juan',
  telefonoCelular: '11223344',
  fechaNacimiento: FECHA_NACIMIENTO,
}

describe('catálogos de registro de árbitro', () => {
  it('mapea movilidad a los valores del enum del back, con etiquetas y testID estables', () => {
    expect(OPCIONES_MOVILIDAD).toEqual([
      { valor: 1, etiqueta: 'MOTO', testID: 'chip-movilidad-MOTO' },
      { valor: 2, etiqueta: 'AUTO', testID: 'chip-movilidad-AUTO' },
      { valor: 3, etiqueta: 'BICICLETA', testID: 'chip-movilidad-BICICLETA' },
      { valor: 4, etiqueta: 'TRANSPORTE PUBLICO', testID: 'chip-movilidad-TRANSPORTE_PUBLICO' },
    ])
  })

  it('mapea las franjas a los valores del enum del back', () => {
    expect(OPCIONES_FRANJAS.map((o) => [o.valor, o.etiqueta, o.testID])).toEqual([
      [1, 'SABADOS 8 A 14', 'chip-franja-1'],
      [2, 'SABADOS 13 A 20', 'chip-franja-2'],
      [3, 'DOMINGOS 9 A 15', 'chip-franja-3'],
      [4, 'DOMINGOS 15 A 22', 'chip-franja-4'],
      [5, 'MARTES A VIERNES DE 20 A 23:30', 'chip-franja-5'],
    ])
  })
})

describe('pasoDatosPersonalesCompleto', () => {
  it('es verdadero con DNI, apellido, nombre y teléfono válidos', () => {
    expect(pasoDatosPersonalesCompleto(DATOS_PERSONALES)).toBe(true)
  })

  it('es falso si falta algún campo o el DNI o el teléfono no son válidos', () => {
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, dni: '' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, dni: '123456' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, dni: '1234567890' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, dni: '12.345.678' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, apellido: '  ' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, nombre: '' })).toBe(false)
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, telefonoCelular: '1234567' })).toBe(
      false
    )
    expect(pasoDatosPersonalesCompleto({ ...DATOS_PERSONALES, fechaNacimiento: null })).toBe(false)
  })
})

describe('validarCelular', () => {
  it('acepta exactamente 8 dígitos', () => {
    expect(validarCelular('11223344')).toBeNull()
  })

  it('rechaza vacío, menos o más de 8 dígitos y caracteres no numéricos', () => {
    expect(validarCelular('')).toBe('El celular es obligatorio')
    expect(validarCelular('1122334')).toBe('El celular debe tener 8 dígitos')
    expect(validarCelular('112233445')).toBe('El celular debe tener 8 dígitos')
    expect(validarCelular('1122-334')).toBe('El celular debe tener 8 dígitos')
  })
})

describe('pasoUbicacionCompleto', () => {
  it('exige dirección, localidad y un tipo de movilidad del catálogo', () => {
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        tipoMovilidad: 1,
      })
    ).toBe(true)
    expect(
      pasoUbicacionCompleto({
        direccion: '  ',
        localidad: 'Quilmes',
        tipoMovilidad: 1,
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: '',
        tipoMovilidad: 2,
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        tipoMovilidad: null,
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        tipoMovilidad: 99 as TipoMovilidadArbitroEnum,
      })
    ).toBe(false)
  })
})

describe('pasoPreferenciasCompleto', () => {
  const base = {
    torneoAgrupadorIds: [7],
    torneosDisponibles: [7, 8],
    franjasHorarias: [3] as FranjaHorariaArbitroEnum[],
  }

  it('exige al menos un torneo disponible y una franja del catálogo', () => {
    expect(pasoPreferenciasCompleto(base)).toBe(true)
    expect(pasoPreferenciasCompleto({ ...base, torneoAgrupadorIds: [] })).toBe(false)
    expect(pasoPreferenciasCompleto({ ...base, franjasHorarias: [] })).toBe(false)
    expect(pasoPreferenciasCompleto({ ...base, torneoAgrupadorIds: [99] })).toBe(false)
    expect(
      pasoPreferenciasCompleto({ ...base, franjasHorarias: [9 as FranjaHorariaArbitroEnum] })
    ).toBe(false)
  })

  it('no deja avanzar si el back no devolvió torneos', () => {
    expect(pasoPreferenciasCompleto({ ...base, torneosDisponibles: [] })).toBe(false)
  })
})

describe('pasoAntecedentesCompleto', () => {
  it('exige la respuesta y, si es sí, la institución', () => {
    expect(pasoAntecedentesCompleto({ tieneRelacionInstitucional: false, institucion: '' })).toBe(
      true
    )
    expect(
      pasoAntecedentesCompleto({
        tieneRelacionInstitucional: true,
        institucion: 'Club Atlético',
      })
    ).toBe(true)
    expect(pasoAntecedentesCompleto({ tieneRelacionInstitucional: null, institucion: '' })).toBe(
      false
    )
    expect(pasoAntecedentesCompleto({ tieneRelacionInstitucional: true, institucion: '  ' })).toBe(
      false
    )
  })
})
