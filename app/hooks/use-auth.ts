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
      
          if (response.exito && response.token) {
            set({ token: response.token, usuario: usuario, isAuthenticated: true })
            return response
          }
      
          return new LoginResponseDTO({ 
            exito: false, 
            error: response.error || 'Error de autenticación' 
          })
        } catch (error: any) {
          const errorMessage = error.response 
            ? JSON.parse(error.response).error 
            : 'Hubo un error conectándose al servidor'
          return new LoginResponseDTO({ 
            exito: false, 
            error: errorMessage 
          })
        }
      },
      logout: () => {
        set({ token: null, usuario: null, isAuthenticated: false })
      },
      setAuthState: (token: string, usuario: string) => {
        if (!token || !usuario) {
          set({ token: null, usuario: null, isAuthenticated: false })
          return
        }
        set({ token, usuario, isAuthenticated: true })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuth;
