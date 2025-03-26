import { Client, LoginDTO, LoginResponseDTO, CambiarPasswordDTO } from './clients'
import { HttpClientWrapper } from './http-client-wrapper'
import { getEnvVars } from '../config/env'

const { apiUrl } = getEnvVars()

const httpClient = new HttpClientWrapper()
export const api = new Client(apiUrl, httpClient)
