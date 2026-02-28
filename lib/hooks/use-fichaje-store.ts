import { create } from 'zustand'
import { FicharEnOtroEquipoDTO, JugadorDTO } from '@/lib/api/clients'
import { api } from '@/lib/api/api'
import { getConfigLiga } from '@/lib/config/liga'

export type FlujoFichaje = 'intro' | 'nuevo' | 'yaFichado'

interface FichajeState {
  flujo: FlujoFichaje
  paso: number
  codigoEquipo: string
  nombre: string
  apellido: string
  dni: string
  fechaNac: Date | null
  fotoUri: string | null
  dniFrenteUri: string | null
  dniDorsoUri: string | null
  fotoBase64: string | null
  dniFrenteBase64: string | null
  dniDorsoBase64: string | null
  nombreEquipo: string | null
  esDelegado: boolean
  calcularTotalPasos: () => number
  irAIntro: () => void
  irANuevo: () => void
  irAYaFichado: () => void
  irAPaso: (paso: number) => void
  irAlPasoInicial: () => void
  irAlPasoSiguiente: () => void
  irAlPasoAnterior: () => void
  setCodigoEquipo: (v: string) => void
  setNombreEquipo: (v: string | null) => void
  setNombre: (v: string) => void
  setApellido: (v: string) => void
  setDni: (v: string) => void
  setEsDelegado: (v: boolean) => void,
  setFechaNac: (v: Date | null) => void
  setFotoUri: (v: string | null) => void
  setDniFrenteUri: (v: string | null) => void
  setDniDorsoUri: (v: string | null) => void
  setFotoBase64: (v: string | null) => void
  setDniFrenteBase64: (v: string | null) => void
  setDniDorsoBase64: (v: string | null) => void
  resetear: () => void
  reiniciarParaOtroJugador: () => void
  validarCodigoEquipo: () => Promise<{ ok: boolean; error?: string }>
  validarDniNuevo: () => Promise<{ ok: boolean; error?: string }>
  enviarFichajeNuevo: () => Promise<{ ok: boolean; error?: string }>
  enviarFichajeYaFichado: () => Promise<{ ok: boolean; error?: string }>
}

const inicial = {
  flujo: 'intro' as FlujoFichaje,
  paso: 1,
  codigoEquipo: '',
  esDelegado: false,
  nombre: '',
  apellido: '',
  dni: '',
  fechaNac: null,
  fotoUri: null,
  dniFrenteUri: null,
  dniDorsoUri: null,
  fotoBase64: null,
  dniFrenteBase64: null,
  dniDorsoBase64: null,
  nombreEquipo: null,

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

export const useFichajeStore = create<FichajeState>()((set, get) => ({
  ...inicial,
  irAIntro: () => set({ flujo: 'intro', paso: 1 }),
  irANuevo: () => set({ flujo: 'nuevo', paso: 1 }),
  irAYaFichado: () => set({ flujo: 'yaFichado', paso: 1 }),
  irAPaso: (paso) => {set({ paso })},
  irAlPasoSiguiente: () => {set({ paso: get().paso + 1 })},
  irAlPasoAnterior: () => {set({ paso: get().paso - 1 })},
  irAlPasoInicial: () => {set({ paso: 1 })},
  calcularTotalPasos: () => {
    const { esDelegado, flujo } = get()
    return esDelegado ? (flujo === 'nuevo' ? 4 : 2) : (flujo === 'nuevo' ? 5 : 3)
  },
  setCodigoEquipo: (v) => set({ codigoEquipo: v }),
  setNombreEquipo: (v) => set({ nombreEquipo: v }),
  setNombre: (v) => set({ nombre: v }),
  setApellido: (v) => set({ apellido: v }),
  setDni: (v) => set({ dni: v }),
  setFechaNac: (v) => set({ fechaNac: v }),
  setFotoUri: (v) => set({ fotoUri: v }),
  setDniFrenteUri: (v) => set({ dniFrenteUri: v }),
  setDniDorsoUri: (v) => set({ dniDorsoUri: v }),
  setFotoBase64: (v) => set({ fotoBase64: v }),
  setDniFrenteBase64: (v) => set({ dniFrenteBase64: v }),
  setDniDorsoBase64: (v) => set({ dniDorsoBase64: v }),
  setEsDelegado: (v) => set({ esDelegado: v }),
  resetear: () => set(inicial),
  reiniciarParaOtroJugador: () =>
    set({
      flujo: 'intro' as FlujoFichaje,
      paso: 1,
      nombre: '',
      apellido: '',
      dni: '',
      fechaNac: null,
      fotoUri: null,
      dniFrenteUri: null,
      dniDorsoUri: null,
      fotoBase64: null,
      dniFrenteBase64: null,
      dniDorsoBase64: null,
    }),

  validarCodigoEquipo: async () => {
    const { codigoEquipo } = get()
    const config = getConfigLiga()
    const apiUrl = config?.apiUrl ?? '(sin config)'
    const urlCompleta = `${apiUrl}/api/publico/obtener-nombre-equipo?codigoAlfanumerico=${encodeURIComponent(codigoEquipo)}`
    console.log('[E2E debug] Validar código → apiUrl:', apiUrl, '| URL completa:', urlCompleta)
    try {
      const res = await api.obtenerNombreEquipo(codigoEquipo)
      if (res.hayError) {
        return { ok: false, error: res.mensajeError ?? 'Código inválido' }
      }
      set({ nombreEquipo: res.respuesta ?? null })
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
        return { ok: false, error: 'Ya estás fichado en otro equipo. Usá el flujo "Ya estoy fichado".' }
      }
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  enviarFichajeNuevo: async () => {
    const { dni, nombre, apellido, fechaNac, codigoEquipo, fotoBase64, dniFrenteBase64, dniDorsoBase64 } = get()
    try {
      const dto = new JugadorDTO({
        dni,
        nombre,
        apellido,
        fechaNacimiento: fechaNac!,
        codigoAlfanumerico: codigoEquipo,
        fotoCarnet: fotoBase64 ? 'data:image/jpeg;base64,' + fotoBase64 : undefined,
        fotoDNIFrente: dniFrenteBase64 ? 'data:image/jpeg;base64,' + dniFrenteBase64 : undefined,
        fotoDNIDorso: dniDorsoBase64 ? 'data:image/jpeg;base64,' + dniDorsoBase64 : undefined,
      })
      await api.jugadorPOST(dto)
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },

  enviarFichajeYaFichado: async () => {
    const { dni, codigoEquipo } = get()
    try {
      const fichado = await api.elDniEstaFichado(dni)
      if (!fichado) {
        return { ok: false, error: 'No estás fichado en ningún equipo activo.' }
      }
      const dto = new FicharEnOtroEquipoDTO({ dni, codigoAlfanumerico: codigoEquipo })
      await api.ficharEnOtroEquipo(dto)
      return { ok: true }
    } catch (error: any) {
      return { ok: false, error: parseError(error) }
    }
  },
}))
