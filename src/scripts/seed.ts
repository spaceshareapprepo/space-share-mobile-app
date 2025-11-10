import * as schema from "@/src/lib/storage/schema.drizzle";
import { db } from "@/src/lib/storage/schema.drizzle";
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

  // Get airport IDs for US airports
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

  const ORD = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "ORD"))
    .then((result) => result[0]?.id);

  const LAX = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "LAX"))
    .then((result) => result[0]?.id);

  const ATL = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "ATL"))
    .then((result) => result[0]?.id);

  // Get Ghana airport
  const ACC = await db
    .select({ id: schema.airports.id })
    .from(schema.airports)
    .where(eq(schema.airports.iataCode, "ACC"))
    .then((result) => result[0]?.id);

  if (!JFK || !IAD || !ORD || !LAX || !ATL || !ACC) {
    throw new Error("Required airports not found. Make sure airports are seeded first.");
  }

  // Insert 5 listings
  await db.insert(schema.listings).values([
    {
      ownerId: user.id,
      title: "New York (JFK) to Accra - 20kg Available",
      description: "Flying to Accra for the holidays. Have extra 20kg in checked baggage. Can carry documents, gifts, or small items. No liquids or prohibited items please.",
      originId: JFK,
      destinationId: ACC,
      flightDate: new Date("2024-12-15T10:00:00Z"),
      maxWeightKg: "20.00",
      maxWeightLb: "44.09",
      pricePerUnit: "150.00",
      currencyCode: 'USD',
      photos: [],
      isVerified: true,
      typeOfListing: 'travel',
      statusCode: '0',
      shipmentCode: null,
    },
    {
      ownerId: user.id,
      title: "Washington DC (IAD) to Accra - 15kg Space",
      description: "Traveling to Ghana next month. Willing to carry packages up to 15kg. Prefer electronics, clothing, or documents.",
      originId: IAD,
      destinationId: ACC,
      flightDate: new Date("2024-12-20T18:30:00Z"),
      maxWeightKg: "15.00",
      maxWeightLb: "33.07",
      pricePerUnit: "120.00",
      currencyCode: 'USD',
      photos: [],
      isVerified: false,
      typeOfListing: 'travel',
      statusCode: '0',
      shipmentCode: null,
    },
    {
      ownerId: user.id,
      title: "Chicago (ORD) to Accra - 10kg Luggage Space",
      description: "Have 10kg available in my checked luggage. Flying next week. Can help with gifts, documents, or personal items.",
      originId: ORD,
      destinationId: ACC,
      flightDate: new Date("2024-12-10T14:00:00Z"),
      maxWeightKg: "10.00",
      maxWeightLb: "22.05",
      pricePerUnit: "80.00",
      currencyCode: 'USD',
      photos: [],
      isVerified: true,
      typeOfListing: 'travel',
      statusCode: '0',
      shipmentCode: null,
    },
    {
      ownerId: user.id,
      title: "Los Angeles (LAX) to Accra - 25kg Available",
      description: "Making a trip home for Christmas. Have plenty of space - up to 25kg. Can transport clothing, electronics, books, or gifts. Reliable and verified traveler.",
      originId: LAX,
      destinationId: ACC,
      flightDate: new Date("2024-12-18T22:00:00Z"),
      maxWeightKg: "25.00",
      maxWeightLb: "55.12",
      pricePerUnit: "200.00",
      currencyCode: 'USD',
      photos: [],
      isVerified: true,
      typeOfListing: 'travel',
      statusCode: '0',
      shipmentCode: null,
    },
    {
      ownerId: user.id,
      title: "Atlanta (ATL) to Accra - Small Package 5kg",
      description: "Need to send a small package to family in Accra. Looking for a traveler who can help. Contains clothes and personal items. Will pay for your trouble.",
      originId: ATL,
      destinationId: ACC,
      flightDate: new Date("2024-12-25T16:45:00Z"),
      maxWeightKg: "5.00",
      maxWeightLb: "11.02",
      pricePerUnit: "50.00",
      currencyCode: 'USD',
      photos: [],
      isVerified: false,
      typeOfListing: 'shipment',
      statusCode: '0',
      shipmentCode: null, // You might want to set this based on your enum values
    },
  ]);

  console.log("✅ 5 listings seeded successfully!");
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
