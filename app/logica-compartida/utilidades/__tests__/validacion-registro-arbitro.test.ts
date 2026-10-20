import {
  FRANJAS_HORARIAS,
  TIPOS_MOVILIDAD,
  TORNEOS_INTERES,
} from '@/logica-compartida/constantes/registro-arbitro'
import {
  pasoAntecedentesCompleto,
  pasoDatosPersonalesCompleto,
  pasoPreferenciasCompleto,
  pasoUbicacionCompleto,
} from '@/logica-compartida/utilidades/validacion-registro-arbitro'

const DATOS_PERSONALES = {
  dni: '12345678',
  apellido: 'Perez',
  nombre: 'Juan',
  telefonoCelular: '1122334455',
}

describe('catálogos de registro de árbitro', () => {
  it('incluye los tipos de movilidad', () => {
    expect(TIPOS_MOVILIDAD).toEqual(['MOTO', 'AUTO', 'BICICLETA', 'TRANSPORTE PUBLICO'])
  })

  it('incluye los torneos de interés', () => {
    expect(TORNEOS_INTERES).toEqual([
      'BABY FUTBOL',
      'FUTSAL MASCULINO / MAYORES',
      'FUTSAL FEMENINO',
      'FUTBOL 11',
    ])
  })

  it('incluye las franjas horarias', () => {
    expect(FRANJAS_HORARIAS).toEqual([
      'SABADOS 8 A 14',
      'SABADOS 13 A 20',
      'DOMINGOS 9 A 15',
      'DOMINGOS 15 A 22',
      'MARTES A VIERNES DE 20 A 23:30',
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
  })
})

const FECHA_NACIMIENTO = new Date(1990, 0, 1)

describe('pasoUbicacionCompleto', () => {
  it('exige dirección, localidad, fecha de nacimiento y un tipo de movilidad del catálogo', () => {
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        fechaNacimiento: FECHA_NACIMIENTO,
        tipoMovilidad: 'MOTO',
      })
    ).toBe(true)
    expect(
      pasoUbicacionCompleto({
        direccion: '  ',
        localidad: 'Quilmes',
        fechaNacimiento: FECHA_NACIMIENTO,
        tipoMovilidad: 'MOTO',
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: '',
        fechaNacimiento: FECHA_NACIMIENTO,
        tipoMovilidad: 'AUTO',
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        fechaNacimiento: null,
        tipoMovilidad: 'MOTO',
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        fechaNacimiento: FECHA_NACIMIENTO,
        tipoMovilidad: null,
      })
    ).toBe(false)
    expect(
      pasoUbicacionCompleto({
        direccion: 'Calle 123',
        localidad: 'Quilmes',
        fechaNacimiento: FECHA_NACIMIENTO,
        tipoMovilidad: 'CAMINANDO',
      })
    ).toBe(false)
  })
})

describe('pasoPreferenciasCompleto', () => {
  it('exige al menos un torneo y una franja del catálogo', () => {
    expect(
      pasoPreferenciasCompleto({
        torneosInteres: ['FUTBOL 11'],
        disponibilidadHoraria: ['DOMINGOS 9 A 15'],
      })
    ).toBe(true)
    expect(
      pasoPreferenciasCompleto({
        torneosInteres: [],
        disponibilidadHoraria: ['DOMINGOS 9 A 15'],
      })
    ).toBe(false)
    expect(
      pasoPreferenciasCompleto({
        torneosInteres: ['FUTBOL 11'],
        disponibilidadHoraria: [],
      })
    ).toBe(false)
    expect(
      pasoPreferenciasCompleto({
        torneosInteres: ['OTRO'],
        disponibilidadHoraria: ['DOMINGOS 9 A 15'],
      })
    ).toBe(false)
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
