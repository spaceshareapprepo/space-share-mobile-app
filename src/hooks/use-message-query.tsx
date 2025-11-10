'use client';

import type { ChatMessage } from '@/hooks/use-realtime-chat';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface MessagesQueryResult {
  data: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

type MessageQueryRow = {
  id: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  thread_id: string;
  author: {
    id: string;
    name: string | null;
  } | null;
};

export function useMessagesQuery(threadId: string): MessagesQueryResult {
  const [data, setData] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function load() {
      setIsLoading(true);
      const { data: queryData, error } = await supabase
        .from('message')
        .select(
          `
            id,
            content,
            created_at,
            updated_at,
            thread_id,
            author:author_id(id, name)
          `
        )
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setData([]);
      } else {
        const rows = (queryData ?? []) as unknown as MessageQueryRow[];
        setData(
          rows.map((row) => ({
            id: row.id,
            content: row.content,
            createdAt: row.created_at ?? row.updated_at ?? new Date().toISOString(),
            user: {
              name: row.author?.name ?? 'Unknown user',
            },
          }))
        );
        setError(null);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [threadId]);

  return { data, isLoading, error };
}