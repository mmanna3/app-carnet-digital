import {
  validarApellido,
  validarDni,
  validarNombre,
} from '@/logica-compartida/utilidades/validacion-formulario'
import { OPCIONES_FRANJAS, OPCIONES_MOVILIDAD } from '@/arbitros/_logica/catalogos'
import type { FranjaHorariaArbitroEnum, TipoMovilidadArbitroEnum } from '@/lib/api/clients'

function dniSoloDigitosValido(dni: string): boolean {
  return validarDni(dni) === null && /^\d+$/.test(dni.trim())
}

function seleccionValida<T>(valores: readonly T[], validos: readonly T[]): boolean {
  return valores.length > 0 && valores.every((valor) => validos.includes(valor))
}

export const DIGITOS_CELULAR = 8
export const LARGO_MAXIMO_NOMBRE = 50

export function validarCelular(valor: string): string | null {
  if (!valor.trim()) return 'El celular es obligatorio'
  if (!/^\d+$/.test(valor) || valor.length !== DIGITOS_CELULAR) {
    return `El celular debe tener ${DIGITOS_CELULAR} dígitos`
  }
  return null
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
  tipoMovilidad: TipoMovilidadArbitroEnum | null
}): boolean {
  return (
    validarDireccion(datos.direccion) === null &&
    validarLocalidad(datos.localidad) === null &&
    datos.tipoMovilidad !== null &&
    OPCIONES_MOVILIDAD.some((opcion) => opcion.valor === datos.tipoMovilidad)
  )
}

/** `torneosDisponibles` son los ids que devolvió el back: sin ninguno no se puede avanzar. */
export function pasoPreferenciasCompleto(datos: {
  torneoAgrupadorIds: readonly number[]
  torneosDisponibles: readonly number[]
  franjasHorarias: readonly FranjaHorariaArbitroEnum[]
}): boolean {
  return (
    seleccionValida(datos.torneoAgrupadorIds, datos.torneosDisponibles) &&
    seleccionValida(
      datos.franjasHorarias,
      OPCIONES_FRANJAS.map((opcion) => opcion.valor)
    )
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

export { validarApellido, validarDni, validarNombre }
