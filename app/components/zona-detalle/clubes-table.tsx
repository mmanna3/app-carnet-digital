import React from 'react'
import { Image, Text, View } from 'react-native'
import type { EquipoConDatosDelClubDTO } from '@/lib/api/clients'

function textoOGuion(s: string | undefined) {
  const t = (s ?? '').trim()
  return t.length > 0 ? t : '—'
}

export function TableHeader() {
  return (
    <View className="flex-row border-b border-gray-300 bg-gray-100 px-2 py-2">
      <View className="w-40 shrink-0 flex-row items-center gap-2 pr-1">
        <View style={{ width: 32 }} />
        <Text className="flex-1 text-xs font-semibold uppercase text-gray-700">Equipo</Text>
      </View>
      <Text className="w-28 shrink-0 text-xs font-semibold uppercase text-gray-700">Localidad</Text>
      <Text className="w-44 shrink-0 text-xs font-semibold uppercase text-gray-700">Dirección</Text>
      <Text className="w-20 shrink-0 text-xs font-semibold uppercase text-gray-700">Techo</Text>
    </View>
  )
}

export type TableRowProps = {
  item: EquipoConDatosDelClubDTO
  index: number
  uriEscudo: string | null
}

export function TableRow({ item, index, uriEscudo }: TableRowProps) {
  return (
    <View
      className={`flex-row border-b border-gray-200 px-2 py-2.5 ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      <View className="w-40 shrink-0 flex-row items-center gap-2 pr-1">
        <View style={{ width: 32, height: 32 }} className="items-center justify-center">
          {uriEscudo ? (
            <Image
              source={{ uri: uriEscudo }}
              style={{ width: 32, height: 32 }}
              className="rounded"
              resizeMode="contain"
            />
          ) : null}
        </View>
        <Text className="flex-1 text-sm text-gray-900" numberOfLines={3}>
          {textoOGuion(item.equipo)}
        </Text>
      </View>
      <Text className="w-28 shrink-0 self-center pr-1 text-sm text-gray-800" numberOfLines={4}>
        {textoOGuion(item.localidad)}
      </Text>
      <Text className="w-44 shrink-0 self-center pr-1 text-sm text-gray-800" numberOfLines={5}>
        {textoOGuion(item.direccion)}
      </Text>
      <Text className="w-20 shrink-0 self-center text-sm text-gray-800">
        {textoOGuion(item.esTechado)}
      </Text>
    </View>
  )
}
