"use client";

import { ChatMessageItem } from "@/components/inbox/chat-message";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { type ChatMessage, useRealtimeChat } from "@/hooks/use-realtime-chat";
import { Send } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

interface RealtimeChatProps {
  roomName: string;
  username: string;
  onMessage?: (messages: ChatMessage[]) => void;
  messages?: ChatMessage[];
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
  const { containerRef, scrollToBottom } = useChatScroll();

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  });
  const [newMessage, setNewMessage] = useState("");

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages];
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) =>
        index === self.findIndex((m) => m.id === message.id)
    );
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );

    return sortedMessages;
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages);
    }
  }, [allMessages, onMessage]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [allMessages, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !isConnected) {
      return;
    }

    sendMessage(trimmedMessage);
    setNewMessage("");
  }, [newMessage, isConnected, sendMessage]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ThemedView className="flex flex-1 flex-end bg-background">
        <ThemedView style={{ flex: 1 }}>
          <ScrollView
            ref={containerRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
            showsVerticalScrollIndicator={false}
            className="border rounded-lg"
            style={{ flex: 1 }}
          >
            {allMessages.length === 0 ? (
              <ThemedView className="items-center py-10">
                <ThemedText className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </ThemedText>
              </ThemedView>
            ) : (
              allMessages.map((message, index) => {
                const prevMessage = index > 0 ? allMessages[index - 1] : null;
                const showHeader =
                  !prevMessage || prevMessage.user.name !== message.user.name;

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
                );
              })
            )}
          </ScrollView>
        </ThemedView>
        <ThemedView className="border-t border-outline-200 px-4 py-3">
          <FormControl isDisabled={!isConnected}>
            <ThemedView className="flex-row items-center">
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
                <ButtonText>
                  <Send className="size-4" />
                </ButtonText>
              </Button>
            </ThemedView>
          </FormControl>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};
