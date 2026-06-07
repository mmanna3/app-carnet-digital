import React, { useState, useRef } from 'react'
import { Alert, ScrollView, View } from 'react-native'
import { api } from '@/lib/api/api'
import { parseApiError } from '@/lib/utils/parse-api-error'
import { CarnetDigitalDTO } from '@/lib/api/clients'
import Carnet from '@/delegados/_components/mis-jugadores/carnet'
import { generatePDF } from '@/lib/utils/pdfGenerator'
import { generatePlanillas } from '@/lib/utils/planillas-generador'
import { FranjaSeccion } from '@/design-system/componentes'
import CuadroBuscador from '@/inicio-delegados/_components/cuadro-buscador'
import { colorAgrupadorEquipo, temaFranjaEquipo } from '@/lib/utilidades/color-carnet'

export default function BuscarScreen() {
  const [codigoEquipo, setCodigoEquipo] = useState('')
  const [jugadores, setJugadores] = useState<CarnetDigitalDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingPlanillas, setIsGeneratingPlanillas] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [categoryPositions, setCategoryPositions] = useState<Record<number | string, number>>({})

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

  const delegados = jugadores.filter((j) => j.esDelegado === true)
  const jugadoresNoDelegados = jugadores.filter((j) => j.esDelegado !== true)

  const jugadoresPorCategoria = jugadoresNoDelegados.reduce(
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

  const categoriasAño = Object.keys(jugadoresPorCategoria)
    .map(Number)
    .sort((a, b) => a - b)

  const hayDelegados = delegados.length > 0
  const secciones = hayDelegados
    ? (['delegados' as const, ...categoriasAño] as const)
    : categoriasAño
  const temaTorneo = jugadores.length > 0 ? temaFranjaEquipo(jugadores) : undefined
  const colorAgrupadorDelEquipo = jugadores.length > 0 ? colorAgrupadorEquipo(jugadores) : undefined

  const scrollToSection = (seccion: number | string) => {
    const position = categoryPositions[seccion]
    if (position !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  const handleSectionLayout = (seccion: number | string, event: any) => {
    const { y } = event.nativeEvent.layout
    setCategoryPositions((prev) => ({
      ...prev,
      [seccion]: y,
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
            {secciones.map((seccion) => (
              <FranjaSeccion
                key={`button-${seccion}`}
                variante="pill"
                tema={temaTorneo}
                className="mx-1.5 mb-0"
                onPress={() => scrollToSection(seccion)}
              >
                {seccion === 'delegados' ? 'DT/Delegado' : String(seccion)}
              </FranjaSeccion>
            ))}
          </ScrollView>
        </View>
      )}
      <ScrollView ref={scrollViewRef} className="flex-1">
        <CuadroBuscador
          codigoEquipo={codigoEquipo}
          onChangeCodigoEquipo={setCodigoEquipo}
          onBuscar={buscarJugadores}
          isLoading={isLoading}
          error={error}
          mostrarAcciones={jugadores.length > 0}
          onGenerarPDF={handleGeneratePDF}
          onGenerarPlanillas={handleGeneratePlanillas}
          isGeneratingPDF={isGeneratingPDF}
          isGeneratingPlanillas={isGeneratingPlanillas}
        />

        {jugadores.length > 0 && (
          <View className="p-2.5">
            {hayDelegados && (
              <View key="delegados" onLayout={(event) => handleSectionLayout('delegados', event)}>
                <FranjaSeccion variante="separador" tema={temaTorneo}>
                  DT/Delegado
                </FranjaSeccion>
                {delegados.map((jugador) => (
                  <Carnet
                    key={jugador.id}
                    jugador={jugador}
                    colorAgrupadorEquipo={colorAgrupadorDelEquipo}
                  />
                ))}
              </View>
            )}
            {categoriasAño.map((año) => (
              <View key={año} onLayout={(event) => handleSectionLayout(año, event)}>
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
