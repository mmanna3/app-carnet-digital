#!/usr/bin/env node
/**
 * Servidor HTTP mock para tests E2E (Maestro).
 *
 * Variables de entorno:
 *   MOCK_PORT  Puerto donde escucha (default: 3001)
 *   SCENARIO   Escenario de respuestas (default: 'happy')
 *
 * Escenarios disponibles:
 *   happy           Happy path: código válido, DNI libre
 *   codigo_invalido obtenerNombreEquipo devuelve error
 *   dni_fichado     elDniEstaFichado devuelve true
 *
 * Nota: en escenario 'happy', el endpoint el-dni-esta-fichado es inteligente:
 *   - DNI 87654321 → true  (para tests ya-fichado / delegado-verde)
 *   - cualquier otro DNI → false
 */
const http = require('http')
const { URL } = require('url')

const PORT = process.env.MOCK_PORT || 3001
let SCENARIO = process.env.SCENARIO || 'happy'

// key: "MÉTODO:/ruta"  →  valor: objeto con respuestas por escenario
const RESPONSES = {
  'GET:/api/publico/obtener-nombre-equipo': {
    happy: { hayError: false, respuesta: 'Equipo de Prueba' },
    codigo_invalido: { hayError: true, mensajeError: 'Código inválido' },
  },
  'GET:/api/publico/el-dni-esta-fichado': {
    happy: false,       // sobreescrito por lógica smart (ver abajo)
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
      equipos: [
        { id: 1, nombre: 'Equipo de Prueba', codigoAlfanumerico: 'ABC1234', torneo: 'Torneo E2E' },
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
        estado: 1,
        fotoCarnet: null,
      },
    ],
  },
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`)
  const key = `${req.method}:${parsedUrl.pathname}`

  console.log(`[mock] ${req.method} ${req.url}`)

  // Endpoint interno: cambiar escenario en tiempo de ejecución
  if (key === 'POST:/_set-scenario') {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
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

  // Lógica smart para el-dni-esta-fichado en escenario happy:
  // DNI 87654321 → true (tests ya-fichado), cualquier otro → false
  if (key === 'GET:/api/publico/el-dni-esta-fichado' && SCENARIO === 'happy') {
    const dni = parsedUrl.searchParams.get('dni')
    body = dni === '87654321'
  } else {
    body = scenarioResponses[SCENARIO] ?? scenarioResponses['happy']
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[mock] corriendo en 0.0.0.0:${PORT}  (escenario: ${SCENARIO})`)
})
