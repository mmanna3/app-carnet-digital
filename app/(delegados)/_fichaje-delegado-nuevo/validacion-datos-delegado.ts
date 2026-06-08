import {
  validarApellido,
  validarCelular,
  validarDni,
  validarEmail,
  validarNombre,
} from '@/lib/utilidades/validacion-formulario'

export type ErroresCamposDelegado = {
  nombre: string | null
  apellido: string | null
  dni: string | null
  fechaNac: string | null
  email: string | null
  celular: string | null
}

export const ERRORES_INICIALES: ErroresCamposDelegado = {
  nombre: null,
  apellido: null,
  dni: null,
  fechaNac: null,
  email: null,
  celular: null,
}

export function puedeAvanzarDatosDelegado(datos: {
  nombre: string
  apellido: string
  dni: string
  fechaNac: Date | null
  email: string
  celular: string
}): boolean {
  return (
    !validarNombre(datos.nombre) &&
    !validarApellido(datos.apellido) &&
    !validarDni(datos.dni) &&
    !!datos.fechaNac &&
    !validarEmail(datos.email) &&
    !validarCelular(datos.celular)
  )
}

export { validarApellido, validarCelular, validarDni, validarEmail, validarNombre }
