import { useCallback, useRef } from 'react'
import type { ScrollView } from 'react-native'

export function useChatScroll() {
  const containerRef = useRef<ScrollView | null>(null)

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollToEnd({ animated: true })
  }, [])

  return { containerRef, scrollToBottom }
}
