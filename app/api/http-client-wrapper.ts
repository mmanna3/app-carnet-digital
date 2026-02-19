import { useAuth } from "../hooks/use-auth"
import { router } from "expo-router"


export class HttpClientWrapper {
  private publicRoutes = ['/api/Auth/login', '/api/Publico']

  constructor() {}

  async fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
    const token = useAuth.getState().token
    const isPublicRoute = this.isPublicRoute(url.toString())

    if (token && !isPublicRoute) {
      if (!init) {
        init = {}
      }
      if (!init.headers) {
        init.headers = {}
      }

      const headers =
        init.headers instanceof Headers
          ? Object.fromEntries(init.headers.entries())
          : (init.headers as Record<string, string>)

      init.headers = {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    }

    const response = await fetch(url, init)
    
    // Manejar token expirado
    if (response.status === 401 && !isPublicRoute) {
      useAuth.getState().logout()
      router.replace('/(auth)/login')
    }

    return response
  }

  private isPublicRoute(url: string): boolean {
    return this.publicRoutes.some((route) => url.includes(route))
  }
}
