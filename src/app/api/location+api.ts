import {
  SELECT_COLUMNS_AIRPORTS
} from '@/constants/db';
import type { LocationsArray, LocationsResponse } from "@/constants/types";
import { supabase } from '@/lib/supabase';
import {
  normaliseSearchTerm
} from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.EXPO_PUBLIC_API_CORS_ORIGIN ??
    "https://space-share-mobile-app.expo.app",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const start = Date.now();
  const url = new URL(request.url);

  const query = normaliseSearchTerm(url.searchParams.get("q"));

  try {

    let supabaseQuery = supabase
      .from('airports')
      .select(SELECT_COLUMNS_AIRPORTS)
      .order('city', { ascending: true })
      .limit(5);

    if (query) {
      const searchPattern = `%${query.replaceAll(/\s+/g, '%')}%`;
      supabaseQuery = supabaseQuery.or(
        `country.ilike.${searchPattern},city.ilike.${searchPattern},name.ilike.${searchPattern},iata_code.ilike.${searchPattern}`
      );
    }
    const { data, error } = await supabaseQuery.overrideTypes<
      LocationsArray[],
      { merge: false }
    >();

    if (error) {
      throw error;
    }

    const duration = Date.now() - start;

    const body: LocationsResponse = {
      data: data,
      total: data.length,
      tookMs: duration,
      params: { q: query },
    };

    return Response.json(body, { headers: corsHeaders });

  } catch (error) {
    console.error("Failed to search listings:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to load listings. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
