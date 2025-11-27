import type { ChatMessage } from "@/constants/types";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { useCallback, useEffect, useMemo } from "react";
import { Platform } from "react-native";

import { GiftedChat, type IMessage } from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  });
  const insets = useSafeAreaInsets();

  const tabbarHeight = 50;
  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 });
  const keyboardVerticalOffset =
    insets.bottom + tabbarHeight + keyboardTopToolbarHeight;

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

  const giftedMessages = useMemo<IMessage[]>(() => {
    return allMessages
      .map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user.name,
          name: message.user.name,
        },
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [allMessages]);

  const handleSend = useCallback(
    (outgoing: IMessage[] = []) => {
      if (!isConnected || !outgoing.length) return;

      outgoing.forEach((msg) => {
        sendMessage(msg.text);
      });
    },
    [isConnected, sendMessage]
  );

  return (
    <GiftedChat
      messages={giftedMessages}
      onSend={handleSend}
      user={{
        _id: username,
        name: username,
      }}
      keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
      isTyping={!isConnected}
    />
  );
};
