import { ApiException } from '@/app/api/clients'

/**
 * Extrae un mensaje legible de un error de la API.
 * Soporta ApiException (NSwag) con response JSON (ProblemDetails de ASP.NET).
 */
export function parseApiError(error: unknown): string {
  if (ApiException.isApiException(error)) {
    const { response, message } = error
    if (response && typeof response === 'string') {
      try {
        const parsed = JSON.parse(response) as { title?: string; detail?: string }
        return parsed.title ?? parsed.detail ?? message
      } catch {
        return message || 'Hubo un error conectándose al servidor'
      }
    }
    return message || 'Hubo un error conectándose al servidor'
  }
  if (error instanceof Error) {
    return error.message || 'Hubo un error inesperado'
  }
  return 'Hubo un error inesperado'
}
