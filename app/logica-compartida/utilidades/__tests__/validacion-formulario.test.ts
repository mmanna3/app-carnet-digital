import {
  dniTieneLongitudValida,
  validarApellido,
  validarCelular,
  validarDni,
  validarEmail,
  validarNombre,
} from '../validacion-formulario'

describe('validacion-formulario', () => {
  it('valida nombre y apellido obligatorios', () => {
    expect(validarNombre('')).toBe('El nombre es obligatorio')
    expect(validarNombre('Ana')).toBeNull()
    expect(validarApellido(' ')).toBe('El apellido es obligatorio')
    expect(validarApellido('Pérez')).toBeNull()
  })

  it('valida DNI', () => {
    expect(validarDni('')).toBe('El DNI es obligatorio')
    expect(validarDni('123456')).toBe('El DNI debe tener entre 7 y 9 dígitos')
    expect(validarDni('12345678')).toBeNull()
    expect(dniTieneLongitudValida('12345678')).toBe(true)
    expect(dniTieneLongitudValida('123')).toBe(false)
  })

  it('valida email', () => {
    expect(validarEmail('')).toBe('El email es obligatorio')
    expect(validarEmail('no-es-mail')).toBe('Ingresá un email válido')
    expect(validarEmail('a@b.com')).toBeNull()
  })

  it('valida celular', () => {
    expect(validarCelular('')).toBe('El celular es obligatorio')
    expect(validarCelular('1234567')).toBe('El celular debe tener al menos 8 dígitos')
    expect(validarCelular('1122334455')).toBeNull()
  })
})
