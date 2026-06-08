const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarNombre(v: string): string | null {
  if (!v.trim()) return 'El nombre es obligatorio'
  return null
}

export function validarApellido(v: string): string | null {
  if (!v.trim()) return 'El apellido es obligatorio'
  return null
}

export function validarDni(v: string): string | null {
  const n = v.trim()
  if (!n) return 'El DNI es obligatorio'
  if (n.length < 7 || n.length > 9) return 'El DNI debe tener entre 7 y 9 dígitos'
  return null
}

export function validarEmail(v: string): string | null {
  if (!v.trim()) return 'El email es obligatorio'
  if (!EMAIL_REGEX.test(v.trim())) return 'Ingresá un email válido'
  return null
}

export function validarCelular(v: string): string | null {
  if (!v.trim()) return 'El celular es obligatorio'
  if (v.trim().length < 8) return 'El celular debe tener al menos 8 dígitos'
  return null
}

export function dniTieneLongitudValida(v: string): boolean {
  const n = v.trim().length
  return n >= 7 && n <= 9
}
