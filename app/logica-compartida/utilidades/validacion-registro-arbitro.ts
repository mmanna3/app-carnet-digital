import { validarCelular, validarDni } from '@/logica-compartida/utilidades/validacion-formulario'
import {
  FRANJAS_HORARIAS,
  TIPOS_MOVILIDAD,
  TORNEOS_INTERES,
} from '@/logica-compartida/constantes/registro-arbitro'

function dniSoloDigitosValido(dni: string): boolean {
  return validarDni(dni) === null && /^\d+$/.test(dni.trim())
}

function perteneceA<T extends string>(valor: string | null, catalogo: readonly T[]): valor is T {
  return valor !== null && (catalogo as readonly string[]).includes(valor)
}

function seleccionValida<T extends string>(
  valores: readonly string[],
  catalogo: readonly T[]
): boolean {
  return valores.length > 0 && valores.every((valor) => perteneceA(valor, catalogo))
}

export function pasoDatosPersonalesCompleto(datos: {
  dni: string
  apellido: string
  nombre: string
  telefonoCelular: string
}): boolean {
  return (
    dniSoloDigitosValido(datos.dni) &&
    datos.apellido.trim().length > 0 &&
    datos.nombre.trim().length > 0 &&
    validarCelular(datos.telefonoCelular) === null
  )
}

export function pasoUbicacionCompleto(datos: {
  direccion: string
  localidad: string
  fechaNacimiento: Date | null
  tipoMovilidad: string | null
}): boolean {
  return (
    datos.direccion.trim().length > 0 &&
    datos.localidad.trim().length > 0 &&
    datos.fechaNacimiento !== null &&
    perteneceA(datos.tipoMovilidad, TIPOS_MOVILIDAD)
  )
}

export function pasoPreferenciasCompleto(datos: {
  torneosInteres: readonly string[]
  disponibilidadHoraria: readonly string[]
}): boolean {
  return (
    seleccionValida(datos.torneosInteres, TORNEOS_INTERES) &&
    seleccionValida(datos.disponibilidadHoraria, FRANJAS_HORARIAS)
  )
}

export function pasoAntecedentesCompleto(datos: {
  tieneRelacionInstitucional: boolean | null
  institucion: string
}): boolean {
  if (datos.tieneRelacionInstitucional === null) return false
  if (!datos.tieneRelacionInstitucional) return true
  return datos.institucion.trim().length > 0
}
