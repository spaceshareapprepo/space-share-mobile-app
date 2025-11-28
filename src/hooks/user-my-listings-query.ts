import { supabase } from '@/lib/supabase';
import {
  SELECT_COLUMNS_LISTINGS
} from '@/constants/db';
import { MessageRow } from '@/constants/types';

type MyListingProps = {
    ownerId?: string | null | undefined;
}
export async function useMyListingsQuery({ ownerId }: MyListingProps = {}) {
  try {
    let supabaseQuery = supabase
      .from('listings')
      .select(SELECT_COLUMNS_LISTINGS)
      .order('created_at', { ascending: false })
      .eq('owner_id', ownerId);

    if (ownerId) {
      supabaseQuery = supabaseQuery.eq('owner_id', ownerId);
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
    console.error('Failed to fetch listings:', err);
    return { data: [], error: err as Error };
  }
}