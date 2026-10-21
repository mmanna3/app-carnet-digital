import { create } from 'zustand'
import type { TipoMovilidad } from '@/arbitros/catalogos'
import { parseApiError } from '@/logica-compartida/utilidades/parsear-error-api'

/** Pasos del formulario. El paso siguiente es la pantalla de completado. */
export const TOTAL_PASOS = 4

export type DatosRegistroArbitro = {
  dni: string
  apellido: string
  nombre: string
  telefonoCelular: string
  direccion: string
  localidad: string
  fechaNacimiento: Date | null
  tipoMovilidad: TipoMovilidad | null
  torneosInteres: string[]
  disponibilidadHoraria: string[]
  tieneRelacionInstitucional: boolean | null
  institucion: string
}

type RegistroArbitroState = DatosRegistroArbitro & {
  paso: number
  setDni: (valor: string) => void
  setApellido: (valor: string) => void
  setNombre: (valor: string) => void
  setTelefonoCelular: (valor: string) => void
  setDireccion: (valor: string) => void
  setLocalidad: (valor: string) => void
  setFechaNacimiento: (valor: Date | null) => void
  setTipoMovilidad: (valor: TipoMovilidad) => void
  alternarTorneo: (valor: string) => void
  alternarFranja: (valor: string) => void
  setTieneRelacionInstitucional: (valor: boolean) => void
  setInstitucion: (valor: string) => void
  irAlPasoSiguiente: () => void
  irAlPasoAnterior: () => void
  resetear: () => void
  enviarRegistro: () => Promise<{ ok: boolean; error?: string }>
}

const inicial: DatosRegistroArbitro & { paso: number } = {
  paso: 1,
  dni: '',
  apellido: '',
  nombre: '',
  telefonoCelular: '',
  direccion: '',
  localidad: '',
  fechaNacimiento: null,
  tipoMovilidad: null,
  torneosInteres: [],
  disponibilidadHoraria: [],
  tieneRelacionInstitucional: null,
  institucion: '',
}

function alternar(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]
}

export type PayloadRegistroArbitro = {
  dni: string
  apellido: string
  nombre: string
  telefonoCelular: string
  direccion: string
  localidad: string
  fechaNacimiento: Date
  tipoMovilidad: TipoMovilidad
  torneosInteres: string[]
  disponibilidadHoraria: string[]
  tieneRelacionInstitucional: boolean
  institucion?: string
}

export function armarPayloadRegistroArbitro(
  estado: DatosRegistroArbitro
): PayloadRegistroArbitro | null {
  const { fechaNacimiento, tipoMovilidad, tieneRelacionInstitucional } = estado
  if (!fechaNacimiento || !tipoMovilidad || tieneRelacionInstitucional === null) return null
  return {
    dni: estado.dni,
    apellido: estado.apellido.trim(),
    nombre: estado.nombre.trim(),
    telefonoCelular: estado.telefonoCelular,
    direccion: estado.direccion.trim(),
    localidad: estado.localidad.trim(),
    fechaNacimiento,
    tipoMovilidad,
    torneosInteres: [...estado.torneosInteres],
    disponibilidadHoraria: [...estado.disponibilidadHoraria],
    tieneRelacionInstitucional,
    institucion: tieneRelacionInstitucional ? estado.institucion.trim() : undefined,
  }
}

/** Punto de enganche del alta. El test espía `enviar` para simular el fallo de red. */
export const envioRegistroArbitro = {
  enviar: async (datos: PayloadRegistroArbitro): Promise<void> => {
    void datos
  },
}

export const useRegistroArbitroStore = create<RegistroArbitroState>((set, get) => ({
  ...inicial,
  setDni: (dni) => set({ dni }),
  setApellido: (apellido) => set({ apellido }),
  setNombre: (nombre) => set({ nombre }),
  setTelefonoCelular: (telefonoCelular) => set({ telefonoCelular }),
  setDireccion: (direccion) => set({ direccion }),
  setLocalidad: (localidad) => set({ localidad }),
  setFechaNacimiento: (fechaNacimiento) => set({ fechaNacimiento }),
  setTipoMovilidad: (tipoMovilidad) => set({ tipoMovilidad }),
  alternarTorneo: (valor) => set({ torneosInteres: alternar(get().torneosInteres, valor) }),
  alternarFranja: (valor) =>
    set({ disponibilidadHoraria: alternar(get().disponibilidadHoraria, valor) }),
  setTieneRelacionInstitucional: (tieneRelacionInstitucional) =>
    set({ tieneRelacionInstitucional }),
  setInstitucion: (institucion) => set({ institucion }),
  irAlPasoSiguiente: () => set({ paso: Math.min(get().paso + 1, TOTAL_PASOS + 1) }),
  irAlPasoAnterior: () => set({ paso: Math.max(get().paso - 1, 1) }),
  resetear: () => set(inicial),
  enviarRegistro: async () => {
    const payload = armarPayloadRegistroArbitro(get())
    if (!payload) {
      return { ok: false, error: 'Faltan datos del formulario. Revisá los pasos anteriores.' }
    }
    try {
      await envioRegistroArbitro.enviar(payload)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: parseApiError(error) }
    }
  },
}))
