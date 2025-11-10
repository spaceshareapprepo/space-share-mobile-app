'use client'

import { ChatMessageItem } from '@/components/chat-message'
import { ThemedView } from '@/components/themed-view'
import { Button } from '@/components/ui/button'
import {
  FormControl,
} from '@/components/ui/form-control'
import { Input, InputField } from '@/components/ui/input'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Send } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    return sortedMessages
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage || !isConnected) {
      return
    }

    sendMessage(trimmedMessage)
    setNewMessage('')
  }, [newMessage, isConnected, sendMessage])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ThemedView className="flex-1 bg-background text-foreground">
        <ScrollView
          ref={containerRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {allMessages.length === 0 ? (
            <ThemedView className="items-center py-10">
              <Text className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </Text>
            </ThemedView>
          ) : (
            allMessages.map((message, index) => {
              const prevMessage = index > 0 ? allMessages[index - 1] : null
              const showHeader =
                !prevMessage || prevMessage.user.name !== message.user.name

              return (
                <ThemedView
                  key={message.id}
                  className="mb-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                  <ChatMessageItem
                    message={message}
                    isOwnMessage={message.user.name === username}
                    showHeader={showHeader}
                  />
                </ThemedView>
              )
            })
          )}
        </ScrollView>
        <ThemedView className="border-t border-outline-200 px-4 py-3">
          <FormControl isDisabled={!isConnected}>
            <View className="flex-row items-center">
              <Input className="flex-1" variant="rounded">
                <InputField
                  className="text-sm"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  returnKeyType="send"
                  onSubmitEditing={handleSendMessage}
                  editable={isConnected}
                  submitBehavior="blurAndSubmit"
                />
              </Input>
              <Button
                className="ml-3 rounded-full"
                disabled={!isConnected || !newMessage.trim()}
                onPress={handleSendMessage}
              >
                <Send className="size-4" />
              </Button>
            </View>
          </FormControl>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
