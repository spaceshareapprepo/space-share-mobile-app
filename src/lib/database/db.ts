import {
  SELECT_COLUMNS_LISTINGS
} from '@/constants/db';
import type { ListingRow, ListingType, MessageRow } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import { z } from "zod";

export async function fetchListings() {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(SELECT_COLUMNS_LISTINGS)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    return { data: [], error: err as Error };
  }
}

export async function fetchListing(id: string) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(SELECT_COLUMNS_LISTINGS)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    return { data: [], error: err as Error };
  }
}

export async function searchListings({ query, typeFilter }: { query: string | null; typeFilter: ListingType | null; }) {
  try {
    if (query && query.trim()) {
      const { data, error } = await supabase
        .rpc("search_listings_websearch", { query: query.trim() });
      if (error) throw error;
      const rows = (data as ListingRow[] | null) ?? [];
      const filtered = typeFilter
        ? rows.filter((row) => row.type_of_listing === typeFilter)
        : rows;
      return { data: filtered, error: null };
    }

    let q = supabase
      .from("listings")
      .select(SELECT_COLUMNS_LISTINGS)
      .order("created_at", { ascending: false })
      .limit(50);

    if (typeFilter) {
      q = q.eq("type_of_listing", typeFilter);
    }

    const { data, error } = await q;
    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (err) {
    console.error("Search error:", err);
    return { data: [], error: err as Error };
  }
}



export async function fetchMessages({authorId, threadId}:{authorId: string | undefined, threadId: string}) {
  try {
    let supabaseQuery = supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        owner:profiles!messages_author_id_profiles_id_fk(
          id,
          full_name,
          email_verified
          ),

      `)
      .eq('thread_id', threadId)
      .eq('author_id', authorId)
      .order('created_at')
      .limit(50);

    const { data, error } = await supabaseQuery.overrideTypes<
      MessageRow[],
      { merge: false }
    >();

    return { data, error };

  } catch (err) {
    console.error("Failed to connect to supabase public.messages:", err);
    return { data: [], error: err as Error };
  }
}

const messageSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1),
  createdAt: z.string().optional(),
});

export async function storeMessages(rawMessages: unknown[]) {
  const messages = z.array(messageSchema).parse(rawMessages);

  if (!messages.length) return;

  const threadIds = [...new Set(messages.map((m) => m.threadId))];

  for (const threadId of threadIds) {
    const { data, error } = await supabase
      .from("threads")
      .select("id")
      .eq("id", threadId)
      .limit(1);
    if (error) throw new Error(error.message);

    if (data.length === 0) {
      const { error: insertError } = await supabase
        .from("threads")
        .insert({ id: threadId });
      if (insertError) throw new Error(insertError.message);
    }
  }

  const rows = messages.map(
    ({ id, threadId, authorId, content, createdAt }) => {
      const timestamp = createdAt ?? new Date().toISOString();

      return {
        id,
        thread_id: threadId,
        author_id: authorId,
        content,
        created_at: timestamp,
        updated_at: timestamp,
      };
    }
  );

  const { error } = await supabase
    .from("messages")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function fetchThread({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  try {
    const { data, error } = await supabase
      .from("threads")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error };
  } catch (err) {
    console.error("Failed to connect to supabase public.threads:", err);
    return { data: [], error: err as Error };
  }
}

export async function createThread({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string;
  sellerId: string;
}) {
  try {
    const { data, error } = await supabase
      .from("threads")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (err) {
    console.error("Failed to create thread in public.threads:", err);
    return { data: [], error: err as Error };
  }
}
