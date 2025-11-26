import { useCallback, useEffect, useMemo, useState } from "react";

import { RealtimeChat } from "@/components/inbox/realtime-chat";
import { ThemedView } from "@/components/themed-view";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import * as db from "@/lib/database/db";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

type User = { id: string; name: string };

export default function ChatPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const threadId = useMemo(() => {
    const raw = params.id;
    if (Array.isArray(raw)) return raw[0] ?? "";
    return raw ?? "";
  }, [params.id]);

  const [user, setUser] = useState<User | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const { data } = await supabase.auth.getUser();
        const supabaseUser = data?.user;
        if (!supabaseUser) {
          router.navigate("/");
          return;
        }

        const currentUser: User = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name ?? "Unknown user",
        };

        if (!isMounted) return;
        setUser(currentUser);

        if (!threadId) return;

        const rows = await db.fetchMessages({authorId: currentUser.id, threadId: threadId});
        if (!isMounted) return;

        const mapped =
          rows.data?.map((row) => ({
            id: row.id,
            content: row.content,
            user: {
              name: row.owner?.full_name ?? "Unknown user",
            },
            createdAt: row.created_at.toString(),
          })) ?? [];

        setInitialMessages(mapped);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [router, threadId]);

  const handleMessage = useCallback(
    async (incoming: ChatMessage[]) => {
      if (!user || !threadId) return;

      const ownMessages = incoming.filter(
        (message) => message.user.name === user.name
      );
      if (!ownMessages.length) return;

      await db.storeMessages(
        ownMessages.map((message) => ({
          id: message.id,
          threadId,
          authorId: user.id,
          content: message.content,
          createdAt: message.createdAt,
        }))
      );
    },
    [threadId, user]
  );

  if (!threadId) {
    return null;
  }

  if (isLoading || !user) {
    return null;
  }

  return (
    <ThemedView className="flex-1 flex flex-col h-screen">
      <ThemedView className="border-t px-8 py-4 bg-white dark:bg-gray-900">
        <RealtimeChat
          roomName={threadId}
          username={user.name}
          onMessage={handleMessage}
          messages={initialMessages}
        />
      </ThemedView>
    </ThemedView>
  );
}
