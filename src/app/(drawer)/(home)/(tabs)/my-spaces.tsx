import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/src/components/parallax-scroll-view';
import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { shipmentRequests, travellerListings } from '@/src/constants/mock-data';
import { useThemeColor } from '@/src/hooks/use-theme-color';

type SegmentKey = 'shipped' | 'offeredSpace';

export default function MyShipmentsScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#D8E2FA', dark: '#242A3D' },
    'background'
  );

  const [segment, setSegment] = useState<SegmentKey>('shipped');

  const shippedItems = useMemo(
    () =>
      shipmentRequests.map((shipment) => ({
        ...shipment,
        fulfillment:
          shipment.status === 'urgent' ? 'Awaiting traveller acceptance' : 'Matching in progress',
      })),
    []
  );

  const offeredSpaces = useMemo(
    () =>
      travellerListings.map((listing) => ({
        ...listing,
        commitments:
          listing.status === 'closingSoon'
            ? 'Finalising matches'
            : 'Accepting new requests',
      })),
    []
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#03162F', dark: '#040B18' }}
      headerImage={
        <IconSymbol
          name="cube.box.fill"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.heroCard, { borderColor }]}>
          <View style={styles.heroHeader}>
            <ThemedText type="title">My Shipments</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Track posted items, monitor traveller commitments, and prepare safe hand-offs across
              the {'USA <-> Ghana'} corridor.
            </ThemedText>
          </View>
          <View style={styles.heroStats}>
            <StatBlock
              icon="cube.box.fill"
              value={shippedItems.length}
              label="Active shipment posts"
              tintColor={tintColor}
            />
            <StatBlock
              icon="airplane.circle.fill"
              value={offeredSpaces.length}
              label="Trips offering space"
              tintColor={tintColor}
            />
          </View>
        </ThemedView>

        <View style={[styles.segmentedControl, { borderColor }]}>
          {segments.map((option) => {
            const isActive = option.key === segment;
            return (
              <Pressable
                key={option.key}
                onPress={() => setSegment(option.key)}
                style={[
                  styles.segmentButton,
                  isActive && { backgroundColor: tintColor },
                ]}>
                <ThemedText
                  style={[
                    styles.segmentLabel,
                    isActive ? styles.segmentLabelActive : undefined,
                  ]}>
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {segment === 'shipped' ? (
          <View style={styles.list}>
            {shippedItems.map((shipment) => (
              <ThemedView key={shipment.id} style={[styles.card, { borderColor }]}>
                <View style={[styles.avatar, { backgroundColor: `${tintColor}15` }]}>
                  <IconSymbol name="cube.box.fill" color={tintColor} size={18} />
                </View>
                <View style={styles.cardBody}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    {shipment.itemName}
                  </ThemedText>
                  <ThemedText style={styles.cardRoute}>
                    {shipment.origin} → {shipment.destination}
                  </ThemedText>
                  <ThemedText style={styles.cardDetail}>
                    {shipment.weightKg}kg · budget ${shipment.budgetUsd}
                  </ThemedText>
                  <ThemedText style={styles.cardMetaText}>
                    Ready {formatRelative(shipment.readyBy)}
                  </ThemedText>
                </View>
                <View style={styles.cardTagColumn}>
                  <StatusTag
                    label={shipment.status === 'urgent' ? 'High priority' : 'Matching'}
                    tone={shipment.status === 'urgent' ? 'warning' : 'info'}
                  />
                  <StatusTag label={shipment.fulfillment} tone="neutral" />
                </View>
              </ThemedView>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {offeredSpaces.map((listing) => (
              <ThemedView key={listing.id} style={[styles.card, { borderColor }]}>
                <View style={[styles.avatar, { backgroundColor: `${tintColor}15` }]}>
                  <IconSymbol name="airplane.circle.fill" color={tintColor} size={18} />
                </View>
                <View style={styles.cardBody}>
                  <ThemedText type="subtitle" style={styles.cardTitle}>
                    {listing.origin} → {listing.destination}
                  </ThemedText>
                  <ThemedText style={styles.cardDetail}>
                    {listing.availableKg}kg free of {listing.totalCapacityKg}kg
                  </ThemedText>
                  <ThemedText style={styles.cardMetaText}>
                    Departs {formatDate(listing.departureDate)}
                  </ThemedText>
                  <ThemedText style={styles.cardMetaText}>{listing.focus}</ThemedText>
                </View>
                <View style={styles.cardTagColumn}>
                  <StatusTag
                    label={listing.status === 'closingSoon' ? 'Closing soon' : 'Taking requests'}
                    tone={listing.status === 'closingSoon' ? 'warning' : 'success'}
                  />
                  <StatusTag label={listing.commitments} tone="neutral" />
                </View>
              </ThemedView>
            ))}
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const segments: { key: SegmentKey; label: string }[] = [
  { key: 'shipped', label: 'Shipped Items' },
  { key: 'offeredSpace', label: 'Offered Spaces' },
];

type StatusTone = 'warning' | 'success' | 'info' | 'neutral';

function StatusTag({ label, tone }: Readonly<{ label: string; tone: StatusTone }>) {
  const palette = {
    warning: { backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#F97316' },
    success: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#0F766E' },
    info: { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563EB' },
    neutral: { backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#475569' },
  }[tone];

  return (
    <View style={[styles.statusTag, { backgroundColor: palette.backgroundColor }]}>
      <ThemedText style={[styles.statusTagText, { color: palette.color }]}>{label}</ThemedText>
    </View>
  );
}

function StatBlock({
  icon,
  value,
  label,
  tintColor,
}: Readonly<{
  icon: Parameters<typeof IconSymbol>[0]['name'];
  value: number;
  label: string;
  tintColor: string;
}>) {
  return (
    <View style={[styles.statBlock, { backgroundColor: `${tintColor}12` }]}>
      <IconSymbol name={icon} color={tintColor} size={20} />
      <ThemedText type="subtitle" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
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
    paddingBottom: 48,
  },
  headerIcon: {
    bottom: -60,
    left: -35,
    position: 'absolute',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 18,
  },
  heroHeader: {
    gap: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  segmentedControl: {
    borderWidth: 1,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  segmentLabelActive: {
    color: '#fff',
  },
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
  },
  cardRoute: {
    fontSize: 14,
    opacity: 0.75,
  },
  cardDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardMetaText: {
    fontSize: 13,
    opacity: 0.75,
  },
  cardTagColumn: {
    gap: 8,
    minWidth: 140,
  },
  statusTag: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statBlock: {
    borderRadius: 18,
    padding: 16,
    gap: 6,
    minWidth: 150,
  },
  statValue: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
});