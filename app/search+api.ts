
import type {
  ListingsResponse,
} from "@/constants/types";
import { fetchListingsQuery } from "@/lib/storage/db";
import { 
  mapToShipmentRequest, 
  mapToTravellerListing, 
  normaliseSearchTerm, 
  normaliseSegment, 
  segmentToListingType 
} from "@/lib/utils";

export async function GET(request: Request) {
  const start = Date.now();
  const url = new URL(request.url);

  const query = normaliseSearchTerm(url.searchParams.get("q"));
  const segment = normaliseSegment(url.searchParams.get("segment"));
  const typeFilter = segmentToListingType(segment);

  try {
    const rows = await fetchListingsQuery({query, typeFilter });

    const travellers = rows.data.filter((row) => row.type_of_listing === "travel")
      .map(mapToTravellerListing);

    const shipments = rows.data.filter((row) => row.type_of_listing === "shipment")
      .map(mapToShipmentRequest);

    const duration = Date.now() - start;

    const body: ListingsResponse = {
      travellers,
      shipments,
      total: travellers.length + shipments.length,
      tookMs: duration,
      params: {
        q: query,
        segment,
      },
    };

    return Response.json(body);
  } catch (error) {
    console.error("Failed to search listings:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to load listings. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

