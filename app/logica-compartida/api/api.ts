import { Client } from './clients'
import { HttpClientWrapper } from './http-client-wrapper'
import { getConfigLiga } from '../config/liga'
import { useAuth } from '../hooks/use-auth'

const httpClient = new HttpClientWrapper(
  () => useAuth.getState().token,
  () => {
    useAuth.getState().logout()
  }
)

let cached: { leagueId: string; client: Client } | null = null

function getApi(): Client {
  const config = getConfigLiga()
  if (!config?.apiUrl) {
    throw new Error('Config de liga no disponible. En MULTILIGA, seleccioná una liga primero.')
  }
  if (cached?.leagueId === config.leagueId) return cached.client
  const client = new Client(config.apiUrl, httpClient)
  cached = { leagueId: config.leagueId, client }
  return client
}

export const api = new Proxy({} as Client, {
  get(_, prop) {
    return (getApi() as unknown as Record<string, unknown>)[prop as string]
  },
})
