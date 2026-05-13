import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador'
import { getColorLiga600, getColorLiga700 } from '../config/liga'

const obtenerAñoCategoría = (fechaNacimiento: Date) => new Date(fechaNacimiento).getFullYear()

/** Misma agrupación y orden que en `buscar.tsx`: categorías por año ascendente; dentro de cada una, orden del listado original. */
const jugadoresOrdenadosPorCategoría = (jugadores: CarnetDigitalDTO[]) => {
  const porAño = jugadores.reduce(
    (acc, jugador) => {
      const año = obtenerAñoCategoría(jugador.fechaNacimiento)
      if (!acc[año]) acc[año] = []
      acc[año].push(jugador)
      return acc
    },
    {} as Record<number, CarnetDigitalDTO[]>
  )
  const años = Object.keys(porAño)
    .map(Number)
    .sort((a, b) => a - b)
  return años.flatMap((año) => porAño[año])
}

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

const MAX_FILAS_LAYOUT_TOTAL = 5
/** Altura de ~3 filas de carnets (215px c/u); más filas de carnets recorta en carta. */
const MAX_FILAS_CARNETS = 3

/**
 * Cuenta filas como las pinta la grilla CSS de 3 columnas:
 * - Cada cartel = 1 fila (ancho completo).
 * - Tras un cartel, el siguiente carnet abre una nueva fila de carnets.
 * - Cada fila de carnets admite hasta 3 tarjetas; una sola tarjeta igual cuenta como 1 fila de altura.
 * Así se detectan casos como [Cartel][1 carnet][Cartel][2–9] que con ceil(9/3) parecían “5 filas” pero son 6.
 */
const contarFilasLayoutPagina = (
  todos: CarnetDigitalDTO[],
  indicePrimerJugadorGlobal: number,
  jugadoresEnPagina: CarnetDigitalDTO[]
): { filasCarteles: number; filasCarnets: number } => {
  let filasCarteles = 0
  let filasCarnets = 0
  let ocupacionFilaCarnets = 0

  for (let j = 0; j < jugadoresEnPagina.length; j++) {
    const indiceGlobal = indicePrimerJugadorGlobal + j
    const jugador = jugadoresEnPagina[j]
    const anterior = indiceGlobal > 0 ? todos[indiceGlobal - 1] : null
    const cambiaCategoría =
      !anterior || obtenerAñoCategoría(anterior.fechaNacimiento) !== obtenerAñoCategoría(jugador.fechaNacimiento)
    if (cambiaCategoría) {
      filasCarteles += 1
      ocupacionFilaCarnets = 0
    }
    if (ocupacionFilaCarnets === 0) {
      filasCarnets += 1
    }
    ocupacionFilaCarnets += 1
    if (ocupacionFilaCarnets === 3) {
      ocupacionFilaCarnets = 0
    }
  }
  return { filasCarteles, filasCarnets }
}

const cabeLayoutEnUnaHoja = (filasCarteles: number, filasCarnets: number) =>
  filasCarteles + filasCarnets <= MAX_FILAS_LAYOUT_TOTAL && filasCarnets <= MAX_FILAS_CARNETS

/** Pagina según filas reales de cartel + filas de carnets en la grilla 3×N. */
const armarPaginasPorCapacidad = (jugadoresOrdenados: CarnetDigitalDTO[]) => {
  const paginas: { carnets: CarnetDigitalDTO[]; indiceInicio: number }[] = []
  const n = jugadoresOrdenados.length
  let globalStart = 0
  while (globalStart < n) {
    const carnets: CarnetDigitalDTO[] = []
    let k = globalStart
    while (k < n) {
      const tentativa = [...carnets, jugadoresOrdenados[k]]
      const { filasCarteles, filasCarnets } = contarFilasLayoutPagina(jugadoresOrdenados, globalStart, tentativa)
      if (!cabeLayoutEnUnaHoja(filasCarteles, filasCarnets)) {
        if (carnets.length === 0) {
          carnets.push(jugadoresOrdenados[k])
          k++
        }
        break
      }
      carnets.push(jugadoresOrdenados[k])
      k++
    }
    paginas.push({ carnets, indiceInicio: globalStart })
    globalStart = k
  }
  return paginas
}

/** Un cartel antes de cada carnet cuya categoría difiere del jugador anterior en la lista (igual que bloques en `buscar.tsx`). */
const generarCarnetsGridHTML = (
  jugadoresOrdenados: CarnetDigitalDTO[],
  indiceInicioPagina: number,
  carnetsEnPagina: CarnetDigitalDTO[]
) => {
  let html = ''
  for (let j = 0; j < carnetsEnPagina.length; j++) {
    const jugador = carnetsEnPagina[j]
    const indiceGlobal = indiceInicioPagina + j
    const anterior = indiceGlobal > 0 ? jugadoresOrdenados[indiceGlobal - 1] : null
    const año = obtenerAñoCategoría(jugador.fechaNacimiento)
    const cambiaCategoría =
      !anterior || obtenerAñoCategoría(anterior.fechaNacimiento) !== año
    if (cambiaCategoría) {
      html += `<div class="categoria-banner">Categoría ${año}</div>`
    }
    html += generarCarnetHTML(jugador)
  }
  return html
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
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 752px;
  }
  .page-content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .page-footer {
    flex-shrink: 0;
    margin-top: auto;
    padding-top: 12px;
    text-align: center;
    font-size: 10px;
    color: #888;
    font-weight: 500;
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
  /* Cartel de categoría dentro de la grilla (misma fila completa que 3 carnets). */
  .categoria-banner {
    grid-column: 1 / -1;
    text-align: center;
    padding: 8px 12px;
    margin: 0 0 10px 0;
    background: ${colorLiga600};
    color: white;
    font-size: 14px;
    font-weight: 700;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .carnet-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 20px;
    /* Sin altura fija: con carteles extra la grilla crece y recortaba al forzar 100vh. */
    flex: 1 1 auto;
    align-content: start;
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
    break-inside: avoid;
    page-break-inside: avoid;
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

    const jugadoresOrdenados = jugadoresOrdenadosPorCategoría(jugadores)

    const paginas = armarPaginasPorCapacidad(jugadoresOrdenados)

    const totalPaginas = paginas.length

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            ${getPDFStyles(getColorLiga600(), getColorLiga700())}
          </style>
        </head>
        <body>
          ${paginas
            .map(
              ({ carnets, indiceInicio }, indicePagina) => `
            <div class="page">
              <div class="page-content">
                <div class="header">
                  <h1>${jugadores[0]?.equipo || 'Equipo'}</h1>
                  <p>Generado el ${fechaGeneracion}</p>
                </div>
                <div class="carnet-grid">
                  ${generarCarnetsGridHTML(jugadoresOrdenados, indiceInicio, carnets)}
                </div>
              </div>
              <div class="page-footer">Página ${indicePagina + 1}/${totalPaginas}</div>
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
