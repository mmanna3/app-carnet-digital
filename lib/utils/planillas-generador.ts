import { Asset } from 'expo-asset'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'
import { Alert } from 'react-native'
import { PlanillaDeJuegoDTO } from '@/lib/api/clients'

/** Logo EDeFI para marca de agua en planillas (PDF). */
const PLANILLA_MARCA_AGUA_ICON = require('@/assets/ligas/edefi/icon.png')

async function obtenerDataUriMarcaAguaEdifi(): Promise<string | null> {
  try {
    const asset = Asset.fromModule(PLANILLA_MARCA_AGUA_ICON)
    await asset.downloadAsync()
    const uri = asset.localUri ?? asset.uri
    if (!uri) return null
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    })
    return `data:image/png;base64,${base64}`
  } catch (e) {
    console.warn('Marca de agua planilla (EDEFI):', e)
    return null
  }
}

/** Nombre en planilla: mayúsculas para escritura a mano clara. */
const nombreParaPlanilla = (texto: string | undefined): string => {
  if (!texto) return ''
  return texto.trim().toUpperCase()
}

const stylesTag = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  * {
    font-family: 'Roboto', sans-serif;
  }

  @page {
    size: A4;
    margin: 15mm 15mm 25mm 15mm;
  }

  .pagina {
    width: 210mm;
    padding: 15mm 15mm;
    margin: 0 auto;
    background: white;
    box-sizing: border-box;
    position: relative;
  }

  /**
   * Nunca usar page-break-after: always aquí: si una .pagina ocupa más de una hoja física,
   * ese break agrega una página en blanco al final del bloque (común en WebKit/PDF).
   * Cada hoja nueva se fuerza solo con break-before en la siguiente .pagina.
   */
  .pagina + .pagina {
    page-break-before: always;
    break-before: page;
  }

  .pagina-cuerpo {
    position: relative;
    z-index: 1;
  }

  .pagina-marca-agua {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100mm;
    max-width: 78%;
    height: auto;
    object-fit: contain;
    opacity: 0.14;
    pointer-events: none;
    z-index: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .titulo {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .encabezado {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .encabezado-grupo {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .encabezado-grupo label {
    font-weight: 500;
    font-size: 12px;
  }

  .encabezado-grupo input {
    border: none;
    border-bottom: 1px solid #000;
    width: 80px;
    padding: 3px;
    font-size: 12px;
  }

  .encabezado-firmas {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .encabezado-firmas .encabezado-grupo {
    flex: 1;
  }

  .encabezado-firmas .encabezado-grupo:not(:first-child) {
    margin-left: 20px;
  }

  .fecha-formato {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .fecha-formato span {
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  .faltas {
    margin: 8px 0 10px;
  }

  .faltas-contenedor {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
  }

  .faltas-titulo-inline {
    font-weight: 500;
    font-size: 12px;
    flex-shrink: 0;
  }

  .faltas-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .faltas-grupo {
    display: flex;
    gap: 10px;
  }

  .faltas-checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .tabla {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 10px;
  }

  .tabla th, .tabla td {
    border: 1px solid #000;
    padding: 2px 4px;
    text-align: left;
    height: 20px;
    min-height: 20px;
    font-size: 11px;
    vertical-align: middle;
  }

  .tabla th {
    background-color: #f5f5f5;
    font-weight: 500;
  }

  .tabla td.col-nombre,
  .tabla td.col-dni {
    font-weight: 700;
    font-size: 13px;
    line-height: 1.15;
  }

  .tabla td.col-nombre {
    text-transform: uppercase;
  }

  .firmas {
    margin-top: 22px;
    display: flex;
    justify-content: space-between;
  }

  /** Mismo aire entre observaciones y firmas (FUTSAL y no FUTSAL). */
  .firmas.firmas-futsal,
  .firmas.firmas-no-futsal {
    margin-top: 46px;
  }

  .firma-grupo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .firmas .firma-grupo label {
    font-size: 11px;
    font-weight: 500;
  }

  .firma-linea {
    width: 200px;
    border-bottom: 1px solid #000;
  }

  .observaciones {
    margin-top: 20px;
  }

  .observaciones-item {
    margin-bottom: 10px;
  }

  .observaciones-fila {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 0;
  }

  .observaciones-fila label {
    flex-shrink: 0;
    font-weight: 500;
    font-size: 12px;
  }

  .observaciones-linea-extension {
    flex: 1;
    border-bottom: 1px solid #000;
    min-height: 16px;
  }

  /** Segundo renglón: solo línea inferior para escribir a mano (sin caja). */
  .observaciones-linea-sola {
    width: 100%;
    border: none;
    border-bottom: 1px solid #000;
    min-height: 18px;
    margin-top: 10px;
    box-sizing: border-box;
  }

</style>
`

const generarPaginaHtml = (
  jugadoresEnPagina: { nombre?: string; dni?: string; estado?: string }[],
  torneo: string,
  equipo: string,
  categoria: string,
  esTorneoFutsal: boolean,
  mostrarEncabezadoCompleto: boolean,
  esUltimaPagina: boolean,
  dataUriMarcaAgua: string | null
) => {
  const marcaAguaHtml = dataUriMarcaAgua
    ? `<img class="pagina-marca-agua" src="${dataUriMarcaAgua}" alt="" />`
    : ''

  return `
  <div class="pagina">
    ${marcaAguaHtml}
    <div class="pagina-cuerpo">
    <div class="titulo">PLANILLA DE JUEGO</div>

    <div class="encabezado">
      <div class="encabezado-grupo">
        <label>Torneo: ${torneo}</label>
        <label>Equipo: ${equipo}</label>
        ${
          mostrarEncabezadoCompleto
            ? `
        <label>GOLES: <input type="text" /></label>
        `
            : ''
        }
      </div>
      <div class="encabezado-grupo">
        <label>Categoría: ${categoria}</label>
        ${
          mostrarEncabezadoCompleto
            ? `
        <div class="fecha-formato">
          <label>Día:</label>
          <span> </span>/<span> </span>/<span> </span>
        </div>
        ${esTorneoFutsal ? `<label>Min: <input type="text" /><input type="text" /></label>` : ''}
        `
            : ''
        }
      </div>
    </div>

    ${
      mostrarEncabezadoCompleto && esTorneoFutsal
        ? `
    <div class="faltas">
      <div class="faltas-contenedor">
        <span class="faltas-titulo-inline">Faltas Acumuladas</span>
        <div class="faltas-inline">
          <div class="faltas-grupo">
            <label>1er T:</label>
            <div class="faltas-checkbox">1</div>
            <div class="faltas-checkbox">2</div>
            <div class="faltas-checkbox">3</div>
            <div class="faltas-checkbox">4</div>
            <div class="faltas-checkbox">5</div>
          </div>
          <div class="faltas-grupo">
            <label>2do T:</label>
            <div class="faltas-checkbox">1</div>
            <div class="faltas-checkbox">2</div>
            <div class="faltas-checkbox">3</div>
            <div class="faltas-checkbox">4</div>
            <div class="faltas-checkbox">5</div>
          </div>
        </div>
      </div>
    </div>
    `
        : ''
    }

    <table class="tabla">
      <thead>
        <tr>
          <th>Nº</th>
          <th>Apellido y Nombre</th>
          <th>D.N.I.</th>
          <th>Firma</th>
          <th>Goles</th>
          ${
            esTorneoFutsal
              ? `
          <th>AM</th>
          <th>C/O</th>
          <th>EXP</th>
          `
              : `
          <th>AM</th>
          <th>EXP</th>
          `
          }
        </tr>
      </thead>
      <tbody>
        ${jugadoresEnPagina
          .map(
            (jugador) => `
          <tr>
            <td></td>
            <td class="col-nombre">${nombreParaPlanilla(jugador.nombre)}</td>
            <td class="col-dni">${jugador.dni ?? ''}</td>
            <td>${jugador.estado !== 'Activo' ? (jugador.estado ?? '') : ''}</td>
            <td></td>
            ${
              esTorneoFutsal
                ? `
            <td></td>
            <td></td>
            <td></td>
            `
                : `
            <td></td>
            <td></td>
            `
            }
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    ${
      esUltimaPagina
        ? `
    <div class="encabezado-firmas">
      <div class="encabezado-grupo">
        <label>DT: <input style="width: 200px" type="text" /></label>
      </div>
      ${
        esTorneoFutsal
          ? `
      <div class="encabezado-grupo">
        <label>Delegado responsable: <input style="width: 200px" type="text" /></label>
      </div>
      `
          : ''
      }
      <div class="encabezado-grupo">
        <label>AUX: <input style="width: 200px" type="text" /></label>
      </div>
    </div>

    <div class="observaciones">
      <div class="observaciones-item observaciones-fila">
        <label>Observaciones:</label>
        <div class="observaciones-linea-extension"></div>
      </div>
      <div class="observaciones-linea-sola" aria-hidden="true"></div>
    </div>

    <div class="firmas${esTorneoFutsal ? ' firmas-futsal' : ' firmas-no-futsal'}">
      <div class="firma-grupo">
        <div class="firma-linea"></div>
        <label>Firma Delegado LOCAL</label>
      </div>
      <div class="firma-grupo">
        <div class="firma-linea"></div>
        <label>Firma Delegado VISITANTE</label>
      </div>
      <div class="firma-grupo">
        <div class="firma-linea"></div>
        <label>Firma Árbitro</label>
      </div>
    </div>
    `
        : ''
    }

    </div>
  </div>
`
}

const generarPlanillaHtml = (
  planilla: {
    categoria?: string
    jugadores?: { nombre?: string; dni?: string; estado?: string }[]
  },
  torneo: string,
  equipo: string,
  dataUriMarcaAgua: string | null
): string => {
  const jugadores = planilla.jugadores ?? []
  const categoria = planilla.categoria ?? ''
  const esTorneoFutsal = torneo.toLowerCase().includes('futsal')

  /** Cantidad fija de renglones por hoja según formato (siempre igual en cada planilla del mismo tipo). */
  const RENGLONES_POR_PAGINA_FUTSAL = 28
  const RENGLONES_POR_PAGINA_NO_FUTSAL = 30
  const jugadoresPorPagina = esTorneoFutsal ? RENGLONES_POR_PAGINA_FUTSAL : RENGLONES_POR_PAGINA_NO_FUTSAL

  const filaVacia = (): { nombre: string; dni: string; estado: string } => ({
    nombre: '',
    dni: '',
    estado: '',
  })

  const totalPaginas = Math.max(1, Math.ceil(jugadores.length / jugadoresPorPagina))

  let paginasHtml = ''

  for (let i = 0; i < totalPaginas; i++) {
    const inicio = i * jugadoresPorPagina
    const parcial = jugadores.slice(inicio, inicio + jugadoresPorPagina)
    const huecos = jugadoresPorPagina - parcial.length
    const jugadoresEnPagina = [...parcial, ...Array.from({ length: huecos }, filaVacia)]
    const esUltimaPagina = i === totalPaginas - 1
    const mostrarEncabezadoCompleto = i === 0

    paginasHtml += generarPaginaHtml(
      jugadoresEnPagina,
      torneo,
      equipo,
      categoria,
      esTorneoFutsal,
      mostrarEncabezadoCompleto,
      esUltimaPagina,
      dataUriMarcaAgua
    )
  }

  return paginasHtml
}

export const generatePlanillas = async (dto: PlanillaDeJuegoDTO, codigoEquipo: string) => {
  const torneo = dto.torneo ?? ''
  const equipo = dto.equipo ?? ''
  const planillas = dto.planillas ?? []

  const dataUriMarcaAgua = await obtenerDataUriMarcaAguaEdifi()

  const planillasHtml = planillas
    .map((planilla) => generarPlanillaHtml(planilla, torneo, equipo, dataUriMarcaAgua))
    .join('')

  const html = `
    ${stylesTag}
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Planillas de Juego</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: white;">
        ${planillasHtml}
      </body>
    </html>
  `

  const { uri } = await Print.printToFileAsync({ html })

  if (await Sharing.isAvailableAsync()) {
    Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Planillas ${codigoEquipo}`,
      UTI: 'com.adobe.pdf',
    }).catch((err) => {
      console.error('Error al compartir planillas:', err)
      Alert.alert('Error', 'No se pudo compartir el PDF')
    })
  } else {
    Alert.alert('PDF Generado', `El PDF se ha guardado en: ${uri}`, [{ text: 'OK' }])
  }

  return uri
}
