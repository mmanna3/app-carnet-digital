import { create } from 'zustand'
import { api } from '@/lib/api/api'
import {
  RegistroArbitroDTO,
  type FranjaHorariaArbitroEnum,
  type TipoMovilidadArbitroEnum,
} from '@/lib/api/clients'
import { parseApiError } from '@/logica-compartida/utilidades/parsear-error-api'

/** Pasos del formulario. El paso siguiente es la pantalla de completado. */
export const TOTAL_PASOS = 4

/** El back espera el celular completo; el formulario solo pide los 8 dígitos finales. */
export const PREFIJO_CELULAR = '+54911'

export type DatosRegistroArbitro = {
  dni: string
  apellido: string
  nombre: string
  telefonoCelular: string
  direccion: string
  localidad: string
  fechaNacimiento: Date | null
  tipoMovilidad: TipoMovilidadArbitroEnum | null
  torneoAgrupadorIds: number[]
  franjasHorarias: FranjaHorariaArbitroEnum[]
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
  setTipoMovilidad: (valor: TipoMovilidadArbitroEnum) => void
  alternarTorneo: (valor: number) => void
  alternarFranja: (valor: FranjaHorariaArbitroEnum) => void
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
  torneoAgrupadorIds: [],
  franjasHorarias: [],
  tieneRelacionInstitucional: null,
  institucion: '',
}

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]
}

export function armarPayloadRegistroArbitro(
  estado: DatosRegistroArbitro
): RegistroArbitroDTO | null {
  const { fechaNacimiento, tipoMovilidad, tieneRelacionInstitucional } = estado
  if (!fechaNacimiento || !tipoMovilidad || tieneRelacionInstitucional === null) return null
  return new RegistroArbitroDTO({
    dni: estado.dni,
    apellido: estado.apellido.trim(),
    nombre: estado.nombre.trim(),
    telefonoCelular: `${PREFIJO_CELULAR}${estado.telefonoCelular}`,
    direccion: estado.direccion.trim(),
    localidad: estado.localidad.trim(),
    fechaNacimiento,
    tipoMovilidad,
    torneoAgrupadorIds: [...estado.torneoAgrupadorIds],
    franjasHorarias: [...estado.franjasHorarias],
    tieneRelacionInstitucional,
    institucion: tieneRelacionInstitucional ? estado.institucion.trim() : undefined,
  })
}

/** Punto de enganche del alta. El test lo espía para simular fallos del back. */
export const envioRegistroArbitro = {
  enviar: async (datos: RegistroArbitroDTO): Promise<void> => {
    await api.registroArbitro(datos)
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
  alternarTorneo: (valor) => set({ torneoAgrupadorIds: alternar(get().torneoAgrupadorIds, valor) }),
  alternarFranja: (valor) => set({ franjasHorarias: alternar(get().franjasHorarias, valor) }),
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
