import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { PlanillaDeJuegoDTO } from '@/lib/api/clients'

const primeraMayuscRestoMinusc = (texto: string | undefined): string => {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
    page-break-after: always;
    position: relative;
  }

  .pagina:last-child {
    page-break-after: avoid;
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
    margin: 20px 0;
  }

  .faltas-titulo {
    font-weight: 500;
    margin-bottom: 10px;
  }

  .faltas-contenedor {
    display: flex;
    justify-content: space-between;
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
    margin: 15px 0;
  }

  .tabla th, .tabla td {
    border: 1px solid #000;
    padding: 5px;
    text-align: left;
    height: 25px;
    min-height: 25px;
    font-size: 11px;
  }

  .tabla th {
    background-color: #f5f5f5;
    font-weight: 500;
  }

  .firmas {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
  }

  .firma-grupo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
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

  .numero-pagina {
    position: absolute;
    bottom: 10mm;
    right: 15mm;
    font-size: 12px;
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
  numeroPagina: number,
  totalPaginas: number
) => {
  return `
  <div class="pagina">
    <div class="titulo">PLANILLA DE JUEGO</div>

    <div class="encabezado">
      <div class="encabezado-grupo">
        <label>Torneo: ${torneo}</label>
        <label>Equipo: ${equipo}</label>
        ${
          mostrarEncabezadoCompleto
            ? `
        <label>GOLES: <input type="text" /></label>
        ${esTorneoFutsal ? `<label>Min: <input type="text" /><input type="text" /></label>` : ''}
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
        `
            : ''
        }
      </div>
    </div>

    ${
      mostrarEncabezadoCompleto && esTorneoFutsal
        ? `
    <div class="faltas">
      <div class="faltas-titulo">Faltas Acumuladas:</div>
      <div class="faltas-contenedor">
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
            <td>${primeraMayuscRestoMinusc(jugador.nombre)}</td>
            <td>${jugador.dni ?? ''}</td>
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
      <div class="observaciones-item">
        <label>Jug. Expulsado: </label>
      </div>
      <div class="observaciones-item">
        <label>Público Expulsado: </label>
      </div>
      <div class="observaciones-item">
        <label>Observaciones: </label>
      </div>
    </div>

    <div class="firmas">
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

    <div class="numero-pagina">Página ${numeroPagina} de ${totalPaginas}</div>
  </div>
`
}

const generarPlanillaHtml = (
  planilla: { categoria?: string; jugadores?: { nombre?: string; dni?: string; estado?: string }[] },
  torneo: string,
  equipo: string
): string => {
  const jugadores = planilla.jugadores ?? []
  const categoria = planilla.categoria ?? ''
  const esTorneoFutsal = torneo.toLowerCase().includes('futsal')

  const jugadoresConBlancos = [
    ...jugadores,
    ...Array(6).fill({ nombre: '', dni: '', estado: '' }),
  ]

  const jugadoresPorPagina = esTorneoFutsal ? 25 : 30
  const totalPaginas = Math.ceil(jugadoresConBlancos.length / jugadoresPorPagina)

  let paginasHtml = ''

  for (let i = 0; i < totalPaginas; i++) {
    const inicio = i * jugadoresPorPagina
    const fin = Math.min(inicio + jugadoresPorPagina, jugadoresConBlancos.length)
    const jugadoresEnPagina = jugadoresConBlancos.slice(inicio, fin)
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
      i + 1,
      totalPaginas
    )
  }

  return paginasHtml
}

export const generatePlanillas = async (dto: PlanillaDeJuegoDTO, codigoEquipo: string) => {
  const torneo = dto.torneo ?? ''
  const equipo = dto.equipo ?? ''
  const planillas = dto.planillas ?? []

  const planillasHtml = planillas
    .map((planilla) => generarPlanillaHtml(planilla, torneo, equipo))
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
