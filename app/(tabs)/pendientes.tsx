import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { CarnetDigitalPendienteDTO } from '../api/clients';
import { useEquipoStore } from '../hooks/use-equipo-store';
import Carnet from '../components/carnet';
import { EstadoJugador } from '../types/estado-jugador';

export default function PendientesScreen() {
  const { equipoSeleccionadoId, equipoSeleccionadoNombre } = useEquipoStore();
  
  const { data: jugadores, isLoading, isError } = useApiQuery({
    key: ['jugadores-pendientes', equipoSeleccionadoId],
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado');
      return await api.jugadoresPendientes(equipoSeleccionadoId);
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId
  });

  if (!equipoSeleccionadoId) {
    return (
      <View style={styles.container}>
        <Text style={styles.mensaje}>Debes seleccionar un equipo primero</Text>
      </View>
    );
  }

  if (isLoading) {
    return <Text style={styles.mensaje}>Cargando jugadores pendientes...</Text>;
  }

  if (isError || !jugadores) {
    return <Text style={styles.mensaje}>Error al cargar los jugadores pendientes.</Text>;
  }

  // Separar jugadores por estado
  const jugadoresRechazados = jugadores.filter(j => j.estado === EstadoJugador.FichajeRechazado);
  const jugadoresPendientes = jugadores.filter(j => j.estado === EstadoJugador.FichajePendienteDeAprobacion);
  const jugadoresAprobadosPendientesDePago = jugadores.filter(j => j.estado === EstadoJugador.AprobadoPendienteDePago);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carnetesContainer}>
        {jugadoresRechazados.length > 0 && (
          <View>
            <View style={[styles.estadoHeader, { backgroundColor: '#EF5350' }]}>
              <Text style={styles.estadoTexto}>Fichajes Rechazados</Text>
            </View>
            {jugadoresRechazados.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={true}
              />
            ))}
          </View>
        )}

        {jugadoresAprobadosPendientesDePago.length > 0 && (
          <View>
            <View style={[styles.estadoHeader, { backgroundColor: '#2513c2' }]}>
              <Text style={styles.estadoTexto}>Pendientes de Pago</Text>
            </View>
            {jugadoresAprobadosPendientesDePago.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={false}
              />
            ))}
          </View>
        )}


        {jugadoresPendientes.length > 0 && (
          <View>
            <View style={[styles.estadoHeader, { backgroundColor: '#FFA726' }]}>
              <Text style={styles.estadoTexto}>Pendientes de Aprobación</Text>
            </View>
            {jugadoresPendientes.map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                mostrarEstado={true}
                mostrarMotivo={true}
              />
            ))}
          </View>
        )}

        {jugadoresRechazados.length === 0 
          && jugadoresPendientes.length === 0 
          && jugadoresAprobadosPendientesDePago.length === 0 
          && (
          <Text style={styles.mensaje}>No hay jugadores pendientes</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  carnetesContainer: {
    padding: 10,
  },
  estadoHeader: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  estadoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 