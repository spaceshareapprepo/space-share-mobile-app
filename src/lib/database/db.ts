import { 
  SELECT_COLUMNS_LISTINGS,
  SELECT_COLUMNS_AIRPORTS
 } from '@/constants/db';
import type { ListingType, ListingRow, LocationsArray } from '@/constants/types';
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

export async function fetchListing(id: string) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select(SELECT_COLUMNS_LISTINGS)
      .eq('id', id)
      .limit(1);

    if (error) {
      throw error;
    }

    return { data: data ?? [], error: null };
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    return { data: [], error: err as Error };
  }
}

export async function fetchListingsAPI({ 
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
        `title.ilike.${searchPattern},description.ilike.${searchPattern},origin_name.ilike.${searchPattern},destination_name.ilike.${searchPattern}`
      );
    }

    if (typeFilter) {
      supabaseQuery = supabaseQuery.eq('type_of_listing', typeFilter);
    }

    const { data, error } = await supabaseQuery.overrideTypes<
      ListingRow[],
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


// export async function fetchLocationsAPI({ 
//   query
// }: {
//   query: string | null;
// }) {
//   try {
//     let supabaseQuery = supabase
//       .from('airports')
//       .select(SELECT_COLUMNS_AIRPORTS)
//       .order('city', { ascending: true })
//       .limit(5);
//     if (query) {
//       const searchPattern = `%${query.replaceAll(/\s+/g, '%')}%`;
//       supabaseQuery = supabaseQuery.or(
//         `city.ilike.${searchPattern},name.ilike.${searchPattern},iata_code.ilike.${searchPattern}`
//       );
//     }
//     const { data, error } = await supabaseQuery.overrideTypes<
//       LocationsArray[],
//       { merge: false }
//     >();

//     if (error) {
//       throw error;
//     }

//     return { data: data ?? [], error: null };
//   } catch (err) {
//     console.error('Failed to fetch locations:', err);
//     return { data: [], error: err as Error };
//   }
// }