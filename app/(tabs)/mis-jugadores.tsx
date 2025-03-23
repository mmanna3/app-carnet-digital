import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { CarnetDigitalDTO } from '../api/clients';
import { useEquipoStore } from '../hooks/use-equipo-store';

export default function MisJugadoresScreen() {
  const { equipoSeleccionadoId } = useEquipoStore();
  
  const { data: jugadores, isLoading, isError } = useApiQuery({
    key: ['carnets', equipoSeleccionadoId],
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado');
      return await api.carnets(equipoSeleccionadoId);
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
    return <Text style={styles.mensaje}>Cargando jugadores...</Text>;
  }

  if (isError || !jugadores) {
    return <Text style={styles.mensaje}>Error al cargar los jugadores.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carnetesContainer}>
        {jugadores.map((jugador) => (
          <View key={jugador.id} style={styles.carnet}>
            <View style={styles.carnetHeader}>
              <Text style={styles.estado}>
                {jugador.estado === 1 ? 'ACTIVO' : 
                 jugador.estado === 2 ? 'PENDIENTE' :
                 jugador.estado === 3 ? 'RECHAZADO' :
                 jugador.estado === 4 ? 'INHABILITADO' :
                 jugador.estado === 5 ? 'SUSPENDIDO' :
                 jugador.estado === 6 ? 'FICHAJE NO PAGO' : 'DESCONOCIDO'}
              </Text>
            </View>
            <View style={styles.carnetBody}>
              <Text style={styles.nombre}>{jugador.nombre} {jugador.apellido}</Text>
              <Text style={styles.info}>DNI: {jugador.dni}</Text>
              <Text style={styles.info}>
                Fecha Nac.: {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
              </Text>
              {jugador.fotoCarnet && (
                <View style={styles.fotoContainer}>
                  <Text style={styles.fotoLabel}>Foto Carnet</Text>
                  <Image 
                    source={{ uri: jugador.fotoCarnet }} 
                    style={styles.foto}
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </View>
        ))}
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
  carnet: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carnetHeader: {
    backgroundColor: '#2196F3',
    padding: 12,
  },
  estado: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carnetBody: {
    padding: 16,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  fotoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  fotoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  foto: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
}); 