import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { shipmentRequests, travellerListings } from '@/constants/mock-data';
import { useThemeColor } from '@/hooks/use-theme-color';

type SegmentKey = 'routes' | 'items';

type QuickFilter = {
  label: string;
  value: string;
  segment: SegmentKey;
};

const segments: { key: SegmentKey; label: string }[] = [
  { key: 'routes', label: 'Travellers' },
  { key: 'items', label: 'Shipments' },
];

const quickFilters: QuickFilter[] = [
  { label: 'JFK → ACC departures', value: 'JFK ACC', segment: 'routes' },
  { label: 'Urgent medical', value: 'medication', segment: 'items' },
  { label: 'Atlanta arrivals', value: 'Atlanta', segment: 'routes' },
  { label: 'Fashion samples', value: 'fashion', segment: 'items' },
];

export default function SearchScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#D6E1FB', dark: '#2A3045' },
    'background'
  );
  const inputBackground = useThemeColor(
    { light: '#FFFFFF', dark: '#1B1F2E' },
    'background'
  );

  const [segment, setSegment] = useState<SegmentKey>('routes');
  const [query, setQuery] = useState('');

  const sortedTravellers = useMemo(
    () =>
      [...travellerListings].sort(
        (a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
      ),
    []
  );

  const sortedShipments = useMemo(
    () =>
      [...shipmentRequests].sort(
        (a, b) => new Date(a.readyBy).getTime() - new Date(b.readyBy).getTime()
      ),
    []
  );

  const filteredTravellers = useMemo(() => filterTravellers(sortedTravellers, query), [query, sortedTravellers]);
  const filteredShipments = useMemo(() => filterShipments(sortedShipments, query), [query, sortedShipments]);

  const results = segment === 'routes' ? filteredTravellers : filteredShipments;
  const emptyMessage =
    segment === 'routes'
      ? 'No routes match this search yet. Try another airport code or departure date.'
      : 'No shipment posts match. Adjust item keywords or budget.';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#041834', dark: '#050E1E' }}
      headerImage={
        <IconSymbol
          name="magnifyingglass"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.heroCard, { borderColor }]}>
          <ThemedText type="title">Find your perfect match</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Search real travellers and shipment requests across the {'USA <-> Ghana'} corridor. Filter by
            route, item type, or urgency to start a trusted conversation.
          </ThemedText>

          <View style={[styles.searchField, { backgroundColor: inputBackground, borderColor }]}>
            <IconSymbol name="magnifyingglass" size={18} color={tintColor} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search airport, city, traveller, or item"
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              accessibilityLabel="Search routes and shipments"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <ThemedText style={[styles.clearText, { color: tintColor }]}>Clear</ThemedText>
              </Pressable>
            )}
          </View>

          <View style={styles.quickFilters}>
            {quickFilters.map((filter) => (
              <Pressable
                key={filter.label}
                onPress={() => {
                  setSegment(filter.segment);
                  setQuery(filter.value);
                }}
                style={[styles.filterChip, { backgroundColor: `${tintColor}15` }]}>
                <ThemedText style={[styles.filterChipText, { color: tintColor }]}>
                  {filter.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>

        <View style={styles.segmentRow}>
          {segments.map((item) => {
            const isActive = item.key === segment;
            return (
              <Pressable
                key={item.key}
                onPress={() => setSegment(item.key)}
                style={[
                  styles.segmentButton,
                  { borderColor },
                  isActive && { backgroundColor: tintColor, borderColor: tintColor },
                ]}>
                <ThemedText
                  style={[
                    styles.segmentLabel,
                    isActive ? styles.segmentLabelActive : undefined,
                  ]}>
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultsMeta}>
          <ThemedText type="subtitle">
            {results.length} {segment === 'routes' ? 'traveller' : 'shipment'}{' '}
            {results.length === 1 ? 'match' : 'matches'}
          </ThemedText>
          <ThemedText style={styles.resultsSubtitle}>
            Tap a card to review verification badges, connect, and agree on pricing terms.
          </ThemedText>
        </View>

        <View style={styles.resultsList}>
          {results.length === 0 ? (
            <ThemedView style={[styles.emptyState, { borderColor }]}>
              <IconSymbol name="magnifyingglass" size={24} color={tintColor} />
              <ThemedText style={styles.emptyHeadline}>No matches yet</ThemedText>
              <ThemedText style={styles.emptyBody}>{emptyMessage}</ThemedText>
            </ThemedView>
          ) : segment === 'routes' ? (
            results.map((listing) => (
              <RouteResultCard key={listing.id} listing={listing} tintColor={tintColor} borderColor={borderColor} />
            ))
          ) : (
            results.map((shipment) => (
              <ShipmentResultCard key={shipment.id} shipment={shipment} tintColor={tintColor} borderColor={borderColor} />
            ))
          )}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function filterTravellers(list: typeof travellerListings, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((traveller) => {
    const haystack = `${traveller.origin} ${traveller.destination} ${traveller.name} ${traveller.focus}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

function filterShipments(list: typeof shipmentRequests, query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((shipment) => {
    const haystack = `${shipment.itemName} ${shipment.summary} ${shipment.origin} ${shipment.destination}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

function RouteResultCard({
  listing,
  tintColor,
  borderColor,
}: Readonly<{
  listing: (typeof travellerListings)[number];
  tintColor: string;
  borderColor: string;
}>) {
  return (
    <ThemedView style={[styles.resultCard, { borderColor }]}>
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, { backgroundColor: `${tintColor}15` }]}>
          <IconSymbol name="airplane.circle.fill" size={20} color={tintColor} />
        </View>
        <View style={styles.resultHeaderText}>
          <ThemedText type="subtitle">
            {listing.origin} → {listing.destination}
          </ThemedText>
          <ThemedText style={styles.resultMetaText}>
            Departs {formatDate(listing.departureDate)} · {formatRelative(listing.departureDate)}
          </ThemedText>
        </View>
        <View style={[styles.pricePill, { backgroundColor: `${tintColor}12` }]}>
          <ThemedText style={[styles.pricePillText, { color: tintColor }]}>
            ${listing.pricePerKgUsd}/kg
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.resultBody}>{listing.focus}</ThemedText>
      <View style={styles.resultFooter}>
        <View style={styles.resultInfoRow}>
          <IconSymbol name="cube.box.fill" size={18} color={tintColor} />
          <ThemedText style={styles.resultInfoText}>
            {listing.availableKg}kg free of {listing.totalCapacityKg}kg capacity
          </ThemedText>
        </View>
        <View style={styles.badgeRow}>
          {listing.verification.slice(0, 2).map((badge) => (
            <View key={badge} style={[styles.badge, { backgroundColor: `${tintColor}12` }]}>
              <IconSymbol name="checkmark.seal.fill" size={14} color={tintColor} />
              <ThemedText style={[styles.badgeText, { color: tintColor }]}>{badge}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

function ShipmentResultCard({
  shipment,
  tintColor,
  borderColor,
}: Readonly<{
  shipment: (typeof shipmentRequests)[number];
  tintColor: string;
  borderColor: string;
}>) {
  return (
    <ThemedView style={[styles.resultCard, { borderColor }]}>
      <View style={styles.resultHeader}>
        <View style={[styles.resultIcon, { backgroundColor: `${tintColor}15` }]}>
          <IconSymbol name="cube.box.fill" size={20} color={tintColor} />
        </View>
        <View style={styles.resultHeaderText}>
          <ThemedText type="subtitle">{shipment.itemName}</ThemedText>
          <ThemedText style={styles.resultMetaText}>
            {shipment.origin} → {shipment.destination} · Ready {formatRelative(shipment.readyBy)}
          </ThemedText>
        </View>
        <View style={[styles.pricePill, { backgroundColor: `${tintColor}12` }]}>
          <ThemedText style={[styles.pricePillText, { color: tintColor }]}>
            Budget ${shipment.budgetUsd}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.resultBody}>{shipment.summary}</ThemedText>
      <View style={styles.resultFooter}>
        <View style={styles.resultInfoRow}>
          <IconSymbol name="clock.fill" size={18} color={tintColor} />
          <ThemedText style={styles.resultInfoText}>
            {shipment.weightKg}kg · {shipment.status === 'urgent' ? 'Needs fast match' : 'Matching'}
          </ThemedText>
        </View>
        <ThemedText style={styles.resultInfoText}>{shipment.handlingNotes}</ThemedText>
      </View>
    </ThemedView>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatRelative(value: string) {
  const target = new Date(value).getTime();
  const diff = target - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days < -1) {
    return `${Math.abs(days)} days ago`;
  }
  if (days === -1) {
    return 'Yesterday';
  }
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'In 1 day';
  }
  return `In ${days} days`;
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 56,
  },
  headerIcon: {
    bottom: -50,
    left: -30,
    position: 'absolute',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearText: {
    fontWeight: '600',
  },
  quickFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  segmentLabelActive: {
    color: '#fff',
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
  resultCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
  },
  resultBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  resultFooter: {
    gap: 10,
  },
  resultInfoRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  resultInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  emptyHeadline: {
    fontWeight: '700',
    fontSize: 18,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});