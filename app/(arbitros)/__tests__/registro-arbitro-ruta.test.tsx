import React from 'react'
import { BackHandler } from 'react-native'
import { render, screen, fireEvent } from '@testing-library/react-native'
import RegistroArbitroScreen from '@/arbitros/registro-arbitro'
import {
  TOTAL_PASOS,
  useRegistroArbitroStore,
} from '@/logica-compartida/hooks/use-registro-arbitro-store'
import { useRouter } from 'expo-router'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

jest.mock('@/logica-compartida/hooks/use-registro-arbitro-store')
jest.mock('expo-router')
jest.mock('@/arbitros/_logica/use-torneos-para-arbitros', () => ({
  useTorneosParaArbitros: () => ({
    torneos: [],
    cargando: false,
    huboError: false,
    reintentar: jest.fn(),
  }),
}))
jest.mock('@/fichaje-jugador/_components/modal-fecha-nacimiento', () => {
  const { View } = require('react-native')
  return function MockModalFechaNacimiento() {
    return <View testID="modal-fecha-nacimiento-mock" />
  }
})

const mockResetear = jest.fn()
const mockRouterReplace = jest.fn()
const mockIrAlPasoAnterior = jest.fn()

function mockStore(paso: number) {
  return {
    paso,
    resetear: mockResetear,
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
    setDni: jest.fn(),
    setApellido: jest.fn(),
    setNombre: jest.fn(),
    setTelefonoCelular: jest.fn(),
    setDireccion: jest.fn(),
    setLocalidad: jest.fn(),
    setFechaNacimiento: jest.fn(),
    setTipoMovilidad: jest.fn(),
    alternarTorneo: jest.fn(),
    alternarFranja: jest.fn(),
    setTieneRelacionInstitucional: jest.fn(),
    setInstitucion: jest.fn(),
    irAlPasoSiguiente: jest.fn(),
    irAlPasoAnterior: mockIrAlPasoAnterior,
    enviarRegistro: jest.fn(),
  }
}

describe('RegistroArbitroScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace })
  })

  it.each([
    [1, 'Datos personales'],
    [2, 'Ubicación y movilidad'],
    [3, 'Preferencias deportivas'],
    [4, 'Antecedentes institucionales'],
  ])('en el paso %s muestra %s', (paso, titulo) => {
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(paso))
    render(<RegistroArbitroScreen />)
    expect(screen.getByText(titulo)).toBeTruthy()
  })

  it('en el último paso muestra el registro enviado y vuelve al inicio', () => {
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(TOTAL_PASOS + 1))
    render(<RegistroArbitroScreen />)

    expect(mockResetear).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('pantalla-completado-arbitro')).toBeTruthy()
    expect(screen.getByText('¡Registro enviado!')).toBeTruthy()

    fireEvent.press(screen.getByTestId('boton-volver-inicio-arbitro'))
    expect(mockRouterReplace).toHaveBeenCalledWith(RUTAS.HOME)
  })

  it('al montarse de nuevo tras un pop deja el formulario en blanco', () => {
    const { useRegistroArbitroStore: storeReal } = jest.requireActual(
      '@/logica-compartida/hooks/use-registro-arbitro-store'
    )
    ;(useRegistroArbitroStore as unknown as jest.Mock).mockImplementation(storeReal)
    storeReal.setState({ paso: 3, nombre: 'Ana', dni: '30111222' })
    const { unmount } = render(<RegistroArbitroScreen />)

    expect(storeReal.getState()).toMatchObject({ paso: 1, nombre: '', dni: '' })
    storeReal.setState({ paso: 3, nombre: 'Ana', dni: '30111222' })
    unmount()

    expect(storeReal.getState().nombre).toBe('Ana')
    render(<RegistroArbitroScreen />)
    expect(storeReal.getState()).toMatchObject({ paso: 1, nombre: '', dni: '' })
  })

  describe('botón atrás de Android', () => {
    type ManejadorAtras = () => boolean | null | undefined
    let manejadores: ManejadorAtras[]

    beforeEach(() => {
      manejadores = []
      jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_evento, manejador) => {
        manejadores.push(manejador)
        return {
          remove: () => {
            manejadores = manejadores.filter((m) => m !== manejador)
          },
        }
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    function apretarAtras() {
      expect(manejadores).toHaveLength(1)
      return manejadores[0]()
    }

    it.each([2, 3, 4])('en el paso %s vuelve al paso anterior', (paso) => {
      ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(paso))
      render(<RegistroArbitroScreen />)

      expect(apretarAtras()).toBe(true)
      expect(mockIrAlPasoAnterior).toHaveBeenCalledTimes(1)
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it.each([
      ['el paso 1', 1],
      ['la pantalla final', TOTAL_PASOS + 1],
    ])('en %s va al Home en vez de cerrar la app', (_nombre, paso) => {
      ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(paso))
      render(<RegistroArbitroScreen />)

      expect(apretarAtras()).toBe(true)
      expect(mockRouterReplace).toHaveBeenCalledWith(RUTAS.HOME)
      expect(mockIrAlPasoAnterior).not.toHaveBeenCalled()
    })

    it('sin pantalla anterior en el stack (arranque en frío por el link) vuelve al Home', () => {
      ;(useRouter as jest.Mock).mockReturnValue({
        replace: mockRouterReplace,
        canGoBack: () => false,
      })
      ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(1))
      render(<RegistroArbitroScreen />)

      expect(apretarAtras()).toBe(true)
      expect(mockRouterReplace).toHaveBeenCalledWith(RUTAS.HOME)
    })

    it('al desmontarse deja de escuchar el botón atrás', () => {
      ;(useRegistroArbitroStore as unknown as jest.Mock).mockReturnValue(mockStore(2))
      const { unmount } = render(<RegistroArbitroScreen />)
      unmount()
      expect(manejadores).toHaveLength(0)
    })
  })
})
