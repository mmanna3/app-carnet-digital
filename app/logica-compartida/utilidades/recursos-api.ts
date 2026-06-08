/** La API devuelve rutas relativas; Image y fetch necesitan URL absoluta. */
export function uriRecursoPublicoApi(
  apiUrl: string | undefined,
  ruta: string | undefined
): string | null {
  const r = (ruta ?? '').trim()
  if (!r) return null
  if (/^(https?:|data:)/i.test(r)) return r
  const base = apiUrl?.trim()
  if (!base) return null
  return `${base.replace(/\/+$/, '')}${r.startsWith('/') ? r : `/${r}`}`
}

export function textoOGuion(s: string | undefined): string {
  const t = (s ?? '').trim()
  return t.length > 0 ? t : '—'
}

export function numeroOGuion(n: number | undefined): string {
  return n != null && Number.isFinite(n) ? String(n) : '—'
}
