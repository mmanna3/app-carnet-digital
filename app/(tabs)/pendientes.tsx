import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { CarnetDigitalPendienteDTO } from '../api/clients';
import { useEquipoStore } from '../hooks/use-equipo-store';
import Carnet from '../components/carnet';

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carnetesContainer}>
        {categorias.map((año) => (
          <View key={año}>
            <View style={styles.categoriaHeader}>
              <Text style={styles.categoriaTexto}>Categoría {año}</Text>
            </View>
            {jugadoresPorCategoria[año].map((jugador) => (
              <Carnet
                key={jugador.id}
                jugador={jugador}
                equipoNombre={equipoSeleccionadoNombre || undefined}
                mostrarEstado={true}
                mostrarMotivo={true}
              />
            ))}
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
}); 