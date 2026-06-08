export function formatearFecha(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/** Primera letra en mayúscula, resto en minúscula (por palabra) */
export function capitalizar(s: string): string {
  return s
    .slice(0, 14)
    .split(' ')
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : ''))
    .join(' ')
}
