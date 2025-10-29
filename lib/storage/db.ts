import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { airports, dbClient, listings, profiles } from "./schema";
// Export the schema from db.ts
export * from "./schema";

// Create aliases for the airports table to join twice
const originAirport = alias(airports, "origin_airport");
const destinationAirport = alias(airports, "destination_airport");

export async function fetchListings() {
  try {
    const data = await dbClient
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
        ownerName: sql<string>`(${profiles.name})`,
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
