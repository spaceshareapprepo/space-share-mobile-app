import type { MessageRow } from "@/constants/types";
import { supabase } from "@/lib/supabase";

type MessageQueryParams = {
  threadId?: string;
  authorId?: string;
  limit?: number;
};

export async function useMessagesQuery({
  threadId,
  authorId,
}: MessageQueryParams = {}) {

  try {
    let supabaseQuery = supabase
      .from("messages")
      .select(
        `
        id,
        content,
        created_at,
        owner:profiles!messages_author_id_profiles_id_fk(
          id,
          full_name,
          email_verified
        )
      `
      )
      .order("created_at", { ascending: true });

    if (threadId) {
      supabaseQuery = supabaseQuery.eq("thread_id", threadId);
    }

    if (authorId) {
      supabaseQuery = supabaseQuery.eq("author_id", authorId);
    }

    const { data, error } = await supabaseQuery.overrideTypes<
      MessageRow[],
      { merge: false }
    >();

    if (error) {
      throw error;
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    console.error("Failed to connect to supabase public.messages:", err);
    return { data: [], error: err as Error };
  }
}



