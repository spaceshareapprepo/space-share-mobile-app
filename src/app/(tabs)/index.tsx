import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ShipmentResultCard } from "@/components/listings/shipment-result-card";
import { RouteResultCard } from "@/components/listings/traveller-result-card";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { SegmentedControl } from "@/components/segmented-control";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useListingsSearch } from "@/hooks/use-listings-search";
import { useThemeColor } from "@/hooks/use-theme-color";

import type { QuickFilter, SearchSegment, SegmentKey } from "@/constants/types";
import ActivityIndicatorComponent from "@/components/activity-indicator";
import SearchComponent from "@/components/listings/search-hero";
import SearchFilterComponent from "@/components/listings/search-filter";
import ResultsHeader from "@/components/listings/results-count";
import SearchResultCard from "@/components/listings/search-result-card";
import { travellers } from "@/constants/mock-data";

const segments: { key: SegmentKey; label: string }[] = [
  { key: "routes", label: "Travellers" },
  { key: "items", label: "Shipments" },
];

const quickFilters: QuickFilter[] = [
  { label: "JFK to ACC departures", value: "JFK", segment: "routes" },
  { label: "Urgent medical", value: "medication", segment: "items" },
  { label: "LAX to ACC departures", value: "LAX", segment: "routes" },
  { label: "Fashion samples", value: "fashion", segment: "items" },
];

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
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#D6E1FB", dark: "#2A3045" },
    "background"
  );
  const inputBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#1B1F2E" },
    "background"
  );
  const [query, setQuery] = useState("");
  const {
    segment,
    setSegment,
    isFetching,
    fetchError,
    hasSearched,
    appliedQuery,
    travelListings,
    shipmentListings,
    results,
    performSearch,
  } = useListingsSearch();

  const triggerSearch = useCallback(
    (term?: string, segmentOverride: SearchSegment = "all") => {
      void performSearch(term ?? query, segmentOverride);
    },
    [performSearch, query]
  );

  const isRoutesSegment = segment === "routes";
  const defaultEmptyMessage = getDefaultEmptyMessage(segment, appliedQuery);
  const emptyMessage = fetchError ?? defaultEmptyMessage;

  const renderResults = () => {
    if (isFetching) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicatorComponent />
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
      return travelListings.map((listing) => (
        <RouteResultCard
          key={listing.id}
          listing={listing}
          tintColor={tintColor}
          borderColor={borderColor}
        />
      ));
    }
    return shipmentListings.map((shipment) => (
      <ShipmentResultCard
        key={shipment.id}
        shipment={shipment}
        tintColor={tintColor}
        borderColor={borderColor}
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* New Components - START */}
      <SearchComponent />
      <SearchFilterComponent
        options={segments}
        value={segment}
        onChange={setSegment}
      />
      <ResultsHeader resultCount={3} onSortPress={() => setQuery} />
      {travellers.map((traveller) => (
        <SearchResultCard key={traveller.id} traveller={traveller as any} />
      ))}
      {/* New Components - END */}
    </ScrollView>
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#041834", dark: "#050E1E" }}
    //   headerImage={
    //     <IconSymbol
    //       name="magnifyingglass"
    //       size={260}
    //       color="rgba(255,255,255,0.25)"
    //       style={styles.headerIcon}
    //     />
    //   }
    // >
    //   <ThemedView style={styles.container}>
    //     <ThemedView style={[styles.heroCard, { borderColor }]}>
    //       <ThemedText type="title">Find your perfect match</ThemedText>
    //       <ThemedText style={styles.heroSubtitle}>
    //         Search real travellers and shipment requests across the USA to Ghana
    //         corridor. Filter by route, item type, or urgency to start a trusted
    //         conversation.
    //       </ThemedText>
    //       <ThemedView
    //         style={[
    //           styles.searchField,
    //           { backgroundColor: inputBackground, borderColor },
    //         ]}
    //       >
    //         <IconSymbol name="magnifyingglass" size={18} color={tintColor} />
    //         <TextInput
    //           value={query}
    //           onChangeText={setQuery}
    //           onSubmitEditing={() => triggerSearch()}
    //           returnKeyType="search"
    //           placeholder="Search ..."
    //           placeholderTextColor={tintColor}
    //           style={[
    //             styles.searchInput,
    //             { color: tintColor, fontSize: 18, outline: "none" },
    //           ]}
    //           accessibilityLabel="Search routes and shipments"
    //           submitBehavior="blurAndSubmit"
    //         />
    //         <Pressable onPress={() => triggerSearch()}>
    //           <ThemedText style={[styles.clearText, { color: tintColor }]}>
    //             Search
    //           </ThemedText>
    //         </Pressable>
    //       </ThemedView>
    //       <ThemedView style={[styles.quickFilters]}>
    //         {quickFilters.map((filter) => (
    //           <Pressable
    //             key={filter.label}
    //             onPress={() => {
    //               setSegment(filter.segment);
    //               setQuery(filter.value);
    //               triggerSearch(filter.value, filter.segment);
    //             }}
    //             style={[
    //               styles.filterChip,
    //               { backgroundColor: `${tintColor}15` },
    //             ]}
    //           >
    //             <ThemedText
    //               style={[styles.filterChipText, { color: tintColor }]}
    //             >
    //               {filter.label}
    //             </ThemedText>
    //           </Pressable>
    //         ))}
    //       </ThemedView>
    //     </ThemedView>
    //     {hasSearched && (
    //       <>
    //         <SegmentedControl
    //           options={segments}
    //           value={segment}
    //           onChange={setSegment}
    //           tintColor={tintColor}
    //           borderColor={borderColor}
    //         />
    //         <ThemedView style={styles.resultsMeta}>
    //           <ThemedText type="subtitle">
    //             {`${results.length} ${
    //               segment === "routes" ? "traveller" : "shipment"
    //             } ${results.length === 1 ? "match" : "matches"}`}
    //           </ThemedText>
    //           <ThemedText style={styles.resultsSubtitle}>
    //             Tap a card to review verification badges, connect, and agree on
    //             pricing terms.
    //           </ThemedText>
    //         </ThemedView>
    //         <ThemedView style={styles.resultsList}>
    //           {renderResults()}
    //         </ThemedView>
    //       </>
    //     )}
    //   </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB" 
  },
  headerIcon: { bottom: -50, left: -30, position: "absolute" },
  heroCard: { borderRadius: 24, borderWidth: 1, padding: 22, gap: 16 },
  heroSubtitle: { fontSize: 15, lineHeight: 22 },
  searchField: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 0,
  },
  clearText: { fontWeight: "600" },
  quickFilters: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  filterChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  resultsMeta: { gap: 6 },
  resultsSubtitle: { fontSize: 14, lineHeight: 20 },
  resultsList: { gap: 16 },
  loadingState: { alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14 },
  resultCard: { borderRadius: 22, borderWidth: 1, padding: 18, gap: 12 },
  resultHeader: { flexDirection: "row", gap: 12, alignItems: "center" },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultHeaderText: { flex: 1, gap: 4 },
  resultMetaText: { fontSize: 13, opacity: 0.7 },
  pricePill: { borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  pricePillText: { fontSize: 13, fontWeight: "600" },
  resultBody: { fontSize: 15, lineHeight: 22 },
  resultFooter: { gap: 10 },
  resultInfoRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  resultInfoText: { fontSize: 14, lineHeight: 20 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    gap: 10,
    alignItems: "flex-start",
  },
  emptyHeadline: { fontWeight: "700", fontSize: 18 },
  emptyBody: { fontSize: 14, lineHeight: 20, opacity: 0.8 },
});
