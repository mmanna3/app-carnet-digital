#!/usr/bin/env node
/**
 * Servidor HTTP mock para tests E2E (Maestro).
 *
 * Variables de entorno:
 *   MOCK_PORT  Puerto donde escucha (default: 3001)
 *   SCENARIO   Escenario de respuestas (default: 'happy')
 *
 * Escenarios disponibles:
 *   happy              Happy path completo
 *   codigo_invalido    obtenerNombreEquipo devuelve error
 *   dni_fichado        elDniEstaFichado devuelve true
 *   error_carnets      GET carnets devuelve 500 (para test pantalla de error)
 *   error_desvincular  POST desvincular devuelve 500 (para test error al eliminar)
 *
 * Lógica smart en escenario 'happy':
 *   - obtener-nombre-equipo: código MTD0001 → válido, cualquier otro → error
 *   - el-dni-esta-fichado: DNI 87654321 → true, cualquier otro → false
 *   - carnets: equipoId=3 (Equipo B2) → devuelve 500 (para test 20)
 *   - desvincular: equipoId=2 (Equipo B1) → devuelve 500 (para test 19)
 *
 * Respuestas con error HTTP: usar { _statusCode: N } como valor del escenario.
 */
const http = require('http')
const { URL } = require('url')

const PORT = process.env.MOCK_PORT || 3001
let SCENARIO = process.env.SCENARIO || 'happy'

