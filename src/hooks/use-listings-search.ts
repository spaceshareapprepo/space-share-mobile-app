import { useCallback, useMemo, useState } from "react";
import { fetch } from "expo/fetch";

import { generateAPIUrl } from "@/lib/utils";
import type {
  ListingsResponse,
  ListingRow,
  SearchSegment,
  SegmentKey,
} from "@/constants/types";

export function useListingsSearch(initialSegment: SegmentKey = "routes") {
  const [travelListings, setTravelListings] = useState<ListingRow[]>([]);
  const [shipmentListings, setShipmentListings] = useState<ListingRow[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState("");
  const [segment, setSegment] = useState<SegmentKey>(initialSegment);

  const performSearch = useCallback(
    async (searchTerm: string, segmentOverride: SearchSegment = "all") => {
      const term = searchTerm.trim();
      const params = new URLSearchParams();
      if (term.length > 0) {
        params.set("q", term);
      }
      params.set("segment", segmentOverride);

      setIsFetching(true);
      setFetchError(null);
      setAppliedQuery(term);
      try {
        const url = generateAPIUrl(`/api/search?${params.toString()}`);
        const response = await fetch(url, { method: "GET" });
        const rawJson = await response.json();

        if (!response.ok) {
          throw new Error(rawJson || "Failed to load listings");
        }
        const payload = rawJson as ListingsResponse;
        setTravelListings(payload.travellers ?? []);
        setShipmentListings(payload.shipments ?? []);
        setHasSearched(true);
      } catch (error) {
        console.error("Failed to search listings:", error);
        setHasSearched(false);
        setTravelListings([]);
        setShipmentListings([]);
        setFetchError(
          "Unable to load listings right now. Please try again soon."
        );
        setHasSearched(true);
      } finally {
        setIsFetching(false);
      }
    },
    []
  );

  const sortedTravellers = useMemo(
    () => sortByDepartureDate(travelListings),
    [travelListings]
  );
  const sortedShipments = useMemo(
    () => sortByDepartureDate(shipmentListings),
    [shipmentListings]
  );

  const filteredTravellers = useMemo(
    () => filterTravellers(sortedTravellers, appliedQuery),
    [sortedTravellers, appliedQuery]
  );
  const filteredShipments = useMemo(
    () => filterShipments(sortedShipments, appliedQuery),
    [sortedShipments, appliedQuery]
  );

  const results =
    segment === "routes" ? filteredTravellers : filteredShipments;

  return {
    segment,
    setSegment,
    isFetching,
    fetchError,
    hasSearched,
    appliedQuery,
    travelListings: filteredTravellers,
    shipmentListings: filteredShipments,
    results,
    performSearch,
  };
}

export function sortByDepartureDate(list: ListingRow[]) {
  return [...list].sort((a, b) => {
    const aDate = a.departure_date ? new Date(a.departure_date).getTime() : 0;
    const bDate = b.departure_date ? new Date(b.departure_date).getTime() : 0;
    return aDate - bDate;
  });
}

export function filterTravellers(list: ListingRow[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;
  return list.filter((traveller) => {
    const haystack = `${traveller.origin ?? ""} ${traveller.destination ?? ""} ${
      traveller.owner?.full_name ?? ""
    } ${traveller.description ?? ""}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

export function filterShipments(list: ListingRow[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return list;
  return list.filter((shipment) => {
    const haystack = `${shipment.title ?? ""} ${shipment.description ?? ""} ${
      shipment.origin ?? ""
    } ${shipment.destination ?? ""}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}
