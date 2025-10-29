import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { airports, db, listings, profiles } from "./schema.drizzle";
// Export the schema from db.ts
export * from "./schema.drizzle";

// Create aliases for the airports table to join twice
const originAirport = alias(airports, "origin_airport");
const destinationAirport = alias(airports, "destination_airport");

export async function fetchListings() {
  try {
    const data = await db
      .select({
        id: listings.id,
        title: listings.title,
        origin: originAirport.city,
        destination: destinationAirport.city,
        flightDate: listings.flightDate,
        maxWeightKg: listings.maxWeightKg,
        pricePerUnit: listings.pricePerUnit,
        photos: listings.photos,
        isVerified: listings.isVerified,
        ownerId: profiles.id,
        ownerName: sql<string>`(${profiles.fullName})`,
        ownerImage: sql<string>`(${profiles.publicAvatarUrl})`,
      })
      .from(listings)
      .leftJoin(profiles, eq(profiles.id, listings.ownerId))
      .leftJoin(originAirport, eq(originAirport.id, listings.origin))
      .leftJoin(
        destinationAirport,
        eq(destinationAirport.id, listings.destination)
      )
      .orderBy(desc(listings.createdAt))
      .limit(12);

    return data;
  } catch (err) {
    console.error(`Database Error: ${err}`);
    throw new Error("Failed to fetch all listings data.");
  }
}
