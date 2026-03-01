import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador'
import { getColorLiga600, getColorLiga700 } from '../config/liga'

const generarCarnetHTML = (jugador: CarnetDigitalDTO) => {
  const estado = jugador.estado as EstadoJugador
  const debeMostrarEstado =
    estado === EstadoJugador.Inhabilitado || estado === EstadoJugador.Suspendido

  return `
    <div class="carnet">
      ${
        debeMostrarEstado
          ? `
        <div class="carnet-header estado" style="background: ${obtenerColorEstado(estado)}">
          <h3>${obtenerTextoEstado(estado)}</h3>
        </div>
      `
          : `
        <div class="carnet-header">
          <h3>${jugador.nombre} ${jugador.apellido}</h3>
        </div>
      `
      }
      <div class="carnet-body">
        <img src="${jugador.fotoCarnet || 'https://via.placeholder.com/100'}" />
        <div class="carnet-info">
          <p class="dni">DNI: ${jugador.dni}</p>
          <p>Fecha Nacimiento: ${new Date(jugador.fechaNacimiento).toLocaleDateString()}</p>
          <p class="categoria">Categoría: ${new Date(jugador.fechaNacimiento).getFullYear()}</p>
        </div>
      </div>
    </div>
  `
}

const getPDFStyles = (colorLiga600: string, colorLiga700: string) => `
  * { print-color-adjust: exact !important; }
  @page {
    size: letter;
    margin: 0;
  }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: #f8f9fa;
  }
  .page {
    page-break-after: always;
    padding: 20px;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .header {
    text-align: center;
    padding: 24px;
    background: linear-gradient(135deg, ${colorLiga700}, ${colorLiga600});
    color: white;
    margin-bottom: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  .header h1 {
    margin: 0;
    font-size: 24px;
    color: white;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .header p {
    margin: 8px 0 0 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  .carnet-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 20px;
    height: calc(100vh - 120px);
  }
  .carnet {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    height: 215px;
    position: relative;
    transition: transform 0.2s ease;
  }
  .carnet-header {
    background: linear-gradient(135deg, ${colorLiga700}, ${colorLiga600});
    padding: 10px;
    text-align: center;
    color: white;
  }
  .carnet-header.estado {
    background: none;
    padding: 12px;
    border-bottom: 2px solid #e0e0e0;
  }
  .carnet-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.3px;
  }
  .carnet-header.estado h3 {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }
  .carnet-body {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
  }
  .carnet img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-bottom: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 2px solid ${colorLiga700};
  }
  .carnet-info {
    text-align: center;
    width: 100%;
    padding: 0 5px;
  }
  .carnet-info p {
    margin: 2px 0;
    font-size: 11px;
    color: #555;
    line-height: 1.4;
    font-weight: 400;
  }
  .carnet-info .dni {
    font-weight: 600;
    color: ${colorLiga600};
    margin-top: 3px;
    font-size: 12px;
    letter-spacing: 0.2px;
  }
  .carnet-info .categoria {
    color: ${colorLiga600};
    font-weight: 600;
    margin-top: 3px;
    font-size: 12px;
    letter-spacing: 0.2px;
  }
  .carnet::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px ${colorLiga700};
    pointer-events: none;
  }
`

export const generatePDF = async (jugadores: CarnetDigitalDTO[], codigoEquipo: string) => {
  if (jugadores.length === 0) return

  try {
    const fechaGeneracion = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Ordenar jugadores por fecha de nacimiento (más viejos primero)
    const jugadoresOrdenados = [...jugadores].sort(
      (a, b) => new Date(a.fechaNacimiento).getTime() - new Date(b.fechaNacimiento).getTime()
    )

    // Dividir jugadores en grupos de 9 (3x3 por página)
    const jugadoresPorPagina = []
    for (let i = 0; i < jugadoresOrdenados.length; i += 9) {
      jugadoresPorPagina.push(jugadoresOrdenados.slice(i, i + 9))
    }

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            ${getPDFStyles(getColorLiga600(), getColorLiga700())}
          </style>
        </head>
        <body>
          ${jugadoresPorPagina
            .map(
              (pagina) => `
            <div class="page">
              <div class="header">
                <h1>${jugadores[0]?.equipo || 'Equipo'}</h1>
                <p>Generado el ${fechaGeneracion}</p>
              </div>
              <div class="carnet-grid">
                ${pagina.map((jugador) => generarCarnetHTML(jugador)).join('')}
              </div>
            </div>
          `
            )
            .join('')}
        </body>
      </html>
    `

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 612, // US Letter width in points
      height: 792, // US Letter height in points
    })

    if (await Sharing.isAvailableAsync()) {
      // No esperar a que el usuario cierre el diálogo de compartir: el PDF ya está listo
      // y mostrado. Así el botón deja de cargar en cuanto se abre el share sheet.
      Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Carnets ${codigoEquipo}`,
        UTI: 'com.adobe.pdf',
      }).catch((err) => {
        console.error('Error al compartir PDF:', err)
        Alert.alert('Error', 'No se pudo compartir el PDF')
      })
    } else {
      Alert.alert('PDF Generado', `El PDF se ha guardado en: ${uri}`, [{ text: 'OK' }])
    }

    return uri
  } catch (error) {
    console.error('Error generating PDF:', error)
    Alert.alert('Error', 'No se pudo generar el PDF')
    throw error
  }
}
