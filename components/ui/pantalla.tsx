import React from 'react'
import { View, ScrollView, type ScrollViewProps, type ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  children: React.ReactNode
  scroll?: boolean
  className?: string
  contentClassName?: string
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
  scrollProps?: Omit<ScrollViewProps, 'children' | 'className' | 'contentContainerStyle'>
  safeArea?: boolean
} & Pick<ViewProps, 'style'>

export function PantallaPublica({
  children,
  scroll = false,
  className = '',
  contentClassName = '',
  edges = ['top'],
  scrollProps,
  safeArea = true,
  style,
}: Props) {
  const inner = scroll ? (
    <ScrollView
      className={`flex-1 bg-surface ${className}`.trim()}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        maxWidth: 1280,
        marginHorizontal: 'auto',
        width: '100%',
      }}
      {...scrollProps}
    >
      <View className={contentClassName}>{children}</View>
    </ScrollView>
  ) : (
    <View
      className={`flex-1 bg-surface ${className}`.trim()}
      style={[{ maxWidth: 1280, marginHorizontal: 'auto', width: '100%' }, style]}
    >
      {children}
    </View>
  )

  if (!safeArea) return inner

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={edges}>
      {inner}
    </SafeAreaView>
  )
}
