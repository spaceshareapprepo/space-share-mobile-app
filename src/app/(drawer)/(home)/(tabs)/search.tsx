import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ShipmentResultCard } from "@/components/listings/shipment-result-card";
import { RouteResultCard } from "@/components/listings/traveller-result-card";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { ShipmentRequest, TravellerListing } from "@/constants/mock-data";
import { useThemeColor } from "@/hooks/use-theme-color";

import type {
  ListingsResponse,
  QuickFilter,
  SearchSegment,
  SegmentKey,
} from "@/constants/types";

const segments: { key: SegmentKey; label: string }[] = [
  { key: "routes", label: "Travellers" },
  { key: "items", label: "Shipments" },
];

const quickFilters: QuickFilter[] = [
  { label: "JFK → ACC departures", value: "JFK", segment: "routes" },
  { label: "Urgent medical", value: "medication", segment: "items" },
  { label: "Atlanta arrivals", value: "ATL", segment: "routes" },
  { label: "Fashion samples", value: "fashion", segment: "items" },
];

async function fetchListingsData(
  searchTerm: string,
  segment: SearchSegment = "all"
): Promise<ListingsResponse> {
  const params = new URLSearchParams();
  const trimmed = searchTerm.trim();

  if (trimmed.length > 0) {
    params.set("q", trimmed);
  }

  params.set("segment", segment);

  const response = await fetch(`/search?${params.toString()}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load listings");
  }

  return (await response.json()) as ListingsResponse;
}

function getDefaultEmptyMessage(
  segment: SegmentKey,
  appliedQuery: string
): string {
  if (segment === "routes") {
    if (appliedQuery) {
      return `No travellers match "${appliedQuery}". Try another airport code, name, or date.`;
    }

    return "No traveller listings yet. Try a different search.";
  }

  if (appliedQuery) {
    return `No shipments match "${appliedQuery}". Adjust the item keywords or origin.`;
  }

  return "No shipment requests yet. Try searching with another filter.";
}

export default function SearchScreen() {
  const [travelListings, setTravelListings] = useState<TravellerListing[]>([]);
  const [shipmentListings, setShipmentListings] = useState<ShipmentRequest[]>(
    []
  );
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState("");

  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#D6E1FB", dark: "#2A3045" },
    "background"
  );
  const inputBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#1B1F2E" },
    "background"
  );

  const [segment, setSegment] = useState<SegmentKey>("routes");
  const [query, setQuery] = useState("");

  const performSearch = useCallback(
    async (searchTerm?: string, segmentOverride: SearchSegment = "all") => {
      const term = (searchTerm ?? query).trim();

      setIsFetching(true);
      setFetchError(null);
      setAppliedQuery(term);

      try {
        const response = await fetchListingsData(term, segmentOverride);
        setTravelListings(response.travellers ?? []);
        setShipmentListings(response.shipments ?? []);
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
    [query]
  );

  const sortedTravellers = useMemo(
    () =>
      [...travelListings].sort(
        (a, b) =>
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
      ),
    [travelListings]
  );

  const sortedShipments = useMemo(
    () =>
      [...shipmentListings].sort(
        (a, b) => new Date(a.readyBy).getTime() - new Date(b.readyBy).getTime()
      ),
    [shipmentListings]
  );

  // This sets the hasSearch to false that hides the result section
  useEffect(() => {
    if (query.length === 0) {
      setHasSearched(false);
    }
  }, [query]);

  const filteredTravellers = useMemo(
    () => filterTravellers(sortedTravellers, appliedQuery),
    [query, sortedTravellers]
  );
  const filteredShipments = useMemo(
    () => filterShipments(sortedShipments, appliedQuery),
    [query, sortedShipments]
  );

  const isRoutesSegment = segment === "routes";
  const results = isRoutesSegment ? filteredTravellers : filteredShipments;
  const defaultEmptyMessage = getDefaultEmptyMessage(segment, appliedQuery);
  const emptyMessage = fetchError ?? defaultEmptyMessage;

  const renderResults = () => {
    if (isFetching) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={tintColor} />
          <ThemedText style={styles.loadingText}>
            Loading listings...
          </ThemedText>
        </View>
      );
    }

    if (results.length === 0) {
      return (
        <ThemedView style={[styles.emptyState, { borderColor }]}>
          <IconSymbol name="magnifyingglass" size={24} color={tintColor} />
          <ThemedText style={styles.emptyHeadline}>No matches yet</ThemedText>
          <ThemedText style={styles.emptyBody}>{emptyMessage}</ThemedText>
        </ThemedView>
      );
    }

    if (isRoutesSegment) {
      return filteredTravellers.map((listing) => (
        <RouteResultCard
          key={listing.id}
          listing={listing}
          tintColor={tintColor}
          borderColor={borderColor}
        />
      ));
    }

    return filteredShipments.map((shipment) => (
      <ShipmentResultCard
        key={shipment.id}
        shipment={shipment}
        tintColor={tintColor}
        borderColor={borderColor}
      />
    ));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#041834", dark: "#050E1E" }}
      headerImage={
        <IconSymbol
          name="magnifyingglass"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.heroCard, { borderColor }]}>
          <ThemedText type="title">Find your perfect match</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Search real travellers and shipment requests across the{" "}
            {"USA <-> Ghana"} corridor. Filter by route, item type, or urgency
            to start a trusted conversation.
          </ThemedText>

          <View
            style={[
              styles.searchField,
              { backgroundColor: inputBackground, borderColor },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={18} color={tintColor} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => void performSearch()}
              returnKeyType="search"
              placeholder="Search airport, city, traveller, or item"
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              accessibilityLabel="Search routes and shipments"
              submitBehavior="blurAndSubmit"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => void performSearch()}>
                <ThemedText style={[styles.clearText, { color: tintColor }]}>
                  Search
                </ThemedText>
              </Pressable>) : null}
          </View>

          <View style={[styles.quickFilters]}>
            {quickFilters.map((filter) => (
              <Pressable
                key={filter.label}
                onPress={() => {
                  setSegment(filter.segment);
                  setQuery(filter.value);
                  void performSearch(filter.value, filter.segment);
                }}
                style={[
                  styles.filterChip,
                  { backgroundColor: `${tintColor}15` },
                ]}
              >
                <ThemedText
                  style={[styles.filterChipText, { color: tintColor }]}
                >
                  {filter.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>
        {hasSearched && (
          <>
            <View style={[styles.segmentedControl, { borderColor }]}>
              {segments.map((item) => {
                const isActive = item.key === segment;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setSegment(item.key)}
                    style={[
                      styles.segmentButton,
                      isActive && { backgroundColor: tintColor },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.segmentLabel,
                        isActive ? styles.segmentLabelActive : undefined,
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.resultsMeta}>
              <ThemedText type="subtitle">
                {results.length}{" "}
                {segment === "routes" ? "traveller" : "shipment"}{" "}
                {results.length === 1 ? "match" : "matches"}
              </ThemedText>
              <ThemedText style={styles.resultsSubtitle}>
                Tap a card to review verification badges, connect, and agree on
                pricing terms.
              </ThemedText>
            </View>
            <View style={styles.resultsList}>{renderResults()}</View>
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

function filterTravellers(list: TravellerListing[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((traveller) => {
    const haystack =
      `${traveller.origin} ${traveller.destination} ${traveller.name} ${traveller.focus}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

function filterShipments(list: ShipmentRequest[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((shipment) => {
    const haystack =
      `${shipment.itemName} ${shipment.summary} ${shipment.origin} ${shipment.destination}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 56,
  },
  headerIcon: {
    bottom: -50,
    left: -30,
    position: "absolute",
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  searchField: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearText: {
    fontWeight: "600",
  },
  quickFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  segmentedControl: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  segmentLabelActive: {
    color: "#fff",
  },
  resultsMeta: {
    gap: 6,
  },
  resultsSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultsList: {
    gap: 16,
  },
  loadingState: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  resultCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  resultHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultHeaderText: {
    flex: 1,
    gap: 4,
  },
  resultMetaText: {
    fontSize: 13,
    opacity: 0.7,
  },
  pricePill: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pricePillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  resultBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  resultFooter: {
    gap: 10,
  },
  resultInfoRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  resultInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    gap: 10,
    alignItems: "flex-start",
  },
  emptyHeadline: {
    fontWeight: "700",
    fontSize: 18,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
