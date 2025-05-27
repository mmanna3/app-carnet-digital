import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { api } from '../api/api';
import { CarnetDigitalDTO } from '@/app/api/clients';
import Boton from '@/components/boton';
import Carnet from '../components/carnet';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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

  const generatePDF = async () => {
    if (jugadores.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      const fechaGeneracion = new Date().toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Ordenar jugadores por fecha de nacimiento (más viejos primero)
      const jugadoresOrdenados = [...jugadores].sort((a, b) => 
        new Date(a.fechaNacimiento).getTime() - new Date(b.fechaNacimiento).getTime()
      );

      // Dividir jugadores en grupos de 9 (3x3 por página)
      const jugadoresPorPagina = [];
      for (let i = 0; i < jugadoresOrdenados.length; i += 9) {
        jugadoresPorPagina.push(jugadoresOrdenados.slice(i, i + 9));
      }

      // Función para generar el HTML de un carnet
      const generarCarnetHTML = (jugador: CarnetDigitalDTO) => `
        <div class="carnet">
          <div class="carnet-header">
            <h3>${jugador.nombre} ${jugador.apellido}</h3>
          </div>
          <div class="carnet-body">
            <img src="${jugador.fotoCarnet || 'https://via.placeholder.com/100'}" />
            <div class="carnet-info">
              <p class="dni">DNI: ${jugador.dni}</p>
              <p>Fecha Nacimiento: ${new Date(jugador.fechaNacimiento).toLocaleDateString()}</p>
              <p class="categoria">Categoría: ${new Date(jugador.fechaNacimiento).getFullYear()}</p>
            </div>
          </div>
        </div>
      `;

      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              @page {
                size: letter;
                margin: 0;
              }
              body { 
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: #f5f5f5;
              }
              .page {
                page-break-after: always;
                padding: 20px;
                min-height: 100vh;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
              }
              .header {
                text-align: center;
                padding: 20px;
                background-color: #2196F3;
                color: white;
                margin-bottom: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .header p {
                margin: 5px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
              }
              .carnet-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                padding: 20px;
                height: calc(100vh - 120px);
              }
              .carnet {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                height: 200px;
                position: relative;
              }
              .carnet-header {
                background: linear-gradient(135deg, #2196F3, #1976D2);
                padding: 8px;
                text-align: center;
                color: white;
              }
              .carnet-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
              }
              .carnet-body {
                padding: 10px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: white;
              }
              .carnet img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                margin-bottom: 8px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .carnet-info {
                text-align: center;
                width: 100%;
                padding: 0 5px;
              }
              .carnet-info p {
                margin: 2px 0;
                font-size: 11px;
                color: #666;
                line-height: 1.3;
              }
              .carnet-info .dni {
                font-weight: bold;
                color: #333;
                margin-top: 3px;
                font-size: 12px;
              }
              .carnet-info .categoria {
                color: #2196F3;
                font-weight: bold;
                margin-top: 3px;
                font-size: 12px;
              }
              .carnet::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 12px;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
                pointer-events: none;
              }
            </style>
          </head>
          <body>
            ${jugadoresPorPagina.map((pagina, index) => `
              <div class="page">
                ${index === 0 ? `
                  <div class="header">
                    <h1>${jugadores[0]?.equipo || 'Equipo'}</h1>
                    <p>Generado el ${fechaGeneracion}</p>
                  </div>
                ` : ''}
                <div class="carnet-grid">
                  ${pagina.map(jugador => generarCarnetHTML(jugador)).join('')}
                </div>
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        width: 612, // US Letter width in points
        height: 792, // US Letter height in points
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Carnets ${codigoEquipo}`,
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert(
          'PDF Generado',
          `El PDF se ha guardado en: ${uri}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
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
                onPress={generatePDF}
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