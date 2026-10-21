import React from 'react'
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
jest.mock('@/fichaje-jugador/_components/modal-fecha-nacimiento', () => {
  const { View } = require('react-native')
  return function MockModalFechaNacimiento() {
    return <View testID="modal-fecha-nacimiento-mock" />
  }
})

const mockResetear = jest.fn()
const mockRouterReplace = jest.fn()

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
    torneosInteres: [],
    disponibilidadHoraria: [],
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
    irAlPasoAnterior: jest.fn(),
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

    expect(screen.getByTestId('pantalla-completado-arbitro')).toBeTruthy()
    expect(screen.getByText('¡Registro enviado!')).toBeTruthy()

    fireEvent.press(screen.getByTestId('boton-volver-inicio-arbitro'))
    expect(mockResetear).toHaveBeenCalledTimes(1)
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
})
