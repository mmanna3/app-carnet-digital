import { create } from 'zustand'

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
  irAIntro: () => void
  irANuevo: () => void
  irAYaFichado: () => void
  irAPaso: (paso: number) => void
  setCodigoEquipo: (v: string) => void
  setNombre: (v: string) => void
  setApellido: (v: string) => void
  setDni: (v: string) => void
  setFechaNac: (v: Date | null) => void
  setFotoUri: (v: string | null) => void
  setDniFrenteUri: (v: string | null) => void
  setDniDorsoUri: (v: string | null) => void
  resetear: () => void
}

const inicial = {
  flujo: 'intro' as FlujoFichaje,
  paso: 1,
  codigoEquipo: '',
  nombre: '',
  apellido: '',
  dni: '',
  fechaNac: null,
  fotoUri: null,
  dniFrenteUri: null,
  dniDorsoUri: null,
}

export const useFichajeStore = create<FichajeState>()((set) => ({
  ...inicial,
  irAIntro: () => set({ flujo: 'intro', paso: 1 }),
  irANuevo: () => set({ flujo: 'nuevo', paso: 1 }),
  irAYaFichado: () => set({ flujo: 'yaFichado', paso: 1 }),
  irAPaso: (paso) => set({ paso }),
  setCodigoEquipo: (v) => set({ codigoEquipo: v }),
  setNombre: (v) => set({ nombre: v }),
  setApellido: (v) => set({ apellido: v }),
  setDni: (v) => set({ dni: v }),
  setFechaNac: (v) => set({ fechaNac: v }),
  setFotoUri: (v) => set({ fotoUri: v }),
  setDniFrenteUri: (v) => set({ dniFrenteUri: v }),
  setDniDorsoUri: (v) => set({ dniDorsoUri: v }),
  resetear: () => set(inicial),
}))
