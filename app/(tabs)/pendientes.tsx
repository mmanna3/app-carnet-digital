import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { CarnetDigitalPendienteDTO } from '../api/clients';
import { useEquipoStore } from '../hooks/use-equipo-store';
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador';

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

  const obtenerCategoria = (fechaNacimiento: Date) => {
    const año = new Date(fechaNacimiento).getFullYear().toString();
    return año.slice(-2);
  };

  const obtenerAñoCompleto = (fechaNacimiento: Date) => {
    return new Date(fechaNacimiento).getFullYear();
  };

  // Agrupar jugadores por categoría
  const jugadoresPorCategoria = jugadores.reduce((acc, jugador) => {
    const año = obtenerAñoCompleto(jugador.fechaNacimiento);
    if (!acc[año]) {
      acc[año] = [];
    }
    acc[año].push(jugador);
    return acc;
  }, {} as Record<number, CarnetDigitalPendienteDTO[]>);

  // Ordenar las categorías de menor a mayor (más viejos primero)
  const categorias = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b);

  const renderCarnet = (jugador: CarnetDigitalPendienteDTO) => {
    const estado = jugador.estado as EstadoJugador;

    return (
      <View key={jugador.id} style={styles.carnet}>
        <View style={[styles.carnetHeader, { backgroundColor: obtenerColorEstado(estado) }]}>
          <Text style={styles.estado}>
            {obtenerTextoEstado(estado)}
          </Text>
        </View>
        <View style={styles.carnetBody}>
          <Text style={styles.equipo}>{equipoSeleccionadoNombre}</Text>
          <Text style={styles.torneo}>{jugador.torneo}</Text>
          {jugador.fotoCarnet && (
            <View style={styles.fotoContainer}>
              <Image 
                source={{ uri: jugador.fotoCarnet }} 
                style={styles.foto}
                resizeMode="cover"
              />
            </View>
          )}
          <Text style={styles.dato}>{jugador.dni}</Text>
          <Text style={styles.dato}>{jugador.nombre}</Text>
          <Text style={styles.dato}>{jugador.apellido}</Text>
          <Text style={styles.dato}>
            {new Date(jugador.fechaNacimiento).toLocaleDateString('es-AR')}
          </Text>
          <Text style={styles.categoria}>Cat {obtenerCategoria(jugador.fechaNacimiento)}</Text>
          {jugador.motivo && (
            <View style={styles.motivoContainer}>
              <Text style={styles.motivoTitulo}>Motivo:</Text>
              <Text style={styles.motivoTexto}>{jugador.motivo}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carnetesContainer}>
        {categorias.map((año) => (
          <View key={año}>
            <View style={styles.categoriaHeader}>
              <Text style={styles.categoriaTexto}>Categoría {año}</Text>
            </View>
            {jugadoresPorCategoria[año].map(renderCarnet)}
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
  categoriaHeader: {
    backgroundColor: '#2196F3',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriaTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    alignItems: 'center',
  },
  equipo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333333',
  },
  torneo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  fotoContainer: {
    marginVertical: 12,
    width: 200,
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  dato: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'center',
  },
  categoria: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  motivoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  motivoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  motivoTexto: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 