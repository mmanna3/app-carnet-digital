export enum EstadoJugador {
  FichajePendienteDeAprobacion = 1,
  FichajeRechazado = 2,
  Activo = 3,
  Suspendido = 4,
  Inhabilitado = 5,
  AprobadoPendienteDePago = 6
}

export default EstadoJugador;

export function obtenerTextoEstado(estado: EstadoJugador): string {
  switch (estado) {
    case EstadoJugador.FichajePendienteDeAprobacion:
      return 'PENDIENTE DE APROBACIÓN';
    case EstadoJugador.FichajeRechazado:
      return 'FICHAJE RECHAZADO';
    case EstadoJugador.Activo:
      return 'ACTIVO';
    case EstadoJugador.Suspendido:
      return 'CARNET SUSPENDIDO';
    case EstadoJugador.Inhabilitado:
      return 'INHABILITADO';
    case EstadoJugador.AprobadoPendienteDePago:
      return 'PENDIENTE DE PAGO';
    default:
      return 'DESCONOCIDO';
  }
}

export function obtenerColorEstado(estado: EstadoJugador): string {
  switch (estado) {
    case EstadoJugador.FichajePendienteDeAprobacion:
      return '#FFA726'; // Naranja
    case EstadoJugador.FichajeRechazado:
      return '#EF5350'; // Rojo
    case EstadoJugador.Activo:
      return '#66BB6A'; // Verde
    case EstadoJugador.Suspendido:
      return '#FF7043'; // Naranja oscuro
    case EstadoJugador.Inhabilitado:
      return '#E53935'; // Rojo oscuro
    case EstadoJugador.AprobadoPendienteDePago:
      return '#2513c2'; // Azul
    default:
      return '#9E9E9E'; // Gris
  }
} 