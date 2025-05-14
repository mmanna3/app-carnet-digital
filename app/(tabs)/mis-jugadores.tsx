import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import useApiQuery from '../api/custom-hooks/use-api-query';
import { api } from '../api/api';
import { CarnetDigitalDTO } from '../api/clients';
import { useEquipoStore } from '../hooks/use-equipo-store';
import { useAuth } from '../hooks/use-auth';
import Carnet from '../components/carnet';

export default function MisJugadoresScreen() {
  const { equipoSeleccionadoId } = useEquipoStore();
  const { isAuthenticated } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [categoryPositions, setCategoryPositions] = useState<Record<number, number>>({});
  
  const { data: jugadores, isLoading, isError } = useApiQuery({
    key: ['carnets', equipoSeleccionadoId],
    fn: async () => {
      if (!equipoSeleccionadoId) throw new Error('No hay equipo seleccionado');
      return await api.carnets(equipoSeleccionadoId);
    },
    transformarResultado: (resultado) => resultado,
    activado: !!equipoSeleccionadoId && isAuthenticated
  });

  if (!isAuthenticated) {
    return null;
  }

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
  }, {} as Record<number, CarnetDigitalDTO[]>);

  // Ordenar las categorías de menor a mayor (más viejos primero)
  const categorias = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b);

  const scrollToCategory = (año: number) => {
    const position = categoryPositions[año];
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true });
    }
  };

  const handleCategoryLayout = (año: number, event: any) => {
    const { y } = event.nativeEvent.layout;
    setCategoryPositions(prev => ({
      ...prev,
      [año]: y
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryButtonsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryButtonsContent}
        >
          {categorias.map((año) => (
            <TouchableOpacity
              key={`button-${año}`}
              style={styles.categoryButton}
              onPress={() => scrollToCategory(año)}
            >
              <Text style={styles.categoryButtonText}>{año}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollView}
      >
        <View style={styles.carnetesContainer}>
          {categorias.map((año) => (
            <View 
              key={año}
              onLayout={(event) => handleCategoryLayout(año, event)}
            >
              <View style={styles.categoriaHeader}>
                <Text style={styles.categoriaTexto}>Categoría {año}</Text>
              </View>
              {jugadoresPorCategoria[año].map((jugador) => (
                <Carnet
                  key={jugador.id}
                  jugador={jugador}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  categoryButtonsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1,
  },
  categoryButtonsContent: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
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
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
}); 