import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { cn } from '@/lib/utils';
import { Text } from 'react-native';

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <ThemedView className={`mt-2 flex-row ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <ThemedView
        className={cn('max-w-[75%] flex flex-col gap-1', {
          'items-end self-end': isOwnMessage,
          'self-start': !isOwnMessage,
        })}
      >
        {showHeader && (
          <ThemedView
            className={cn('flex-row items-center gap-2 px-3', {
              'justify-end flex-row-reverse': isOwnMessage,
            })}
          >
            <ThemedText className="font-medium text-xs text-foreground">{message.user.name}</ThemedText>
            <ThemedText className="text-foreground/50 text-xs">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </ThemedText>
          </ThemedView>
        )}
        <ThemedView
          className={cn(
            'py-2 px-3 rounded-xl',
            isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
          )}
        >
          <ThemedText
            className={cn('text-sm', isOwnMessage ? 'text-primary-foreground' : 'text-foreground')}
          >
            {message.content}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )
}
