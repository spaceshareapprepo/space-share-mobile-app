import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/src/components/parallax-scroll-view';
import { ThemedText } from '@/src/components/themed-text';
import { ThemedView } from '@/src/components/themed-view';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { shipmentRequests, travellerListings } from '@/src/constants/mock-data';
import { useThemeColor } from '@/src/hooks/use-theme-color';

export default function PublishScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#D9E2F9', dark: '#252B3E' },
    'background'
  );
  const bannerBackground = useThemeColor(
    { light: '#F2F6FF', dark: '#151B2A' },
    'background'
  );

  const nextDeparture = useMemo(() => travellerListings[0], []);
  const urgentShipment = useMemo(
    () => shipmentRequests.find((shipment) => shipment.status === 'urgent'),
    []
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#041937', dark: '#050F1E' }}
      headerImage={
        <IconSymbol
          name="plus.circle.fill"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.heroCard, { backgroundColor: bannerBackground, borderColor }]}>
          <View style={styles.heroHeader}>
            <ThemedText type="title">Publish to the marketplace</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Share your extra luggage space or post an item you need hand-delivered between the {'USA <-> Ghana'} corridor. Drafts auto-save and moderators review high-risk items within 30 minutes.
            </ThemedText>
          </View>
          <View style={styles.heroActions}>
            <ActionButton
              icon="airplane.circle.fill"
              title="I have space"
              description="Post your route, departure date, and price per kg."
              tintColor={tintColor}
            />
            <ActionButton
              icon="cube.box.fill"
              title="I have an item"
              description="Upload photos, declare the value, and set your budget."
              tintColor={tintColor}
              outlined
            />
          </View>
          <View style={styles.heroFooter}>
            <IconSymbol name="checkmark.seal.fill" color={tintColor} size={18} />
            <ThemedText style={styles.heroFooterText}>
              Safety-first: ID verification, document uploads, and escrow (roadmap) protect both
              sides.
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.section}>
          <ThemedText type="subtitle">Quick-start templates</ThemedText>
          <View style={styles.templateList}>
            <TemplateCard
              icon="airplane.circle.fill"
              title={`${nextDeparture.origin} → ${nextDeparture.destination}`}
              subtitle={`Departs ${formatDate(nextDeparture.departureDate)} · ${nextDeparture.pricePerKgUsd}/kg`}
              details={[
                `${nextDeparture.availableKg}kg free of ${nextDeparture.totalCapacityKg}kg`,
                nextDeparture.focus,
              ]}
              actionLabel="Continue traveller draft"
              tintColor={tintColor}
              borderColor={borderColor}
            />
            {urgentShipment ? (
              <TemplateCard
                icon="cube.box.fill"
                title={urgentShipment.itemName}
                subtitle={`${urgentShipment.origin} → ${urgentShipment.destination}`}
                details={[
                  `Ready ${formatRelative(urgentShipment.readyBy)}`,
                  `${urgentShipment.weightKg}kg · budget $${urgentShipment.budgetUsd}`,
                ]}
                actionLabel="Finish shipment details"
                tintColor={tintColor}
                borderColor={borderColor}
                highlighted
              />
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Compliance checklist</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Reduce back-and-forth by providing complete documentation. SpaceShare validates each
            step before your post goes live.
          </ThemedText>
          <View style={styles.checklist}>
            {checklistItems.map((item) => (
              <ChecklistItem key={item.title} item={item} tintColor={tintColor} />
            ))}
          </View>
        </View>

        <ThemedView style={[styles.sectionCard, { borderColor }]}>
          <ThemedText type="subtitle">Coming soon</ThemedText>
          <View style={styles.roadmapList}>
            <RoadmapItem
              icon="megaphone.fill"
              tintColor={tintColor}
              title="Boosted listings"
              description="Promote urgent trips or shipments to reach verified matches faster."
            />
            <RoadmapItem
              icon="bell.fill"
              tintColor={tintColor}
              title="Smart alerts"
              description="Automated notifications when a match aligns with your draft criteria."
            />
          </View>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

type ActionButtonProps = Readonly<{
  icon: Parameters<typeof IconSymbol>[0]['name'];
  title: string;
  description: string;
  tintColor: string;
  outlined?: boolean;
}>;

function ActionButton({ icon, title, description, tintColor, outlined }: ActionButtonProps) {
  return (
    <Pressable
      style={[
        styles.actionButton,
        outlined
          ? { borderColor: tintColor, backgroundColor: `${tintColor}12`, borderWidth: 1 }
          : { backgroundColor: tintColor },
      ]}>
      <View style={[styles.actionIcon, { backgroundColor: outlined ? '#fff0' : 'rgba(255,255,255,0.15)' }]}>
        <IconSymbol name={icon} size={20} color={outlined ? tintColor : '#fff'} />
      </View>
      <ThemedText
        style={[
          styles.actionTitle,
          outlined ? { color: tintColor } : { color: '#fff' },
        ]}>
        {title}
      </ThemedText>
      <ThemedText
        style={[
          styles.actionDescription,
          outlined ? { color: tintColor, opacity: 0.8 } : { color: 'rgba(255,255,255,0.85)' },
        ]}>
        {description}
      </ThemedText>
    </Pressable>
  );
}

type TemplateCardProps = Readonly<{
  icon: Parameters<typeof IconSymbol>[0]['name'];
  title: string;
  subtitle: string;
  details: string[];
  actionLabel: string;
  tintColor: string;
  borderColor: string;
  highlighted?: boolean;
}>;

function TemplateCard({
  icon,
  title,
  subtitle,
  details,
  actionLabel,
  tintColor,
  borderColor,
  highlighted,
}: TemplateCardProps) {
  return (
    <ThemedView
      style={[
        styles.templateCard,
        { borderColor },
        highlighted ? { borderColor: tintColor, backgroundColor: `${tintColor}10` } : null,
      ]}>
      <View style={[styles.templateIcon, { backgroundColor: `${tintColor}15` }]}>
        <IconSymbol name={icon} color={tintColor} size={20} />
      </View>
      <View style={styles.templateText}>
        <ThemedText type="subtitle" style={styles.templateTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.templateSubtitle}>{subtitle}</ThemedText>
        {details.map((detail) => (
          <ThemedText key={detail} style={styles.templateDetail}>
            • {detail}
          </ThemedText>
        ))}
      </View>
      <Pressable style={[styles.templateAction, { backgroundColor: tintColor }]}>
        <ThemedText style={styles.templateActionLabel}>{actionLabel}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

type ChecklistItemType = {
  title: string;
  description: string;
};

const checklistItems: ChecklistItemType[] = [
  {
    title: 'Verify your identity',
    description: 'Upload government ID, selfie, and a live check of your travel document.',
  },
  {
    title: 'Detail the contents',
    description: 'Describe each item, include receipts or prescriptions, and declare the value.',
  },
  {
    title: 'Confirm drop-off & pick-up',
    description: 'List safe meeting points in the USA and Ghana. SpaceShare suggests vetted hubs.',
  },
  {
    title: 'Set pricing & contingencies',
    description: 'Define price per kg, insurance add-ons, and Plan B for delays.',
  },
];

function ChecklistItem({ item, tintColor }: { item: ChecklistItemType; tintColor: string }) {
  return (
    <View style={styles.checklistItem}>
      <View style={[styles.checklistBullet, { backgroundColor: `${tintColor}15` }]}>
        <IconSymbol name="checkmark.seal.fill" color={tintColor} size={16} />
      </View>
      <View style={styles.checklistText}>
        <ThemedText style={styles.checklistTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.checklistDescription}>{item.description}</ThemedText>
      </View>
    </View>
  );
}

type RoadmapItemProps = {
  icon: Parameters<typeof IconSymbol>[0]['name'];
  title: string;
  description: string;
  tintColor: string;
};

function RoadmapItem({ icon, title, description, tintColor }: RoadmapItemProps) {
  return (
    <View style={styles.roadmapItem}>
      <View style={[styles.roadmapIcon, { backgroundColor: `${tintColor}18` }]}>
        <IconSymbol name={icon} color={tintColor} size={18} />
      </View>
      <View style={styles.roadmapText}>
        <ThemedText style={styles.roadmapTitle}>{title}</ThemedText>
        <ThemedText style={styles.roadmapDescription}>{description}</ThemedText>
      </View>
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
    gap: 28,
    paddingBottom: 56,
  },
  headerIcon: {
    bottom: -60,
    left: -40,
    position: 'absolute',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  heroHeader: {
    gap: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroFooterText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    flex: 1,
    minWidth: 150,
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: 16,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  templateList: {
    gap: 16,
  },
  templateCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 18,
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateText: {
    gap: 6,
  },
  templateTitle: {
    fontSize: 18,
  },
  templateSubtitle: {
    fontSize: 14,
    opacity: 0.75,
  },
  templateDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  templateAction: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  templateActionLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  checklist: {
    gap: 14,
  },
  checklistItem: {
    flexDirection: 'row',
    gap: 12,
  },
  checklistBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistText: {
    flex: 1,
    gap: 4,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  checklistDescription: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  roadmapList: {
    gap: 14,
  },
  roadmapItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  roadmapIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadmapText: {
    flex: 1,
    gap: 4,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  roadmapDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});