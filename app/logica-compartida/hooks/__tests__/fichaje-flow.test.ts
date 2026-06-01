/**
 * Tests de integración del flujo básico de fichaje.
 * Prueba la navegación entre pasos y las acciones del store.
 */
jest.mock('@/lib/api/api', () => ({
  api: {
    obtenerNombreEquipo: jest.fn(),
    elDniEstaFichado: jest.fn(),
    jugadorPOST: jest.fn(),
    ficharEnOtroEquipo: jest.fn(),
  },
}))

import { useFichajeStore } from '../use-fichaje-store'
import { api } from '@/lib/api/api'
import { ObtenerNombreEquipoDTO } from '@/lib/api/clients'

const mockObtenerNombreEquipo = api.obtenerNombreEquipo as jest.MockedFunction<
  typeof api.obtenerNombreEquipo
>
const mockElDniEstaFichado = api.elDniEstaFichado as jest.MockedFunction<
  typeof api.elDniEstaFichado
>
const mockJugadorPOST = api.jugadorPOST as jest.MockedFunction<typeof api.jugadorPOST>
const mockFicharEnOtroEquipo = api.ficharEnOtroEquipo as jest.MockedFunction<
  typeof api.ficharEnOtroEquipo
>

const ESTADO_INICIAL = {
  flujo: 'intro' as const,
  paso: 1,
  codigoEquipo: '',
  esDelegado: false,
  nombre: '',
  apellido: '',
  dni: '',
  fechaNac: null,
  fotoBase64: null,
  dniFrenteBase64: null,
  dniDorsoBase64: null,
  nombreEquipo: null,
}

