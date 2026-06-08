import { useCallback, useRef, type RefObject } from 'react'
import { ScrollView, type LayoutChangeEvent } from 'react-native'

type UseScrollAlCampoOptions = {
  offsetSuperior?: number
  delayMs?: number
}

export function useScrollAlCampo(
  scrollViewRef: RefObject<ScrollView | null>,
  options: UseScrollAlCampoOptions = {}
) {
  const { offsetSuperior = 80, delayMs = 100 } = options
  const formTopRef = useRef(0)
  const fieldOffsets = useRef<Record<string, number>>({})

  const handleFormLayout = useCallback((e: LayoutChangeEvent) => {
    formTopRef.current = e.nativeEvent.layout.y
  }, [])

  const handleFieldLayout = useCallback(
    (fieldKey: string) => (e: LayoutChangeEvent) => {
      const { y } = e.nativeEvent.layout
      fieldOffsets.current[fieldKey] = y
    },
    []
  )

  const scrollToField = useCallback(
    (fieldKey: string) => {
      const fieldY = fieldOffsets.current[fieldKey]
      if (fieldY === undefined) return
      const totalY = formTopRef.current + fieldY
      const targetY = Math.max(0, totalY - offsetSuperior)
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: targetY,
          animated: true,
        })
      }, delayMs)
    },
    [scrollViewRef, offsetSuperior, delayMs]
  )

  return { handleFormLayout, handleFieldLayout, scrollToField }
}
