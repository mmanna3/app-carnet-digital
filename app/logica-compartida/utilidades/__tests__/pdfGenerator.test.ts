jest.mock('../../config/liga', () => ({
  getColorLiga600: () => '#16a34a',
  getColorLiga700: () => '#15803d',
}))

jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn().mockResolvedValue({ uri: 'file://carnets-generados.pdf' }),
}))

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}))

import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { generatePDF } from '../generador-pdf'
import { EstadoJugador } from '../../tipos/estado-jugador'

const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())

const mockPrint = Print as jest.Mocked<typeof Print>
const mockSharing = Sharing as jest.Mocked<typeof Sharing>

// Helper: crea un jugador como plain object (no depende del constructor NSwag)
const crearJugador = (overrides: Record<string, any> = {}) => ({
  id: 1,
  nombre: 'Juan',
  apellido: 'Pérez',
  dni: '12345678',
  fechaNacimiento: new Date('2010-06-15'),
  fotoCarnet: 'https://example.com/foto.jpg',
  equipo: 'Deportivo Test',
  torneo: 'Torneo Local',
  estado: EstadoJugador.Activo,
  ...overrides,
})

const htmlGenerado = () => mockPrint.printToFileAsync.mock.calls[0]![0]!.html as string

/** Solo el contenedor de hoja (`page-content` no debe coincidir). */
const contarHojasPdf = (html: string) => (html.match(/<div class="page">/g) || []).length