describe('flujo básico de fichaje', () => {
  beforeEach(() => {
    useFichajeStore.setState(ESTADO_INICIAL)
    jest.clearAllMocks()
  })

  describe('flujo nuevo jugador (público)', () => {
    it('intro → irANuevo cambia flujo y paso a 1', () => {
      useFichajeStore.getState().irANuevo()

      expect(useFichajeStore.getState().flujo).toBe('nuevo')
      expect(useFichajeStore.getState().paso).toBe(1)
    })

    it('paso 1: validar código equipo → avanza a paso 2', async () => {
      useFichajeStore.setState({ flujo: 'nuevo', paso: 1, codigoEquipo: 'ABC1234' })
      mockObtenerNombreEquipo.mockResolvedValue(
        new ObtenerNombreEquipoDTO({ hayError: false, respuesta: 'Equipo Norte' })
      )

      const result = await useFichajeStore.getState().validarCodigoEquipo()

      expect(result.ok).toBe(true)
      expect(useFichajeStore.getState().nombreEquipo).toBe('Equipo Norte')
      useFichajeStore.getState().irAlPasoSiguiente()
      expect(useFichajeStore.getState().paso).toBe(2)
    })

    it('paso 2: validar DNI nuevo → avanza a paso 3', async () => {
      useFichajeStore.setState({
        flujo: 'nuevo',
        paso: 2,
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNac: new Date(2000, 0, 1),
      })
      mockElDniEstaFichado.mockResolvedValue(false)

      const result = await useFichajeStore.getState().validarDniNuevo()

      expect(result.ok).toBe(true)
      useFichajeStore.getState().irAlPasoSiguiente()
      expect(useFichajeStore.getState().paso).toBe(3)
    })

    it('flujo completo nuevo: código → datos → enviar llega a confirmación', async () => {
      useFichajeStore.setState({ flujo: 'nuevo', paso: 1, codigoEquipo: 'ABC1234' })
      mockObtenerNombreEquipo.mockResolvedValue(
        new ObtenerNombreEquipoDTO({ hayError: false, respuesta: 'Equipo X' })
      )
      mockElDniEstaFichado.mockResolvedValue(false)
      mockJugadorPOST.mockResolvedValue({} as any)

      await useFichajeStore.getState().validarCodigoEquipo()
      useFichajeStore.getState().irAlPasoSiguiente()
      useFichajeStore.setState({
        dni: '12345678',
        nombre: 'María',
        apellido: 'González',
        fechaNac: new Date(2005, 5, 15),
        fotoBase64: 'foto',
        dniFrenteBase64: 'frente',
        dniDorsoBase64: 'dorso',
      })
      for (let i = 0; i < 3; i++) useFichajeStore.getState().irAlPasoSiguiente() // pasos 3,4,5

      const result = await useFichajeStore.getState().enviarFichajeNuevo()

      expect(result.ok).toBe(true)
      expect(mockJugadorPOST).toHaveBeenCalledTimes(1)
    })
  })

  describe('flujo ya fichado (público)', () => {
    it('intro → irAYaFichado cambia flujo y paso a 1', () => {
      useFichajeStore.getState().irAYaFichado()

      expect(useFichajeStore.getState().flujo).toBe('yaFichado')
      expect(useFichajeStore.getState().paso).toBe(1)
    })

    it('paso 1 código → paso 2 DNI → enviarFichajeYaFichado llega a confirmación', async () => {
      useFichajeStore.setState({ flujo: 'yaFichado', paso: 1, codigoEquipo: 'XYZ999' })
      mockObtenerNombreEquipo.mockResolvedValue(
        new ObtenerNombreEquipoDTO({ hayError: false, respuesta: 'Equipo Sur' })
      )
      mockElDniEstaFichado.mockResolvedValue(true)
      mockFicharEnOtroEquipo.mockResolvedValue(1)

      await useFichajeStore.getState().validarCodigoEquipo()
      useFichajeStore.getState().irAlPasoSiguiente()
      useFichajeStore.setState({ dni: '87654321' })

      const result = await useFichajeStore.getState().enviarFichajeYaFichado()

      expect(result.ok).toBe(true)
      expect(mockFicharEnOtroEquipo).toHaveBeenCalledWith(
        expect.objectContaining({ dni: '87654321', codigoAlfanumerico: 'XYZ999' })
      )
    })
  })

  describe('resetear y reiniciarParaOtroJugador', () => {
    it('resetear vuelve al estado inicial', () => {
      useFichajeStore.setState({
        flujo: 'nuevo',
        paso: 3,
        codigoEquipo: 'ABC',
        nombre: 'Juan',
        apellido: 'Pérez',
      })

      useFichajeStore.getState().resetear()

      expect(useFichajeStore.getState().flujo).toBe('intro')
      expect(useFichajeStore.getState().paso).toBe(1)
      expect(useFichajeStore.getState().codigoEquipo).toBe('')
      expect(useFichajeStore.getState().nombre).toBe('')
    })

    it('reiniciarParaOtroJugador vuelve a intro y limpia datos del jugador', () => {
      useFichajeStore.setState({
        flujo: 'nuevo',
        paso: 5,
        codigoEquipo: 'ABC1234',
        nombreEquipo: 'Equipo X',
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        fechaNac: new Date(2000, 0, 1),
      })

      useFichajeStore.getState().reiniciarParaOtroJugador()

      expect(useFichajeStore.getState().flujo).toBe('intro')
      expect(useFichajeStore.getState().paso).toBe(1)
      expect(useFichajeStore.getState().nombre).toBe('')
      expect(useFichajeStore.getState().apellido).toBe('')
      expect(useFichajeStore.getState().dni).toBe('')
      expect(useFichajeStore.getState().fechaNac).toBeNull()
    })
  })

  describe('navegación entre pasos', () => {
    it('irAlPasoAnterior retrocede correctamente', () => {
      useFichajeStore.setState({ flujo: 'nuevo', paso: 3 })

      useFichajeStore.getState().irAlPasoAnterior()

      expect(useFichajeStore.getState().paso).toBe(2)
    })

    it('irAlPasoInicial pone paso en 1', () => {
      useFichajeStore.setState({ flujo: 'nuevo', paso: 4 })

      useFichajeStore.getState().irAlPasoInicial()

      expect(useFichajeStore.getState().paso).toBe(1)
    })

    it('calcularTotalPasos: nuevo público tiene 5 pasos, yaFichado público tiene 3', () => {
      useFichajeStore.setState({ flujo: 'nuevo', esDelegado: false })
      expect(useFichajeStore.getState().calcularTotalPasos()).toBe(5)

      useFichajeStore.setState({ flujo: 'yaFichado', esDelegado: false })
      expect(useFichajeStore.getState().calcularTotalPasos()).toBe(3)
    })

    it('calcularTotalPasos: delegado nuevo tiene 4 pasos, yaFichado tiene 2', () => {
      useFichajeStore.setState({ flujo: 'nuevo', esDelegado: true })
      expect(useFichajeStore.getState().calcularTotalPasos()).toBe(4)

      useFichajeStore.setState({ flujo: 'yaFichado', esDelegado: true })
      expect(useFichajeStore.getState().calcularTotalPasos()).toBe(2)
    })
  })
})
