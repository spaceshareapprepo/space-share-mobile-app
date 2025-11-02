import { db } from "@/lib/storage/db";
import * as schema from "@/lib/storage/schema.drizzle";
import { eq } from "drizzle-orm";



async function seedListings() {
  console.log("Seeding listings...");

  // Get the user
  const [user] = await db
    .select({ id: schema.profiles.id })
    .from(schema.profiles)
    .where(eq(schema.profiles.email, "spaceshareapp@gmail.com"));

  if (!user) {
    throw new Error("User not found");
  }

  // Get airport IDs
  const JFK = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "JFK"))
    .then((result) => result[0]?.id);

  const IAD = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "IAD"))
    .then((result) => result[0]?.id);

  const ACC = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "ACC"))
    .then((result) => result[0]?.id);

  // Insert listings
  await db.insert(schema.listings).values([
    {
      ownerId: user.id,
      title: "New York to Accra",
      description: "Extra 20kg in checked baggage.",
      origin: JFK,
      destination: ACC,
      flightDate: new Date("2024-12-15T10:00:00Z"),
      maxWeightKg: 20,
      pricePerUnit: 20,
      currencyCode: "USD", // Added
      photos: [],
      isVerified: true,
      typeOfListing: "travel",
      statusCode: "0", // Added (uses default but explicit is clearer)
      shipmentCode: null, // Added (optional, null for travel listings)
    },
    {
      ownerId: user.id,
      title: "Washington DC to Accra",
      description: "Extra 20kg in checked baggage.",
      origin: IAD,
      destination: ACC,
      flightDate: new Date("2024-12-15T10:00:00Z"),
      maxWeightKg: 20,
      pricePerUnit: 100,
      currencyCode: "USD", // Added
      photos: [],
      isVerified: true,
      typeOfListing: "travel", // Added (was missing!)
      statusCode: "0", // Added
      shipmentCode: null, // Added
    },
    {
      ownerId: user.id,
      title: "New York to Accra",
      description: "Extra 2kg in checked baggage.",
      origin: JFK,
      destination: ACC,
      flightDate: new Date("2024-12-20T14:30:00Z"),
      maxWeightKg: 2,
      pricePerUnit: 15,
      currencyCode: "USD", // Added
      photos: [],
      isVerified: true,
      typeOfListing: "travel", // Added (was missing!)
      statusCode: "0", // Added
      shipmentCode: null, // Added
    },
  ]);

  console.log("Listings seeded successfully!");
}

async function main() {
  try {
    await seedListings();
    console.log("All seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
