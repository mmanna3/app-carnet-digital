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
 */
const http = require('http')
const { URL } = require('url')

const PORT = process.env.MOCK_PORT || 3001
const SCENARIO = process.env.SCENARIO || 'happy'

// key: "MÉTODO:/ruta"  →  valor: objeto con respuestas por escenario
const RESPONSES = {
  'GET:/api/publico/obtener-nombre-equipo': {
    happy: { hayError: false, respuesta: 'Equipo de Prueba' },
    codigo_invalido: { hayError: true, mensajeError: 'Código inválido' },
  },
  'GET:/api/publico/el-dni-esta-fichado': {
    happy: false,
    dni_fichado: true,
  },
  'POST:/api/Jugador': {
    happy: { id: 99, dni: '12345678', nombre: 'Juan', apellido: 'Perez' },
  },
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`)
  const key = `${req.method}:${parsedUrl.pathname}`

  console.log(`[mock] ${req.method} ${req.url}`)

  const scenarioResponses = RESPONSES[key]
  if (!scenarioResponses) {
    console.warn(`[mock] sin handler para ${key}`)
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: `Sin mock para ${key}` }))
    return
  }

  const body = scenarioResponses[SCENARIO] ?? scenarioResponses['happy']
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
})

server.listen(PORT, () => {
  console.log(`[mock] corriendo en :${PORT}  (escenario: ${SCENARIO})`)
})
