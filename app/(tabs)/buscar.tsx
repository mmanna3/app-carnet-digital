import React, { useState, useRef } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Carnet from '../components/carnet'
import { generatePDF } from '@/lib/utils/pdfGenerator'
import { generatePlanillas } from '@/lib/utils/planillas-generador'
import { getColorLiga600 } from '@/lib/config/liga'

export default function BuscarScreen() {
  const [codigoEquipo, setCodigoEquipo] = useState('')
  const [jugadores, setJugadores] = useState<CarnetDigitalDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingPlanillas, setIsGeneratingPlanillas] = useState(false)
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

  const handleGeneratePlanillas = async () => {
    if (jugadores.length === 0) return

    setIsGeneratingPlanillas(true)
    try {
      const resultado = await api.planillasDeJuego(codigoEquipo.trim())
      await generatePlanillas(resultado, codigoEquipo)
    } catch (error: any) {
      const mensajeError = (() => {
        try {
          const parsed = JSON.parse(error?.response)
          return parsed?.title ?? 'No se pudo generar las planillas'
        } catch {
          return 'No se pudo generar las planillas'
        }
      })()
      Alert.alert('Error', mensajeError)
    } finally {
      setIsGeneratingPlanillas(false)
    }
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
    <View testID="pantalla-buscar" className="flex-1 bg-[#f8f8f8]">
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
          <Text className="text-md font-bold mb-4 text-center text-[#333]">
            Ingresá el código del equipo
          </Text>
          <View className="mb-4 w-full items-center">
            <TextInput
              testID="input-codigo-buscar"
              className="w-44 rounded-lg bg-[#f5f5f5] px-3 py-2 pb-4 text-center text-base font-semibold tracking-wide"
              placeholderTextColor="#999"
              placeholder="Ej: ABC1234"
              value={codigoEquipo}
              onChangeText={setCodigoEquipo}
              autoCapitalize="characters"
              maxLength={7}
            />
          </View>
          <TouchableOpacity
            testID="boton-buscar"
            className={`h-[50px] flex-row items-center justify-center gap-2 rounded-xl bg-liga-600 px-4 shadow-md ${
              isLoading ? 'opacity-70' : ''
            }`}
            onPress={buscarJugadores}
            disabled={isLoading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Ver jugadores"
          >
            <Text className="text-base font-semibold text-white" numberOfLines={1}>
              {isLoading ? 'Buscando...' : 'Ver jugadores'}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Feather name="search" size={22} color="#ffffff" />
            )}
          </TouchableOpacity>
          {error && <Text className="text-[#e53935] mt-3 text-center">{error}</Text>}
          {jugadores.length > 0 && (
            <View className="mt-2.5 flex-row gap-3">
              <TouchableOpacity
                testID="boton-generar-pdf"
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-liga-600 border-2 bg-transparent px-2 py-3.5 ${
                  isGeneratingPDF || isGeneratingPlanillas ? 'opacity-70' : ''
                }`}
                onPress={handleGeneratePDF}
                disabled={isGeneratingPDF || isGeneratingPlanillas}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Generar PDF"
              >
                <Text
                  className="shrink text-center text-base font-semibold text-liga-600"
                  numberOfLines={2}
                >
                  {isGeneratingPDF ? 'Generando PDF...' : 'Generar PDF'}
                </Text>
                {isGeneratingPDF ? (
                  <ActivityIndicator size="small" color={getColorLiga600()} />
                ) : (
                  <Feather name="file-text" size={22} color={getColorLiga600()} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                testID="boton-generar-planillas"
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-liga-600 bg-transparent px-2 py-3.5 ${
                  isGeneratingPDF || isGeneratingPlanillas ? 'opacity-70' : ''
                }`}
                onPress={handleGeneratePlanillas}
                disabled={isGeneratingPDF || isGeneratingPlanillas}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Generar planillas"
              >
                <Text
                  className="shrink text-center text-base font-semibold text-liga-600"
                  numberOfLines={2}
                >
                  {isGeneratingPlanillas ? 'Generando planillas...' : 'Planillas'}
                </Text>
                {isGeneratingPlanillas ? (
                  <ActivityIndicator size="small" color={getColorLiga600()} />
                ) : (
                  <Feather name="clipboard" size={22} color={getColorLiga600()} />
                )}
              </TouchableOpacity>
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
