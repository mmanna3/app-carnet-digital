import { Client } from "./clients";
import { HttpClientWrapper } from "./http-client-wrapper";

const API_BASE_URL = "http://0.0.0.0:5072";
const httpClient = new HttpClientWrapper();
export const api = new Client(API_BASE_URL, httpClient);
