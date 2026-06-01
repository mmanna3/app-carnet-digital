/** Valor solo disponible en cliente (mobile). */
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return client
}
