import React from 'react'
import { Text, View } from 'react-native'
import CampoTexto from '@/fichaje-jugador/_components/campo-texto'
import Boton from '@/design-system/componentes/boton'
import { Texto } from '@/design-system/componentes/texto'
import type { TemaDegradadoEquipo } from '@/lib/utilidades/color-carnet'

interface Props {
  codigoEquipo: string
  onChangeCodigoEquipo: (value: string) => void
  onBuscar: () => void
  isLoading: boolean
  error: string | null
  mostrarAcciones: boolean
  onGenerarPDF: () => void
  onGenerarPlanillas: () => void
  isGeneratingPDF: boolean
  isGeneratingPlanillas: boolean
  temaBoton?: TemaDegradadoEquipo
}

export default function CuadroBuscador({
  codigoEquipo,
  onChangeCodigoEquipo,
  onBuscar,
  isLoading,
  error,
  mostrarAcciones,
  onGenerarPDF,
  onGenerarPlanillas,
  isGeneratingPDF,
  isGeneratingPlanillas,
  temaBoton,
}: Props) {
  const accionesDeshabilitadas = isGeneratingPDF || isGeneratingPlanillas

  return (
    <View className="m-2.5 rounded-xl border border-border-glass p-5 glass">
      <Texto className="mb-4 text-center text-lg tracking-wide text-zinc-400">
        Ingresá el código del equipo
      </Texto>

      <View className="flex-row items-center gap-2.5">
        <View className="w-30 shrink-0">
          <CampoTexto
            inputTestID="input-codigo-buscar"
            placeholder="Ej:ABC1234"
            value={codigoEquipo}
            onChangeText={onChangeCodigoEquipo}
            autoCapitalize="characters"
            maxLength={7}
            style={{ textAlign: 'center', paddingVertical: 14, width: '100%' }}
          />
        </View>
        <View className="min-w-0 flex-1">
          <Boton
            testID="boton-buscar"
            tamanio="maschico"
            texto={isLoading ? 'Buscando...' : 'Jugadores'}
            icono="search"
            cargando={isLoading}
            onPress={onBuscar}
            deshabilitado={isLoading}
            tema={temaBoton}
          />
        </View>
      </View>

      {error && (
        <Text className="mt-4 text-center tracking-wide text-md text-red-400">{error}</Text>
      )}

      {mostrarAcciones && (
        <View className="mt-3 flex-row gap-2.5">
          <View className="flex-1">
            <Boton
              testID="boton-generar-pdf"
              tamanio="maschico"
              primario={false}
              texto={isGeneratingPDF ? 'Generando...' : 'PDF'}
              icono="file-text"
              cargando={isGeneratingPDF}
              onPress={onGenerarPDF}
              deshabilitado={accionesDeshabilitadas}
            />
          </View>
          <View className="flex-1">
            <Boton
              testID="boton-generar-planillas"
              tamanio="maschico"
              primario={false}
              texto={isGeneratingPlanillas ? 'Generando...' : 'Planilla'}
              icono="clipboard"
              cargando={isGeneratingPlanillas}
              onPress={onGenerarPlanillas}
              deshabilitado={accionesDeshabilitadas}
            />
          </View>
        </View>
      )}
    </View>
  )
}
