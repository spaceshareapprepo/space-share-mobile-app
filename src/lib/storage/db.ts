import { SELECT_COLUMNS_LISTINGS } from '@/constants/db';
import type { ListingType, SupabaseListingRow } from '@/constants/types';
import { supabase } from '@/lib/supabase';

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

export async function fetchListingsQuery({ 
  query, 
  typeFilter 
}: {
  query: string | null;
  typeFilter: ListingType | null;
}) {
  try {
    let supabaseQuery = supabase
      .from('listings')
      .select(SELECT_COLUMNS_LISTINGS)
      .order('created_at', { ascending: false })
      .limit(50);

    if (query) {
      const searchPattern = `%${query.replaceAll(/\s+/g, '%')}%`;
      supabaseQuery = supabaseQuery.or(
        `title.ilike.${searchPattern},description.ilike.${searchPattern}`
      );
    }

    if (typeFilter) {
      supabaseQuery = supabaseQuery.eq('type_of_listing', typeFilter);
    }

    const { data, error } = await supabaseQuery.overrideTypes<
      SupabaseListingRow[],
      { merge: false }
    >();

    if (error) {
      throw error;
    }

    const listingData = data ?? [];

    if (!query) {
      return { data: listingData, error: null };
    }

    const lowerQuery = query.toLowerCase();
    const filteredData = listingData.filter((listing) => {
      const matchesListing =
        listing?.title?.toLowerCase().includes(lowerQuery) ||
        listing?.description?.toLowerCase().includes(lowerQuery);

      const matchesOrigin =
        listing?.origin?.city?.toLowerCase().includes(lowerQuery) ||
        listing?.origin?.name?.toLowerCase().includes(lowerQuery);

      const matchesDestination =
        listing.destination?.city?.toLowerCase().includes(lowerQuery) ||
        listing.destination?.name?.toLowerCase().includes(lowerQuery);

      return matchesListing || matchesOrigin || matchesDestination;
    });
    
    return { data: filteredData, error: null };
    
  } catch (err) {
    console.error('Failed to connect to supabase public.listings:', err);
    return { data: [], error: err as Error };
  }
}
