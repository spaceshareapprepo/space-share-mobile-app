import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { ShipmentRequest } from '@/constants/types';
import { formatRelative } from '@/lib/utils';
import { StyleSheet, View } from 'react-native';

export function ShipmentResultCard({
  shipment,
  tintColor,
  borderColor,
}: Readonly<{
  shipment: ShipmentRequest;
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