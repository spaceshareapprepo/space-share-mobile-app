import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import {
  SELECT_COLUMNS_LISTINGS
} from '@/constants/db';
import { ListingRow, MessageRow } from '@/constants/types';

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

export function useMyListings(ownerId?: string | null) {
  const [data, setData] = useState<ListingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadListings = useCallback(
    async (isActive: () => boolean = () => true) => {
      if (!ownerId) {
        if (isActive()) {
          setData([]);
          setError(null);
          setIsLoading(false);
        }
        return;
      }
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await useMyListingsQuery({
        ownerId,
      });
      if (!isActive()) return;
      if (fetchError) {
        setError(fetchError as Error);
        setData([]);
      } else {
        setData((data as unknown as ListingRow[]) ?? []);
      }
      if (isActive()) setIsLoading(false);
    },
    [ownerId]
  );

  useEffect(() => {
    let isMounted = true;
    void loadListings(() => isMounted);
    return () => {
      isMounted = false;
    };
  }, [loadListings]);

  return { data, isLoading, error, refresh: loadListings };
}
