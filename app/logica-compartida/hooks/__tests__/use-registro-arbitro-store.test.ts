import { ApiException } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import {
  armarPayloadRegistroArbitro,
  envioRegistroArbitro,
  useRegistroArbitroStore,
} from '@/logica-compartida/hooks/use-registro-arbitro-store'

jest.mock('@/lib/api/api', () => ({ api: { registroArbitro: jest.fn() } }))

const DATOS_COMPLETOS = {
  dni: '30111222',
  apellido: 'Gomez',
  nombre: 'Ana',
  telefonoCelular: '99887766',
  direccion: 'Mitre 10',
  localidad: 'Bernal',
  fechaNacimiento: new Date(1990, 4, 2),
  tipoMovilidad: 2 as const,
  torneoAgrupadorIds: [11, 12],
  franjasHorarias: [1, 5] as number[],
  tieneRelacionInstitucional: false,
  institucion: '',
}

const PAYLOAD_ESPERADO = {
  ...DATOS_COMPLETOS,
  telefonoCelular: '+5491199887766',
  institucion: undefined,
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
  torneoAgrupadorIds: [],
  franjasHorarias: [],
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
    store.setTelefonoCelular('99887766')
    store.setDireccion('Mitre 10')
    store.setLocalidad('Bernal')
    store.setFechaNacimiento(fecha)
    store.setTipoMovilidad(2)
    store.setTieneRelacionInstitucional(true)
    store.setInstitucion('Club Sur')

    expect(useRegistroArbitroStore.getState()).toMatchObject({
      dni: '30111222',
      apellido: 'Gomez',
      nombre: 'Ana',
      telefonoCelular: '99887766',
      direccion: 'Mitre 10',
      localidad: 'Bernal',
      fechaNacimiento: fecha,
      tipoMovilidad: 2,
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
    alternarTorneo(11)
    alternarTorneo(12)
    alternarTorneo(11)
    alternarFranja(3)
    alternarFranja(3)

    const { torneoAgrupadorIds, franjasHorarias } = useRegistroArbitroStore.getState()
    expect(torneoAgrupadorIds).toEqual([12])
    expect(franjasHorarias).toEqual([])
  })

  it('arma el payload con el prefijo del celular y omite la institución si no hay relación', () => {
    const estado = { ...DATOS_COMPLETOS, institucion: 'No debería salir' }

    expect(armarPayloadRegistroArbitro(estado)).toEqual(PAYLOAD_ESPERADO)
    expect(armarPayloadRegistroArbitro(estado)?.torneoAgrupadorIds).not.toBe(
      estado.torneoAgrupadorIds
    )
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
    ;(api.registroArbitro as jest.Mock).mockResolvedValue(5)
    useRegistroArbitroStore.setState(DATOS_COMPLETOS)

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({ ok: true })
    expect(enviar).toHaveBeenCalledWith(PAYLOAD_ESPERADO)
    expect(api.registroArbitro).toHaveBeenCalledWith(PAYLOAD_ESPERADO)
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

  it('muestra el mensaje del back cuando responde 400', async () => {
    ;(api.registroArbitro as jest.Mock).mockRejectedValue(
      new ApiException(
        'An unexpected server error occurred.',
        400,
        JSON.stringify({ status: 400, title: 'Ya hay un árbitro registrado con ese DNI' }),
        {},
        null
      )
    )
    useRegistroArbitroStore.setState(DATOS_COMPLETOS)

    await expect(useRegistroArbitroStore.getState().enviarRegistro()).resolves.toEqual({
      ok: false,
      error: 'Ya hay un árbitro registrado con ese DNI',
    })
  })
})
