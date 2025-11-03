import { supabase } from '@/lib/supabase';
import { config } from 'dotenv';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set!");
}

const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

export const db = drizzle({ client: pool});

export async function fetchListings() {
  try {
    const { data, error } = await supabase
            .from('listings')
            .select(`
              id,
              title,
              description,
              type_of_listing,
              status_code,
              shipment_code,
              flight_date,
              max_weight_kg,
              price_per_unit,
              currency_code,
              photos,
              is_verified,
              created_at,
              owner:profiles!listings_owner_id_fkey (
                id,
                full_name,
                bucket_avatar_url
              ),
              origin:airports!listings_origin_id_fkey (
                id,
                city,
                name,
                iata_code
              ),
              destination:airports!listings_destination_id_fkey (
                id,
                city,
                name,
                iata_code
              )
            `)
            .order('created_at', { ascending: false });

    return data;
  } catch (err) {
    console.error(`Database Error: ${err}`);
    throw new Error("Failed to fetch all listings data.");
  }
}
