import React, { useState, useRef } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Boton from '@/components/boton'
import Carnet from '../components/carnet'
import { generatePDF } from '@/lib/utils/pdfGenerator'

export default function BuscarScreen() {
  const [codigoEquipo, setCodigoEquipo] = useState('')
  const [jugadores, setJugadores] = useState<CarnetDigitalDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number, number>>({})

  const buscarJugadores = async () => {
    if (!codigoEquipo.trim()) {
      setError('Ingresá un código de equipo')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const resultado = await api.carnetsPorCodigoAlfanumerico(codigoEquipo.trim())
      setJugadores(resultado)
      if (resultado.length === 0) {
        setError('No se encontraron jugadores para este equipo')
      }
    } catch (err) {
      setError(parseApiError(err))
      setJugadores([])
    } finally {
      setIsLoading(false)
    }
  }

  const obtenerAñoCompleto = (fechaNacimiento: Date) => {
    return new Date(fechaNacimiento).getFullYear()
  }

  const jugadoresPorCategoria = jugadores.reduce(
    (acc, jugador) => {
      const año = obtenerAñoCompleto(jugador.fechaNacimiento)
      if (!acc[año]) {
        acc[año] = []
      }
      acc[año].push(jugador)
      return acc
    },
    {} as Record<number, CarnetDigitalDTO[]>
  )

  const categorias = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b)

  const scrollToCategory = (año: number) => {
    const position = categoryPositions[año]
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  const handleCategoryLayout = (año: number, event: any) => {
    const { y } = event.nativeEvent.layout
    setCategoryPositions((prev) => ({
      ...prev,
      [año]: y,
    }))
  }

  const handleGeneratePDF = async () => {
    if (jugadores.length === 0) return

    setIsGeneratingPDF(true)
    try {
      await generatePDF(jugadores, codigoEquipo)
    } catch (error) {
      console.error('Error in handleGeneratePDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <View className="flex-1 bg-[#f8f8f8]">
      {jugadores.length > 0 && (
        <View className="bg-white py-2.5 border-b border-gray-200 z-[1]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {categorias.map((año) => (
              <TouchableOpacity
                key={`button-${año}`}
                className="bg-liga-600 px-5 py-2 rounded-full mx-1.5"
                onPress={() => scrollToCategory(año)}
              >
                <Text className="text-white text-base font-semibold">{año}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <ScrollView ref={scrollViewRef} className="flex-1">
        <View className="p-5 bg-white rounded-xl m-2.5 shadow elevation-3">
          <Text className="text-xl font-bold mb-4 text-center text-[#333]">
            Ingresá el código del equipo
          </Text>
          <TextInput
            className="bg-[#f5f5f5] rounded-lg p-3 text-base mb-4"
            placeholderTextColor="#999"
            placeholder="Ej: ABC1234"
            value={codigoEquipo}
            onChangeText={setCodigoEquipo}
            autoCapitalize="characters"
            maxLength={7}
          />
          <Boton
            texto={isLoading ? 'Buscando...' : 'Ver jugadores'}
            onPress={buscarJugadores}
            deshabilitado={isLoading}
            cargando={isLoading}
          />
          {error && <Text className="text-[#e53935] mt-3 text-center">{error}</Text>}
          {jugadores.length > 0 && (
            <View className="mt-2.5">
              <Boton
                texto={isGeneratingPDF ? 'Generando PDF...' : 'Generar PDF'}
                onPress={handleGeneratePDF}
                deshabilitado={isGeneratingPDF}
                cargando={isGeneratingPDF}
              />
            </View>
          )}
        </View>

        {jugadores.length > 0 && (
          <View className="p-2.5">
            {categorias.map((año) => (
              <View key={año} onLayout={(event) => handleCategoryLayout(año, event)}>
                <View className="bg-liga-600 p-3 mb-4 rounded-lg shadow-sm">
                  <Text className="text-white text-lg font-bold text-center">Categoría {año}</Text>
                </View>
                {jugadoresPorCategoria[año].map((jugador) => (
                  <Carnet key={jugador.id} jugador={jugador} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