describe('generatePDF', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Restaurar el default luego de cada test que lo sobreescriba
    mockSharing.isAvailableAsync.mockResolvedValue(true)
    mockPrint.printToFileAsync.mockResolvedValue({
      uri: 'file://carnets-generados.pdf',
      numberOfPages: 1,
    })
  })

  describe('lista vacía', () => {
    it('no llama a Print si la lista de jugadores está vacía', async () => {
      await generatePDF([], 'EQUIPO-01')

      expect(mockPrint.printToFileAsync).not.toHaveBeenCalled()
    })

    it('retorna undefined si la lista está vacía', async () => {
      const result = await generatePDF([], 'EQUIPO-01')

      expect(result).toBeUndefined()
    })
  })

  describe('ordenamiento por categoría (año de nacimiento)', () => {
    it('los jugadores aparecen por categoría ascendente (año), como en la app', async () => {
      const jugadores = [
        crearJugador({ id: 1, fechaNacimiento: new Date('2012-01-01'), nombre: 'Nuevo' }),
        crearJugador({ id: 2, fechaNacimiento: new Date('2008-01-01'), nombre: 'Viejo' }),
        crearJugador({ id: 3, fechaNacimiento: new Date('2010-01-01'), nombre: 'Medio' }),
      ]

      await generatePDF(jugadores as any, 'EQUIPO-01')

      const html = htmlGenerado()
      const posViejo = html.indexOf('Viejo')
      const posMedio = html.indexOf('Medio')
      const posNuevo = html.indexOf('Nuevo')
      expect(posViejo).toBeLessThan(posMedio)
      expect(posMedio).toBeLessThan(posNuevo)
    })
  })

  describe('paginación (capacidad por hoja, misma categoría)', () => {
    /** Misma categoría (mismo año) para no inflar filas con carteles entre carnets. */
    const mismaCategoria = (i: number) =>
      crearJugador({
        id: i + 1,
        nombre: `Jugador${i + 1}`,
        fechaNacimiento: new Date(2010, 0, 1 + (i % 28)),
      })

    it('genera 1 página para 9 jugadores', async () => {
      const jugadores = Array.from({ length: 9 }, (_, i) => mismaCategoria(i))

      await generatePDF(jugadores as any, 'EQUIPO-01')

      expect(contarHojasPdf(htmlGenerado())).toBe(1)
    })

    it('genera 2 páginas para 10 jugadores', async () => {
      const jugadores = Array.from({ length: 10 }, (_, i) => mismaCategoria(i))

      await generatePDF(jugadores as any, 'EQUIPO-01')

      expect(contarHojasPdf(htmlGenerado())).toBe(2)
    })

    it('genera 3 páginas para 27 jugadores', async () => {
      const jugadores = Array.from({ length: 27 }, (_, i) => mismaCategoria(i))

      await generatePDF(jugadores as any, 'EQUIPO-01')

      expect(contarHojasPdf(htmlGenerado())).toBe(3)
    })
  })

  describe('contenido del HTML', () => {
    it('muestra "CARNET SUSPENDIDO" para jugadores Suspendidos', async () => {
      await generatePDF([crearJugador({ estado: EstadoJugador.Suspendido })] as any, 'EQUIPO-01')

      expect(htmlGenerado()).toContain('CARNET SUSPENDIDO')
    })

    it('muestra "INHABILITADO" para jugadores Inhabilitados', async () => {
      await generatePDF([crearJugador({ estado: EstadoJugador.Inhabilitado })] as any, 'EQUIPO-01')

      expect(htmlGenerado()).toContain('INHABILITADO')
    })

    it('muestra nombre y apellido para jugadores Activos', async () => {
      await generatePDF(
        [
          crearJugador({ estado: EstadoJugador.Activo, nombre: 'Carlos', apellido: 'García' }),
        ] as any,
        'EQUIPO-01'
      )

      expect(htmlGenerado()).toContain('Carlos García')
    })

    it('usa imagen placeholder cuando no hay foto', async () => {
      await generatePDF([crearJugador({ fotoCarnet: undefined })] as any, 'EQUIPO-01')

      expect(htmlGenerado()).toContain('placeholder')
    })

    it('incluye el nombre del equipo en el encabezado de página', async () => {
      await generatePDF([crearJugador({ equipo: 'Club Estrella' })] as any, 'EQUIPO-01')

      expect(htmlGenerado()).toContain('Club Estrella')
    })

    it('incluye el DNI del jugador', async () => {
      await generatePDF([crearJugador({ dni: '99887766' })] as any, 'EQUIPO-01')

      expect(htmlGenerado()).toContain('99887766')
    })

    it('calcula la categoría a partir del año de nacimiento', async () => {
      await generatePDF(
        [crearJugador({ fechaNacimiento: new Date('2011-05-20') })] as any,
        'EQUIPO-01'
      )

      expect(htmlGenerado()).toContain('2011')
    })

    it('incluye numeración de página en el pie', async () => {
      await generatePDF(
        [crearJugador(), crearJugador({ id: 2, dni: '87654321' })] as any,
        'EQUIPO-01'
      )

      expect(htmlGenerado()).toMatch(/Página 1\/1/)
    })
  })

  describe('sharing', () => {
    it('llama a shareAsync cuando el sharing está disponible', async () => {
      mockSharing.isAvailableAsync.mockResolvedValue(true)

      await generatePDF([crearJugador()] as any, 'EQUIPO-01')

      expect(mockSharing.shareAsync).toHaveBeenCalledWith(
        'file://carnets-generados.pdf',
        expect.objectContaining({ mimeType: 'application/pdf' })
      )
    })

    it('muestra un Alert cuando el sharing no está disponible', async () => {
      mockSharing.isAvailableAsync.mockResolvedValue(false)

      await generatePDF([crearJugador()] as any, 'EQUIPO-01')

      expect(mockSharing.shareAsync).not.toHaveBeenCalled()
      expect(mockAlert).toHaveBeenCalled()
    })

    it('retorna la URI del PDF generado', async () => {
      const uri = await generatePDF([crearJugador()] as any, 'EQUIPO-01')

      expect(uri).toBe('file://carnets-generados.pdf')
    })

    it('el dialogTitle incluye el código de equipo', async () => {
      await generatePDF([crearJugador()] as any, 'CLUB-77')

      expect(mockSharing.shareAsync).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ dialogTitle: 'Carnets CLUB-77' })
      )
    })
  })

  describe('manejo de errores', () => {
    it('muestra Alert y re-lanza el error si Print falla', async () => {
      const spyErr = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockPrint.printToFileAsync.mockRejectedValue(new Error('Print falló'))

      await expect(generatePDF([crearJugador()] as any, 'EQUIPO-01')).rejects.toThrow('Print falló')
      expect(mockAlert).toHaveBeenCalledWith('Error', 'No se pudo generar el PDF')
      spyErr.mockRestore()
    })
  })
})
