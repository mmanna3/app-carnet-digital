jest.mock('@/app/api/api', () => ({
  api: {
    obtenerNombreEquipo: jest.fn(),
    elDniEstaFichado: jest.fn(),
    jugadorPOST: jest.fn(),
    ficharEnOtroEquipo: jest.fn(),
  },
}))

import { useFichajeStore } from '../use-fichaje-store'
import { api } from '@/app/api/api'
import { ObtenerNombreEquipoDTO } from '@/app/api/clients'

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
  nombre: '',
  apellido: '',
  dni: '',
  fechaNac: null,
  fotoUri: null,
  dniFrenteUri: null,
  dniDorsoUri: null,
  fotoBase64: null,
  dniFrenteBase64: null,
  dniDorsoBase64: null,
  nombreEquipo: null,
}

describe('useFichajeStore', () => {
  beforeEach(() => {
    useFichajeStore.setState(ESTADO_INICIAL)
    jest.clearAllMocks()
  })

  // ─── validarCodigoEquipo ───────────────────────────────────────────────────

  describe('validarCodigoEquipo', () => {
    it('código válido: guarda nombreEquipo y retorna ok=true', async () => {
      useFichajeStore.setState({ codigoEquipo: 'ABC1234' })
      mockObtenerNombreEquipo.mockResolvedValue(
        new ObtenerNombreEquipoDTO({
          hayError: false,
          respuesta: 'Equipo X',
          mensajeError: undefined,
        })
      )

      const result = await useFichajeStore.getState().validarCodigoEquipo()

      expect(result.ok).toBe(true)
      expect(useFichajeStore.getState().nombreEquipo).toBe('Equipo X')
    })

    it('código inválido (hayError=true): retorna ok=false con mensajeError', async () => {
      useFichajeStore.setState({ codigoEquipo: 'XXX0001' })
      mockObtenerNombreEquipo.mockResolvedValue(
        new ObtenerNombreEquipoDTO({
          hayError: true,
          respuesta: undefined,
          mensajeError: 'Código incorrecto',
        })
      )

      const result = await useFichajeStore.getState().validarCodigoEquipo()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Código incorrecto')
      expect(useFichajeStore.getState().nombreEquipo).toBeNull()
    })

    it('error de red: retorna ok=false con mensaje de conexión', async () => {
      useFichajeStore.setState({ codigoEquipo: 'ABC1234' })
      mockObtenerNombreEquipo.mockRejectedValue(new Error('Network Error'))

      const result = await useFichajeStore.getState().validarCodigoEquipo()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
    })
  })

  // ─── validarDniNuevo ──────────────────────────────────────────────────────

  describe('validarDniNuevo', () => {
    it('DNI no fichado: retorna ok=true', async () => {
      useFichajeStore.setState({ dni: '12345678' })
      mockElDniEstaFichado.mockResolvedValue(false)

      const result = await useFichajeStore.getState().validarDniNuevo()

      expect(result.ok).toBe(true)
    })

    it('DNI ya fichado: retorna ok=false con mensaje de error', async () => {
      useFichajeStore.setState({ dni: '12345678' })
      mockElDniEstaFichado.mockResolvedValue(true)

      const result = await useFichajeStore.getState().validarDniNuevo()

      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/fichado/i)
    })

    it('error de red: retorna ok=false con mensaje de conexión', async () => {
      useFichajeStore.setState({ dni: '12345678' })
      mockElDniEstaFichado.mockRejectedValue(new Error('Network Error'))

      const result = await useFichajeStore.getState().validarDniNuevo()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
    })
  })

  // ─── enviarFichajeNuevo ───────────────────────────────────────────────────

  describe('enviarFichajeNuevo', () => {
    beforeEach(() => {
      useFichajeStore.setState({
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNac: new Date(2000, 0, 1),
        codigoEquipo: 'ABC1234',
        fotoBase64: 'fotodata',
        dniFrenteBase64: 'frentedata',
        dniDorsoBase64: 'dorsodata',
      })
    })

    it('backend responde ok: retorna ok=true', async () => {
      mockJugadorPOST.mockResolvedValue({} as any)

      const result = await useFichajeStore.getState().enviarFichajeNuevo()

      expect(result.ok).toBe(true)
      expect(mockJugadorPOST).toHaveBeenCalledTimes(1)
    })

    it('backend responde con error controlado: retorna ok=false con error', async () => {
      mockJugadorPOST.mockRejectedValue({
        response: JSON.stringify({ title: 'El equipo no existe' }),
      })

      const result = await useFichajeStore.getState().enviarFichajeNuevo()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El equipo no existe')
    })

    it('error de red: retorna ok=false con mensaje de conexión', async () => {
      mockJugadorPOST.mockRejectedValue(new Error('Network Error'))

      const result = await useFichajeStore.getState().enviarFichajeNuevo()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
    })
  })

  // ─── enviarFichajeYaFichado ───────────────────────────────────────────────

  describe('enviarFichajeYaFichado', () => {
    beforeEach(() => {
      useFichajeStore.setState({ dni: '12345678', codigoEquipo: 'ABC1234' })
    })

    it('DNI no fichado: retorna ok=false sin llamar ficharEnOtroEquipo', async () => {
      mockElDniEstaFichado.mockResolvedValue(false)

      const result = await useFichajeStore.getState().enviarFichajeYaFichado()

      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/no estás fichado/i)
      expect(mockFicharEnOtroEquipo).not.toHaveBeenCalled()
    })

    it('DNI fichado y código válido: retorna ok=true', async () => {
      mockElDniEstaFichado.mockResolvedValue(true)
      mockFicharEnOtroEquipo.mockResolvedValue(42)

      const result = await useFichajeStore.getState().enviarFichajeYaFichado()

      expect(result.ok).toBe(true)
      expect(mockFicharEnOtroEquipo).toHaveBeenCalledTimes(1)
    })

    it('DNI fichado pero backend falla: retorna ok=false con error', async () => {
      mockElDniEstaFichado.mockResolvedValue(true)
      mockFicharEnOtroEquipo.mockRejectedValue({
        response: JSON.stringify({ title: 'El jugador ya está fichado en el equipo' }),
      })

      const result = await useFichajeStore.getState().enviarFichajeYaFichado()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El jugador ya está fichado en el equipo')
    })

    it('error de red en elDniEstaFichado: retorna ok=false con mensaje de conexión', async () => {
      mockElDniEstaFichado.mockRejectedValue(new Error('Network Error'))

      const result = await useFichajeStore.getState().enviarFichajeYaFichado()

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Hubo un error conectándose al servidor')
    })
  })
})
