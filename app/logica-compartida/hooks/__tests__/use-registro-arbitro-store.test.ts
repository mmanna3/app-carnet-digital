import {
  armarPayloadRegistroArbitro,
  envioRegistroArbitro,
  useRegistroArbitroStore,
} from '@/logica-compartida/hooks/use-registro-arbitro-store'

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
    const fecha = new Date(1990, 4, 2)
    const estado = {
      dni: '30111222',
      apellido: 'Gomez',
      nombre: 'Ana',
      telefonoCelular: '1199887766',
      direccion: 'Mitre 10',
      localidad: 'Bernal',
      fechaNacimiento: fecha,
      tipoMovilidad: 'AUTO' as const,
      torneosInteres: ['FUTBOL 11'],
      disponibilidadHoraria: ['SABADOS 8 A 14'],
      tieneRelacionInstitucional: false,
      institucion: 'No debería salir',
    }

    expect(armarPayloadRegistroArbitro(estado)).toEqual({
      ...estado,
      institucion: '',
    })
    expect(armarPayloadRegistroArbitro(estado).torneosInteres).not.toBe(estado.torneosInteres)
  })

  it('incluye la institución cuando la respuesta es sí', () => {
    expect(
      armarPayloadRegistroArbitro({
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
        tieneRelacionInstitucional: true,
        institucion: 'Club Sur',
      }).institucion
    ).toBe('Club Sur')
  })

  it('resuelve ok mientras el endpoint de alta no existe', async () => {
    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({ ok: true })
  })

  it('devuelve el error cuando el envío falla', async () => {
    jest.spyOn(envioRegistroArbitro, 'enviar').mockRejectedValue(new Error('No se pudo conectar'))

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({
      ok: false,
      error: 'No se pudo conectar',
    })
  })
})
