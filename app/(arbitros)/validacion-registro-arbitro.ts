import {
  validarApellido,
  validarCelular,
  validarDni,
  validarNombre,
} from '@/logica-compartida/utilidades/validacion-formulario'
import { FRANJAS_HORARIAS, TIPOS_MOVILIDAD, TORNEOS_INTERES } from '@/arbitros/catalogos'

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

export function validarDireccion(valor: string): string | null {
  if (!valor.trim()) return 'La dirección es obligatoria'
  return null
}

export function validarLocalidad(valor: string): string | null {
  if (!valor.trim()) return 'La localidad es obligatoria'
  return null
}

export function validarInstitucion(valor: string): string | null {
  if (!valor.trim()) return 'La institución es obligatoria'
  return null
}

export function validarFechaNacimiento(fecha: Date | null): string | null {
  if (!fecha) return 'La fecha de nacimiento es obligatoria'
  return null
}

export function pasoDatosPersonalesCompleto(datos: {
  dni: string
  apellido: string
  nombre: string
  telefonoCelular: string
  fechaNacimiento: Date | null
}): boolean {
  return (
    dniSoloDigitosValido(datos.dni) &&
    validarApellido(datos.apellido) === null &&
    validarNombre(datos.nombre) === null &&
    validarCelular(datos.telefonoCelular) === null &&
    validarFechaNacimiento(datos.fechaNacimiento) === null
  )
}

export function pasoUbicacionCompleto(datos: {
  direccion: string
  localidad: string
  tipoMovilidad: string | null
}): boolean {
  return (
    validarDireccion(datos.direccion) === null &&
    validarLocalidad(datos.localidad) === null &&
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
  return validarInstitucion(datos.institucion) === null
}

export { validarApellido, validarCelular, validarDni, validarNombre }
