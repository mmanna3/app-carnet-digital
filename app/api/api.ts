import { Client, LoginDTO, LoginResponseDTO, CambiarPasswordDTO } from './clients'
import { HttpClientWrapper } from './http-client-wrapper'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.193:5072'

const httpClient = new HttpClientWrapper()
export const api = new Client(API_BASE_URL, httpClient)
