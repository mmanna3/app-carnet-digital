import React, { useState, useRef } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Carnet from '@/delegados/_components/mis-jugadores/carnet'
import { generatePDF } from '@/lib/utils/pdfGenerator'
import { generatePlanillas } from '@/lib/utils/planillas-generador'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import { Titulo, FranjaSeccion } from '@/design-system/componentes'
import { temaFranjaCarnet } from '@/lib/utilidades/color-carnet'

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

  const temaTorneo = jugadores.length > 0 ? temaFranjaCarnet(jugadores[0]) : undefined

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
    <View testID="pantalla-buscar" className="flex-1 bg-surface">
      {jugadores.length > 0 && (
        <View className="bg-surface-elevated py-2.5 border-b border-border-glass z-[1]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {categorias.map((año) => (
              <FranjaSeccion
                key={`button-${año}`}
                variante="pill"
                tema={temaTorneo}
                className="mx-1.5 mb-0"
                onPress={() => scrollToCategory(año)}
              >
                {String(año)}
              </FranjaSeccion>
            ))}
          </ScrollView>
        </View>
      )}
      <ScrollView ref={scrollViewRef} className="flex-1">
        <View className="p-5 glass rounded-xl border border-border-glass m-2.5">
          <View className="mb-4 items-center">
            <Titulo className="text-center">Ingresá el código del equipo</Titulo>
          </View>
          <View className="mb-4 w-full items-center">
            <View className="w-44">
              <CampoTexto
                inputTestID="input-codigo-buscar"
                placeholder="Ej: ABC1234"
                value={codigoEquipo}
                onChangeText={setCodigoEquipo}
                autoCapitalize="characters"
                maxLength={7}
                style={{ textAlign: 'center' }}
              />
            </View>
          </View>
          <Boton
            testID="boton-buscar"
            texto={isLoading ? 'Buscando...' : 'Ver jugadores'}
            icono="search"
            cargando={isLoading}
            onPress={buscarJugadores}
            deshabilitado={isLoading}
          />
          {error && <Text className="text-red-400 mt-3 text-sm text-center">{error}</Text>}
          {jugadores.length > 0 && (
            <View className="mt-3 gap-3">
              <Boton
                testID="boton-generar-pdf"
                primario={false}
                texto={isGeneratingPDF ? 'Generando PDF...' : 'Generar PDF'}
                icono="file-text"
                cargando={isGeneratingPDF}
                onPress={handleGeneratePDF}
                deshabilitado={isGeneratingPDF || isGeneratingPlanillas}
              />
              <Boton
                testID="boton-generar-planillas"
                primario={false}
                texto={isGeneratingPlanillas ? 'Generando planillas...' : 'Planillas'}
                icono="clipboard"
                cargando={isGeneratingPlanillas}
                onPress={handleGeneratePlanillas}
                deshabilitado={isGeneratingPDF || isGeneratingPlanillas}
              />
            </View>
          )}
        </View>

        {jugadores.length > 0 && (
          <View className="p-2.5">
            {categorias.map((año) => (
              <View key={año} onLayout={(event) => handleCategoryLayout(año, event)}>
                <FranjaSeccion variante="separador" tema={temaTorneo}>
                  Categoría {año}
                </FranjaSeccion>
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
