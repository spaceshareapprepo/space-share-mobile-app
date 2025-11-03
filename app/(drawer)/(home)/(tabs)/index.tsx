import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ShipmentResultCard } from '@/components/listings/shipment-result-card';
import { RouteResultCard } from '@/components/listings/traveller-result-card';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ShipmentRequest, TravellerListing } from '@/constants/mock-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { getInitials } from "@/lib/utils";

import type { RawListingRow, RelatedAirport } from "@/constants/types";

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
  const [travelListings, setTravelListings] = useState<TravellerListing[]>([]);
  const [shipmentListings, setShipmentListings] = useState<ShipmentRequest[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      setIsFetching(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          type_of_listing,
          status_code,
          shipment_code,
          flight_date,
          max_weight_kg,
          price_per_unit,
          currency_code,
          photos,
          is_verified,
          created_at,
          owner:profiles!listings_owner_id_profiles_id_fk (
            id,
            full_name,
            bucket_avatar_url
          ),
          origin:airports!listings_origin_id_airports_id_fk (
            id,
            city,
            name,
            iata_code
          ),
          destination:airports!listings_destination_id_airports_id_fk (
            id,
            city,
            name,
            iata_code
          )
        `)
        .order('created_at', { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error('Failed to fetch listings', error);
        setFetchError('Unable to load listings right now. Please try again soon.');
        setTravelListings([]);
        setShipmentListings([]);
      } else if (data) {
        console.log(data);
        const rows = (data as unknown as RawListingRow[]) ?? [];

        const travel = rows
          .filter((row) => row.type_of_listing === 'travel')
          .map(mapToTravellerListing);

        const shipments = rows
          .filter((row) => row.type_of_listing === 'shipment')
          .map(mapToShipmentRequest);

        setTravelListings(travel);
        setShipmentListings(shipments);
      }

      setIsFetching(false);
    };

    void loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedTravellers = useMemo(
    () =>
      [...travelListings].sort(
        (a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
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

  const filteredTravellers = useMemo(() => filterTravellers(sortedTravellers, query), [query, sortedTravellers]);
  const filteredShipments = useMemo(() => filterShipments(sortedShipments, query), [query, sortedShipments]);

  const results = segment === 'routes' ? filteredTravellers : filteredShipments;
  const defaultEmptyMessage =
    segment === 'routes'
      ? 'No routes match this search yet. Try another airport code or departure date.'
      : 'No shipment posts match. Adjust item keywords or budget.';
  const emptyMessage = fetchError ?? defaultEmptyMessage;

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
          {isFetching ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={tintColor} />
              <ThemedText style={styles.loadingText}>Loading listings...</ThemedText>
            </View>
          ) : results.length === 0 ? (
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

function mapToTravellerListing(row: RawListingRow): TravellerListing {
  const name = row.owner?.full_name?.trim() || row.title?.trim() || 'Traveller';
  const departure = row.flight_date ?? row.created_at ?? new Date().toISOString();
  const capacity = row.max_weight_kg ?? 0;

  return {
    id: row.id,
    name,
    initials: getInitials(name),
    origin: formatAirport(row.origin),
    destination: formatAirport(row.destination),
    departureDate: departure,
    availableKg: capacity,
    totalCapacityKg: capacity,
    pricePerKgUsd: row.price_per_unit ?? 0,
    status: mapTravelStatus(row.status_code),
    verification: row.is_verified ? ['ID verified'] : [],
    experience: row.owner ? 'Trusted community member' : 'New traveller',
    focus: row.description ?? 'Ready to help move your items safely.',
  };
}

function mapToShipmentRequest(row: RawListingRow): ShipmentRequest {
  const ownerName = row.owner?.full_name?.trim() || 'Anonymous sender';
  const readyBy = row.flight_date ?? row.created_at ?? new Date().toISOString();

  return {
    id: row.id,
    owner: ownerName,
    initials: getInitials(ownerName),
    itemName: row.title ?? 'Shipment request',
    summary: row.description ?? 'Details to be confirmed with the sender.',
    origin: formatAirport(row.origin),
    destination: formatAirport(row.destination),
    readyBy,
    weightKg: row.max_weight_kg ?? 0,
    budgetUsd: row.price_per_unit ?? 0,
    status: mapShipmentStatus(row.shipment_code),
    handlingNotes:
      row.shipment_code === 'urgent'
        ? 'Sender marked this request as urgent. Please coordinate quickly.'
        : 'Coordinate handling details directly with the sender.',
  };
}

function formatAirport(airport: RelatedAirport | null) {
  if (!airport) {
    return 'Unknown location';
  }

  const city = airport.city ?? airport.name ?? 'Unknown location';
  const code = airport.iata_code ?? '';

  return code ? `${city} (${code})` : city;
}

function mapTravelStatus(statusCode: string | null): TravellerListing['status'] {
  return statusCode === '1' ? 'closingSoon' : 'open';
}

function mapShipmentStatus(code: string | null): ShipmentRequest['status'] {
  return code === 'urgent' ? 'urgent' : 'matching';
}

function filterTravellers(list: TravellerListing[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((traveller) => {
    const haystack = `${traveller.origin} ${traveller.destination} ${traveller.name} ${traveller.focus}`.toLowerCase();
    return haystack.includes(trimmed);
  });
}

function filterShipments(list: ShipmentRequest[], query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return list;
  }
  return list.filter((shipment) => {
    const haystack = `${shipment.itemName} ${shipment.summary} ${shipment.origin} ${shipment.destination}`.toLowerCase();
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
  loadingState: {
    alignItems: 'center',
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
