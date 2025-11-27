import { useCallback, useRef } from 'react'
import type { ScrollView } from 'react-native'

export function useChatScroll() {
  const containerRef = useRef<ScrollView>(null)

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    containerRef.current?.scrollToEnd({
      animated: true,
      })
  }, [])

  return { containerRef, scrollToBottom }
}
