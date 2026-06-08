import { create } from 'zustand'
import { DelegadoDTO, FicharDelegadoSoloConDniYClubDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'

export type FlujoDelegado = 'intro' | 'azul' | 'verde'

interface FichajeDelegadoState {
  flujo: FlujoDelegado
  paso: number
  codigoEquipo: string
  nombreClub: string | null
  clubId: number | null
  nombre: string
  apellido: string
  dni: string
  fechaNac: Date | null
  email: string
  celular: string
  fotoUri: string | null
  fotoBase64: string | null
  dniFrenteUri: string | null
  dniDorsoUri: string | null
  dniFrenteBase64: string | null
  dniDorsoBase64: string | null
  nombreUsuario: string | null

  irAIntro: () => void
  irAAzul: () => void
  irAVerde: () => void
  irAlPasoSiguiente: () => void
  irAlPasoAnterior: () => void
  calcularTotalPasos: () => number
  resetear: () => void

  setCodigoEquipo: (v: string) => void
  setNombre: (v: string) => void
  setApellido: (v: string) => void
  setDni: (v: string) => void
  setFechaNac: (v: Date | null) => void
  setEmail: (v: string) => void
  setCelular: (v: string) => void
  setFotoUri: (v: string | null) => void
  setFotoBase64: (v: string | null) => void
  setDniFrenteUri: (v: string | null) => void
  setDniDorsoUri: (v: string | null) => void
  setDniFrenteBase64: (v: string | null) => void
  setDniDorsoBase64: (v: string | null) => void

  validarCodigoClub: () => Promise<{ ok: boolean; error?: string }>
  validarDniNuevo: () => Promise<{ ok: boolean; error?: string }>
  validarDniVerde: () => Promise<{ ok: boolean; error?: string }>
  obtenerNombreUsuario: () => Promise<{ ok: boolean; error?: string }>
  obtenerNombreUsuarioVerde: () => Promise<{ ok: boolean; error?: string }>
  enviarNuevoDelegado: () => Promise<{ ok: boolean; error?: string }>
  enviarDelegadoYaRegistrado: () => Promise<{ ok: boolean; error?: string }>
}

const inicial = {
  flujo: 'intro' as FlujoDelegado,
  paso: 1,
  codigoEquipo: '',
  nombreClub: null,
  clubId: null,
  nombre: '',
  apellido: '',
  dni: '',
  fechaNac: null,
  email: '',
  celular: '',
  fotoUri: null,
  fotoBase64: null,
  dniFrenteUri: null,
  dniDorsoUri: null,
  dniFrenteBase64: null,
  dniDorsoBase64: null,
  nombreUsuario: null,
}

const parseError = (error: any): string => {
  if (error?.response) {
    try {
      return JSON.parse(error.response).title ?? 'Hubo un error conectándose al servidor'
    } catch {
      return 'Hubo un error conectándose al servidor'
    }
  }
  return 'Hubo un error conectándose al servidor'
}

export const useFichajeDelegadoStore = create<FichajeDelegadoState>()((set, get) => ({
  ...inicial,

  irAIntro: () => set({ flujo: 'intro', paso: 1 }),
  irAAzul: () => set({ flujo: 'azul', paso: 1 }),
  irAVerde: () => set({ flujo: 'verde', paso: 1 }),
  irAlPasoSiguiente: () => set({ paso: get().paso + 1 }),
  irAlPasoAnterior: () => set({ paso: get().paso - 1 }),
  calcularTotalPasos: () => (get().flujo === 'azul' ? 5 : 3),
  resetear: () => set(inicial),

  setCodigoEquipo: (v) => set({ codigoEquipo: v }),
  setNombre: (v) => set({ nombre: v }),
  setApellido: (v) => set({ apellido: v }),
  setDni: (v) => set({ dni: v }),
  setFechaNac: (v) => set({ fechaNac: v }),
  setEmail: (v) => set({ email: v }),
  setCelular: (v) => set({ celular: v }),
  setFotoUri: (v) => set({ fotoUri: v }),
  setFotoBase64: (v) => set({ fotoBase64: v }),
  setDniFrenteUri: (v) => set({ dniFrenteUri: v }),
  setDniDorsoUri: (v) => set({ dniDorsoUri: v }),
  setDniFrenteBase64: (v) => set({ dniFrenteBase64: v }),
  setDniDorsoBase64: (v) => set({ dniDorsoBase64: v }),

  validarCodigoClub: async () => {
    const { codigoEquipo } = get()
    try {
      const res = await api.obtenerClub(codigoEquipo)
      if (res.hayError) {
        return { ok: false, error: res.mensajeError ?? 'Código inválido' }
      }
      set({ nombreClub: res.clubNombre ?? null, clubId: res.clubId ?? null })
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  validarDniNuevo: async () => {
    const { dni } = get()
    try {
      const fichado = await api.elDniEstaFichado(dni)
      if (fichado) {
        return {
          ok: false,
          error: 'Ya estás fichado en la liga. Usá el flujo "Ya estoy registrado".',
        }
      }
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  validarDniVerde: async () => {
    const { dni } = get()
    try {
      const fichado = await api.elDniEstaFichado(dni)
      if (!fichado) {
        return { ok: false, error: 'No encontramos tu DNI en la liga. Usá el flujo "Primera vez".' }
      }
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  obtenerNombreUsuario: async () => {
    const { nombre, apellido } = get()
    try {
      const nombreUsuario = await api.obtenerNombreUsuarioDisponible(nombre, apellido)
      set({ nombreUsuario })
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  obtenerNombreUsuarioVerde: async () => {
    const { dni } = get()
    try {
      const res = await api.obtenerNombreUsuarioPorDni(dni)
      if (res.hayError) {
        return { ok: false, error: res.mensajeError ?? 'No se pudo obtener el nombre de usuario' }
      }
      set({ nombreUsuario: res.nombreUsuario ?? null })
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  enviarNuevoDelegado: async () => {
    const {
      dni,
      nombre,
      apellido,
      fechaNac,
      clubId,
      email,
      celular,
      fotoBase64,
      dniFrenteBase64,
      dniDorsoBase64,
    } = get()
    if (!clubId || !fechaNac) {
      return { ok: false, error: 'Faltan datos del club o fecha de nacimiento' }
    }
    try {
      const dto = new DelegadoDTO({
        dni,
        nombre,
        apellido,
        fechaNacimiento: fechaNac,
        email,
        telefonoCelular: celular,
        clubIds: clubId ? [clubId] : undefined,
        fotoCarnet: 'data:image/jpeg;base64,' + (fotoBase64 ?? ''),
        fotoDNIFrente: 'data:image/jpeg;base64,' + (dniFrenteBase64 ?? ''),
        fotoDNIDorso: 'data:image/jpeg;base64,' + (dniDorsoBase64 ?? ''),
      })
      await api.delegadoPOST(dto)
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  enviarDelegadoYaRegistrado: async () => {
    const { dni, clubId } = get()
    if (!clubId) {
      return { ok: false, error: 'Faltan datos del club. Validá el código primero.' }
    }
    try {
      const dto = new FicharDelegadoSoloConDniYClubDTO({ dni, clubId })
      await api.ficharDelegadoSoloConDniYClub(dto)
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },
}))