// key: "MÉTODO:/ruta"  →  valor: objeto con respuestas por escenario
// Usar { _statusCode: N } para simular errores HTTP (4xx / 5xx)
const RESPONSES = {
  'GET:/api/publico/obtener-nombre-equipo': {
    happy: { hayError: false, respuesta: 'Equipo de Prueba' },
    codigo_invalido: { hayError: true, mensajeError: 'Código inválido' },
  },
  'GET:/api/publico/el-dni-esta-fichado': {
    happy: false, // sobreescrito por lógica smart (ver abajo)
    dni_fichado: true,
  },
  'POST:/api/Jugador': {
    happy: { id: 99, dni: '12345678', nombre: 'Juan', apellido: 'Perez' },
  },
  'POST:/api/publico/fichar-en-otro-equipo': {
    happy: 99,
  },
  'GET:/api/publico/obtener-club': {
    happy: { hayError: false, clubNombre: 'Club de Prueba', clubId: 42 },
    codigo_invalido: { hayError: true, mensajeError: 'Código inválido' },
  },
  'GET:/api/publico/obtener-nombre-usuario-disponible': {
    happy: 'juan.perez',
  },
  'GET:/api/publico/obtener-nombre-usuario-por-dni': {
    happy: { hayError: false, nombreUsuario: 'juan.perez' },
  },
  'POST:/api/Delegado': {
    happy: { id: 99, dni: '12345678', nombre: 'Juan', apellido: 'Perez' },
  },
  'POST:/api/Delegado/fichar-delegado-solo-con-dni-y-club': {
    happy: 99,
  },
  'POST:/api/Auth/login': {
    happy: { exito: true, token: 'token-e2e-abc123' },
  },
  'GET:/api/carnet-digital/equipos-del-delegado': {
    happy: {
      clubsConEquipos: [
        {
          nombre: 'Club de Prueba',
          equipos: [
            {
              id: 1,
              nombre: 'Equipo de Prueba',
              codigoAlfanumerico: 'ABC1234',
              torneo: 'Torneo E2E',
            },
          ],
        },
        {
          nombre: 'Club Secundario',
          equipos: [
            { id: 2, nombre: 'Equipo B1', codigoAlfanumerico: 'BBBBB1', torneo: 'Torneo E2E' },
            { id: 3, nombre: 'Equipo B2', codigoAlfanumerico: 'BBBBB2', torneo: 'Torneo E2E' },
          ],
        },
      ],
    },
  },
  'GET:/api/carnet-digital/carnets': {
    happy: [
      {
        id: 1,
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '2010-03-15T00:00:00Z',
        equipo: 'Equipo de Prueba',
        torneo: 'Torneo E2E',
        estado: 3,
        fotoCarnet: null,
      },
    ],
    error_carnets: { _statusCode: 500 },
  },
  'GET:/api/carnet-digital/carnets-por-codigo-alfanumerico': {
    happy: [
      {
        id: 1,
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        fechaNacimiento: '2010-03-15T00:00:00Z',
        equipo: 'Equipo de Prueba',
        torneo: 'Torneo E2E',
        estado: 3,
        fotoCarnet: null,
      },
    ],
  },
  'GET:/api/carnet-digital/jugadores-pendientes': {
    happy: [
      {
        id: 2,
        dni: '99887766',
        nombre: 'Maria',
        apellido: 'Garcia',
        fechaNacimiento: '2008-06-20T00:00:00Z',
        equipo: 'Equipo de Prueba',
        torneo: 'Torneo E2E',
        estado: 1,
        fotoCarnet: null,
      },
    ],
  },
  'POST:/api/Jugador/desvincular-jugador-del-equipo': {
    happy: 1,
    error_desvincular: { _statusCode: 500 },
  },
  'POST:/api/Jugador/efectuar-pases': {
    happy: 1,
  },
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`)
  const key = `${req.method}:${parsedUrl.pathname}`

  console.log(`[mock] ${req.method} ${req.url}`)

  // Endpoint interno: cambiar escenario en tiempo de ejecución
  if (key === 'POST:/_set-scenario') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const { scenario } = JSON.parse(body)
        SCENARIO = scenario
        console.log(`[mock] Escenario cambiado a: ${scenario}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch {
        res.writeHead(400)
        res.end()
      }
    })
    return
  }

  const scenarioResponses = RESPONSES[key]
  if (!scenarioResponses) {
    console.warn(`[mock] sin handler para ${key}`)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: `Sin mock para ${key}` }))
    return
  }

  let body

  // Lógica smart para obtener-nombre-equipo en escenario happy:
  // código MTD0001 → equipo válido, cualquier otro → error (para test de código inválido)
  if (key === 'GET:/api/publico/obtener-nombre-equipo' && SCENARIO === 'happy') {
    const codigo = parsedUrl.searchParams.get('codigoAlfanumerico')
    body =
      codigo === 'MTD0001'
        ? { hayError: false, respuesta: 'Equipo de Prueba' }
        : { hayError: true, mensajeError: 'Código inválido' }
  }
  // Lógica smart para el-dni-esta-fichado en escenario happy:
  // DNI 87654321 → true (tests ya-fichado), cualquier otro → false
  else if (key === 'GET:/api/publico/el-dni-esta-fichado' && SCENARIO === 'happy') {
    const dni = parsedUrl.searchParams.get('dni')
    body = dni === '87654321'
  }
  // Lógica smart para carnets: equipoId=3 (Equipo B2) → 500 (test 20 error de red)
  else if (key === 'GET:/api/carnet-digital/carnets' && SCENARIO === 'happy') {
    const equipoId = parsedUrl.searchParams.get('equipoId')
    if (equipoId === '3') {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Error del servidor' }))
      return
    }
    body = scenarioResponses[SCENARIO]
  }
  // Lógica smart para desvincular: equipoId=2 (Equipo B1) → 500 (test 19 error al eliminar)
  else if (key === 'POST:/api/Jugador/desvincular-jugador-del-equipo' && SCENARIO === 'happy') {
    let rawBody = ''
    req.on('data', (chunk) => {
      rawBody += chunk
    })
    req.on('end', () => {
      try {
        const parsed = JSON.parse(rawBody)
        if (parsed.equipoId === 2) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Error del servidor' }))
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(scenarioResponses[SCENARIO] ?? scenarioResponses['happy']))
        }
      } catch {
        res.writeHead(400)
        res.end()
      }
    })
    return
  } else {
    body = scenarioResponses[SCENARIO] ?? scenarioResponses['happy']
  }

  // Soporte para respuestas con error HTTP: { _statusCode: N }
  if (body !== null && typeof body === 'object' && '_statusCode' in body) {
    res.writeHead(body._statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Error del servidor' }))
    return
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[mock] corriendo en 0.0.0.0:${PORT}  (escenario: ${SCENARIO})`)
})
