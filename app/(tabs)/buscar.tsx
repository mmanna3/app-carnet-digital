import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from 'react-native';
import { api } from '../api/api';
import { CarnetDigitalDTO } from '../api/clients';
import { EstadoJugador, obtenerTextoEstado, obtenerColorEstado } from '../types/estado-jugador';
import Boton from '@/components/boton';

export default function BuscarScreen() {
  const [codigoEquipo, setCodigoEquipo] = useState('');
  const [jugadores, setJugadores] = useState<CarnetDigitalDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarJugadores = async () => {
    if (!codigoEquipo.trim()) {
      setError('Ingresá un código de equipo');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const resultado = await api.carnetsPorCodigoAlfanumerico(codigoEquipo.trim());
      setJugadores(resultado);
      if (resultado.length === 0) {
        setError('No se encontraron jugadores para este equipo');
      }
    } catch (err) {
      setError('Error al buscar jugadores. Verificá el código e intentá nuevamente.');
      setJugadores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerCategoria = (fechaNacimiento: Date) => {
    const año = new Date(fechaNacimiento).getFullYear().toString();
    return año.slice(-2);
  };

  const obtenerAñoCompleto = (fechaNacimiento: Date) => {
    return new Date(fechaNacimiento).getFullYear();
  };

  const mostrarEstado = (estado: EstadoJugador) => {
    return estado === EstadoJugador.Inhabilitado || estado === EstadoJugador.Suspendido;
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

  const renderCarnet = (jugador: CarnetDigitalDTO) => {
    const estado = jugador.estado as EstadoJugador;
    const debesMostrarEstado = mostrarEstado(estado);

    return (
      <View key={jugador.id} style={styles.carnet}>
        {debesMostrarEstado && (
          <View style={[styles.carnetHeader, { backgroundColor: obtenerColorEstado(estado) }]}>
            <Text style={styles.estado}>
              {obtenerTextoEstado(estado)}
            </Text>
          </View>
        )}
        <View style={styles.carnetBody}>
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
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.titulo}>Ingresá el código del equipo</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor='#999'
          placeholder="Ej: ABC1234"
          value={codigoEquipo}
          onChangeText={setCodigoEquipo}
          autoCapitalize="characters"
          maxLength={7}
        />
        <Boton 
          texto={isLoading ? "Buscando..." : "Ver jugadores"}
          onPress={buscarJugadores}
          deshabilitado={isLoading}
          cargando={isLoading}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      {jugadores.length > 0 && (
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
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: '#e53935',
    marginTop: 12,
    textAlign: 'center',
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
}); 