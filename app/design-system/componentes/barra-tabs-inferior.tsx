import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const COLOR_TAB_INACTIVA = '#e4e4e7'

const TAB_BAR_BASE_HEIGHT = 58
const TAB_BAR_BG = '#141416'
const TAB_BAR_BORDER = 'rgba(255,255,255,0.08)'
const TAB_ICON_SIZE = 20

export type TabBarItem = {
  key: string
  titulo: string
  renderIcono: (color: string) => React.ReactNode
  onPress: () => void
  testID?: string
}

type Props = {
  tabs: TabBarItem[]
  indiceActivo: number
  hexAcento: string
}

export function BarraTabsInferior({ tabs, indiceActivo, hexAcento }: Props) {
  const insets = useSafeAreaInsets()
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom

  return (
    <View
      style={{
        height: tabBarHeight,
        paddingTop: 5,
        paddingBottom: insets.bottom,
        backgroundColor: TAB_BAR_BG,
        borderTopColor: TAB_BAR_BORDER,
        borderTopWidth: 1,
        flexDirection: 'row',
        elevation: 0,
        shadowOpacity: 0,
      }}
    >
      {tabs.map((tab, index) => {
        const activo = index === indiceActivo
        const color = activo ? hexAcento : COLOR_TAB_INACTIVA

        return (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center justify-center"
            onPress={tab.onPress}
            accessibilityRole="tab"
            accessibilityLabel={tab.titulo}
            accessibilityState={{ selected: activo }}
            testID={tab.testID}
          >
            {tab.renderIcono(color)}
            <Text
              style={{
                fontSize: 10,
                letterSpacing: 0.7,
                marginTop: 4,
                color,
              }}
            >
              {tab.titulo}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export { TAB_ICON_SIZE }
