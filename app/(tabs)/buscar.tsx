import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { api } from '../api/api';
import { CarnetDigitalDTO } from '@/app/api/clients';
import Boton from '@/components/boton';
import Carnet from '../components/carnet';
import { generatePDF } from '../utils/pdfGenerator';

export default function BuscarScreen() {
  const [codigoEquipo, setCodigoEquipo] = useState('');
  const [jugadores, setJugadores] = useState<CarnetDigitalDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [categoryPositions, setCategoryPositions] = useState<Record<number, number>>({});

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

  const handleGeneratePDF = async () => {
    if (jugadores.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      await generatePDF(jugadores, codigoEquipo);
    } catch (error) {
      console.error('Error in handleGeneratePDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <View style={styles.container}>
      {jugadores.length > 0 && (
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
      )}
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollView}
      >
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
          {jugadores.length > 0 && (
            <View style={styles.pdfButtonContainer}>
              <Boton 
                texto={isGeneratingPDF ? "Generando PDF..." : "Generar PDF"}
                onPress={handleGeneratePDF}
                deshabilitado={isGeneratingPDF}
                cargando={isGeneratingPDF}
              />
            </View>
          )}
        </View>

        {jugadores.length > 0 && (
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
        )}
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
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  categoriaTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pdfButtonContainer: {
    marginTop: 10,
  },
}); 