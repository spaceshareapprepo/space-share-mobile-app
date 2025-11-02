import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import * as schema from "@/lib/storage/schema.drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from 'dotenv';
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL env var is required to run Supabase setup.");
}

const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

export const db = drizzle({ client: pool});

// Create aliases for the airports table to join twice
const originAirport = alias(schema.airports, "origin_airport");
const destinationAirport = alias(schema.airports, "destination_airport");

export async function fetchListings() {
  try {
    const data = await db
      .select({
        id: schema.listings.id,
        title: schema.listings.title,
        origin: originAirport.city,
        destination: destinationAirport.city,
        flightDate: schema.listings.flightDate,
        maxWeightKg: schema.listings.maxWeightKg,
        pricePerUnit: schema.listings.pricePerUnit,
        photos: schema.listings.photos,
        isVerified: schema.listings.isVerified,
        ownerId: schema.profiles.id,
        ownerName: sql<string>`(${schema.profiles.fullName})`,
        ownerImage: sql<string>`(${schema.profiles.bucketAvatarUrl})`,
      })
      .from(schema.listings)
      .leftJoin(schema.profiles, eq(schema.profiles.id, schema.listings.ownerId))
      .leftJoin(originAirport, eq(originAirport.id, schema.listings.origin))
      .leftJoin(
        destinationAirport,
        eq(destinationAirport.id, schema.listings.destination)
      )
      .orderBy(desc(schema.listings.createdAt))
      .limit(12);

    return data;
  } catch (err) {
    console.error(`Database Error: ${err}`);
    throw new Error("Failed to fetch all listings data.");
  }
}
