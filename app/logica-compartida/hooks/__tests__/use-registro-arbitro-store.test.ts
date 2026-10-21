import {
  armarPayloadRegistroArbitro,
  envioRegistroArbitro,
  useRegistroArbitroStore,
} from '@/logica-compartida/hooks/use-registro-arbitro-store'

const DATOS_COMPLETOS = {
  dni: '30111222',
  apellido: 'Gomez',
  nombre: 'Ana',
  telefonoCelular: '1199887766',
  direccion: 'Mitre 10',
  localidad: 'Bernal',
  fechaNacimiento: new Date(1990, 4, 2),
  tipoMovilidad: 'AUTO' as const,
  torneosInteres: ['FUTBOL 11'],
  disponibilidadHoraria: ['SABADOS 8 A 14'],
  tieneRelacionInstitucional: false,
  institucion: '',
}

const INICIAL = {
  paso: 1,
  dni: '',
  apellido: '',
  nombre: '',
  telefonoCelular: '',
  direccion: '',
  localidad: '',
  fechaNacimiento: null,
  tipoMovilidad: null,
  torneosInteres: [],
  disponibilidadHoraria: [],
  tieneRelacionInstitucional: null,
  institucion: '',
}

describe('useRegistroArbitroStore', () => {
  beforeEach(() => {
    useRegistroArbitroStore.getState().resetear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('empieza en el paso 1 con los campos vacíos', () => {
    expect(useRegistroArbitroStore.getState()).toMatchObject(INICIAL)
  })

  it('guarda cada campo del formulario', () => {
    const fecha = new Date(1990, 4, 2)
    const store = useRegistroArbitroStore.getState()

    store.setDni('30111222')
    store.setApellido('Gomez')
    store.setNombre('Ana')
    store.setTelefonoCelular('1199887766')
    store.setDireccion('Mitre 10')
    store.setLocalidad('Bernal')
    store.setFechaNacimiento(fecha)
    store.setTipoMovilidad('AUTO')
    store.setTieneRelacionInstitucional(true)
    store.setInstitucion('Club Sur')

    expect(useRegistroArbitroStore.getState()).toMatchObject({
      dni: '30111222',
      apellido: 'Gomez',
      nombre: 'Ana',
      telefonoCelular: '1199887766',
      direccion: 'Mitre 10',
      localidad: 'Bernal',
      fechaNacimiento: fecha,
      tipoMovilidad: 'AUTO',
      tieneRelacionInstitucional: true,
      institucion: 'Club Sur',
    })
  })

  it('avanza hasta la pantalla de completado y no pasa de ahí', () => {
    const { irAlPasoSiguiente, irAlPasoAnterior } = useRegistroArbitroStore.getState()
    irAlPasoAnterior()
    expect(useRegistroArbitroStore.getState().paso).toBe(1)

    irAlPasoSiguiente()
    irAlPasoSiguiente()
    irAlPasoSiguiente()
    irAlPasoSiguiente()
    expect(useRegistroArbitroStore.getState().paso).toBe(5)

    useRegistroArbitroStore.getState().irAlPasoSiguiente()
    expect(useRegistroArbitroStore.getState().paso).toBe(5)

    useRegistroArbitroStore.getState().irAlPasoAnterior()
    expect(useRegistroArbitroStore.getState().paso).toBe(4)
  })

  it('alterna torneos y franjas sin duplicar', () => {
    const { alternarTorneo, alternarFranja } = useRegistroArbitroStore.getState()
    alternarTorneo('FUTBOL 11')
    alternarTorneo('FUTSAL FEMENINO')
    alternarTorneo('FUTBOL 11')
    alternarFranja('DOMINGOS 9 A 15')
    alternarFranja('DOMINGOS 9 A 15')

    const { torneosInteres, disponibilidadHoraria } = useRegistroArbitroStore.getState()
    expect(torneosInteres).toEqual(['FUTSAL FEMENINO'])
    expect(disponibilidadHoraria).toEqual([])
  })

  it('arma el payload y omite la institución si no hay relación', () => {
    const estado = { ...DATOS_COMPLETOS, institucion: 'No debería salir' }

    expect(armarPayloadRegistroArbitro(estado)).toEqual({
      ...DATOS_COMPLETOS,
      institucion: undefined,
    })
    expect(armarPayloadRegistroArbitro(estado)?.torneosInteres).not.toBe(estado.torneosInteres)
  })

  it('recorta espacios de apellido, nombre, dirección, localidad e institución', () => {
    expect(
      armarPayloadRegistroArbitro({
        ...DATOS_COMPLETOS,
        apellido: '  Gomez  ',
        nombre: ' Ana ',
        direccion: '  Calle 12 ',
        localidad: ' La Plata ',
        tieneRelacionInstitucional: true,
        institucion: '  Club Sur  ',
      })
    ).toMatchObject({
      apellido: 'Gomez',
      nombre: 'Ana',
      direccion: 'Calle 12',
      localidad: 'La Plata',
      institucion: 'Club Sur',
    })
  })

  it('incluye la institución cuando la respuesta es sí', () => {
    expect(
      armarPayloadRegistroArbitro({
        ...DATOS_COMPLETOS,
        tieneRelacionInstitucional: true,
        institucion: 'Club Sur',
      })?.institucion
    ).toBe('Club Sur')
  })

  it.each([
    ['fecha de nacimiento', { fechaNacimiento: null }],
    ['tipo de movilidad', { tipoMovilidad: null }],
    ['respuesta institucional', { tieneRelacionInstitucional: null }],
  ])('devuelve null si falta %s', (_, faltante) => {
    expect(armarPayloadRegistroArbitro({ ...DATOS_COMPLETOS, ...faltante })).toBeNull()
  })

  it('envía el payload y resuelve ok', async () => {
    const enviar = jest.spyOn(envioRegistroArbitro, 'enviar')
    useRegistroArbitroStore.setState(DATOS_COMPLETOS)

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({ ok: true })
    expect(enviar).toHaveBeenCalledWith({ ...DATOS_COMPLETOS, institucion: undefined })
  })

  it('no envía si faltan datos obligatorios', async () => {
    const enviar = jest.spyOn(envioRegistroArbitro, 'enviar')

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({
      ok: false,
      error: 'Faltan datos del formulario. Revisá los pasos anteriores.',
    })
    expect(enviar).not.toHaveBeenCalled()
  })

  it('devuelve el error cuando el envío falla', async () => {
    jest.spyOn(envioRegistroArbitro, 'enviar').mockRejectedValue(new Error('No se pudo conectar'))
    useRegistroArbitroStore.setState(DATOS_COMPLETOS)

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({
      ok: false,
      error: 'No se pudo conectar',
    })
  })
})
