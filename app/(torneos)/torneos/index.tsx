import React from 'react'
import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import useApiQuery from '@/lib/api/custom-hooks/use-api-query'
import { api } from '@/lib/api/api'
import { queryKeys } from '@/lib/api/query-keys'
import { useConfigLiga } from '@/lib/config/liga'
import { TarjetaTorneo } from '@/torneos/_components/tarjeta-torneo'
import { useHeaderConHome } from '@/torneos/_hooks/use-header-con-home'
import { usePantallaGrande } from '@/lib/hooks/use-pantalla-grande'
import { EstadoCarga, EstadoVacio, Texto } from '@/design-system/componentes'
import { RUTAS } from '@/logica-compartida/constantes/rutas'

export default function Torneos() {
  const router = useRouter()
  const configLiga = useConfigLiga()
  const leagueId = configLiga?.leagueId
  const grande = usePantallaGrande()

  useHeaderConHome({ titulo: 'Torneos' })

  const {
    data: agrupadores,
    isLoading,
    isError,
  } = useApiQuery({
    key: queryKeys.torneos.infoInicial(leagueId),
    fn: () => api.infoInicialDeTorneos(),
    activado: !!leagueId,
  })

  if (!leagueId) {
    return <EstadoVacio mensaje="Seleccioná una liga para ver torneos." />
  }

  if (isLoading) {
    return <EstadoCarga mensaje="Cargando torneos..." />
  }

  if (isError || !agrupadores) {
    return <EstadoVacio mensaje="No se pudo cargar la información de torneos." />
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
        maxWidth: 1280,
        marginHorizontal: 'auto',
        width: '100%',
      }}
    >
      {agrupadores.map((a) => (
        <View key={a.id ?? a.nombre} className="mb-6">
          {a.nombre ? (
            <Texto
              variante="eyebrow"
              className="mb-3 text-base text-zinc-300 normal-case tracking-wide"
            >
              {a.nombre}
            </Texto>
          ) : null}
          <View style={grande ? { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } : undefined}>
            {(a.torneos ?? []).map((torneo) => (
              <View
                key={torneo.id ?? torneo.nombre}
                style={grande ? { flex: 1, minWidth: '30%', maxWidth: '33.33%' } : undefined}
              >
                <TarjetaTorneo
                  nombre={torneo.nombre?.trim() || 'Sin nombre'}
                  color={a.color}
                  iconName="trophy"
                  onPress={() =>
                    router.push({
                      pathname: RUTAS.TORNEO_DETALLE,
                      params:
                        torneo.id != null
                          ? { torneoId: String(torneo.id) }
                          : {
                              torneoId: '',
                              agrupadorId: a.id != null ? String(a.id) : '',
                              torneoNombre: torneo.nombre ?? '',
                            },
                    })
                  }
                />
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  )
}
