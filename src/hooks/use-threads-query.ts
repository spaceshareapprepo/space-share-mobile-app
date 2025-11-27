import type { ThreadRow } from "@/constants/types";
import { supabase } from "@/lib/supabase";

type ThreadsQueryParams = {
  userId?: string;
};

export async function useThreadsQuery({
  userId
}: ThreadsQueryParams = {}) {

  try {
    let supabaseQuery = supabase
      .from("threads")
      .select(
        `
        id,
        listing_id,
        updated_at,
        listing:listings!threads_listing_id_listings_id_fk(
          title
        ),
        buyer:profiles!threads_buyer_id_profiles_id_fk(
          id,
          full_name,
          email_verified
        ),
        seller:profiles!threads_seller_id_profiles_id_fk(
          id,
          full_name,
          email_verified
        )
      `
      )
      .order("updated_at", { ascending: true });

    if (userId) {
      supabaseQuery = supabaseQuery.or(
        `buyer_id.eq.${userId},seller_id.eq.${userId}`
      );
    }

    const { data, error } = await supabaseQuery.overrideTypes<
      ThreadRow[],
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
