import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LoginDTO, LoginResponseDTO } from '../api/clients'
import { api } from '../api/api'

interface AuthState {
  usuario: string | null
  token: string | null
  isAuthenticated: boolean
  login: (usuario: string, password: string) => Promise<LoginResponseDTO>
  logout: () => void
  setAuthState: (token: string, usuario: string) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      login: async (usuario: string, password: string) => {
        try {
          const loginRequest = new LoginDTO({
            usuario,
            password
          })
          const response = await api.login(loginRequest)
      
          if (response.exito) {
            set({ token: response.token, usuario: usuario, isAuthenticated: true })
          }
      
          return response
        } catch (error: any) {
          return new LoginResponseDTO({ error: JSON.parse(error.response).error || 'Hubo un error conectándose al servidor'})
        }
      },
      logout: () => {
        set({ token: null, isAuthenticated: false })
      },
      setAuthState: (token: string, usuario: string) => {
        set({ token, usuario, isAuthenticated: true })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
