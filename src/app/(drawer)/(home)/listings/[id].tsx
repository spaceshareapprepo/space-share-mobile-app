import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { shipmentRequests, travellerListings } from "@/src/constants/mock-data";
import type {
  SegmentKey,
  ShipmentRequest,
  TravellerListing,
} from "@/src/constants/types";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { formatDate, formatRelative } from "@/src/lib/utils";

type ListingMatch =
  | { type: "traveller"; data: TravellerListing }
  | { type: "shipment"; data: ShipmentRequest };

type SectionIcon =
  | "airplane.circle.fill"
  | "cube.box.fill"
  | "clock.fill"
  | "checkmark.seal.fill"
  | "magnifyingglass";

function SectionHeader({
  icon,
  tintColor,
  title,
}: Readonly<{
  icon: SectionIcon;
  tintColor: string;
  title: string;
}>) {
  return (
    <View style={styles.sectionHeader}>
      <IconSymbol name={icon} size={18} color={tintColor} />
      <ThemedText style={styles.sectionHeaderText}>{title}</ThemedText>
    </View>
  );
}

export default function ListingDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    segment?: SegmentKey | SegmentKey[];
  }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const segmentParam = Array.isArray(params.segment)
    ? params.segment[0]
    : params.segment;
  const segment: SegmentKey | null =
    segmentParam === "routes" || segmentParam === "items" ? segmentParam : null;

    console.log(segment)
  const listing = useMemo<ListingMatch | null>(() => {
    if (!id) {
      return null;
    }

    if (segment === "routes") {
      const match = travellerListings.find((item) => item.id === id);
      if (match) {
        return { type: "traveller", data: match };
      }
    }

    if (segment === "items") {
      const match = shipmentRequests.find((item) => item.id === id);
      if (match) {
        return { type: "shipment", data: match };
      }
    }

    const fallbackTraveller = travellerListings.find((item) => item.id === id);
    if (fallbackTraveller) {
      return { type: "traveller", data: fallbackTraveller };
    }

    const fallbackShipment = shipmentRequests.find((item) => item.id === id);
    if (fallbackShipment) {
      return { type: "shipment", data: fallbackShipment };
    }

    return null;
  }, [id, segment]);

  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#1F2937" },
    "background"
  );
  const cardBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background"
  );

  const headerTitle =
    listing?.type === "traveller"
      ? listing.data.name
      : listing?.type === "shipment"
      ? listing.data.itemName
      : "Listing";

  const heroInitials =
    listing?.type === "traveller"
      ? listing.data.initials
      : listing?.type === "shipment"
      ? listing.data.initials
      : "--";

  const heroRoute =
    listing?.type === "traveller" || listing?.type === "shipment"
      ? `${listing.data.origin} -> ${listing.data.destination}`
      : "";

  const heroMeta =
    listing?.type === "traveller"
      ? `Departs ${formatDate(listing.data.departureDate)} · ${formatRelative(
          listing.data.departureDate
        )}`
      : listing?.type === "shipment"
      ? `Ready ${formatDate(listing.data.readyBy)} · ${formatRelative(
          listing.data.readyBy
        )}`
      : "";

  const statusLabel =
    listing?.type === "traveller"
      ? listing.data.status === "closingSoon"
        ? "Closing soon"
        : "Open for offers"
      : listing?.type === "shipment"
      ? listing.data.status === "urgent"
        ? "Urgent match"
        : "Matching"
      : "";

  const headerIcon =
    listing?.type === "shipment" ? "cube.box.fill" : "airplane.circle.fill";

  return (
    <>
      <Stack.Screen options={{ title: headerTitle }} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#041834", dark: "#050E1E" }}
        headerImage={
          <IconSymbol
            name={headerIcon}
            size={220}
            color="rgba(255,255,255,0.2)"
            style={styles.headerIcon}
          />
        }
      >
        <ThemedView style={styles.container}>
          <ThemedView
            style={[
              styles.heroCard,
              { borderColor, backgroundColor: cardBackground },
            ]}
          >
            <View style={styles.heroHeader}>
              <View
                style={[styles.avatar, { backgroundColor: `${tintColor}15` }]}
              >
                <ThemedText style={[styles.avatarText, { color: tintColor }]}>
                  {heroInitials}
                </ThemedText>
              </View>
              <View style={styles.heroText}>
                <ThemedText type="title">{headerTitle}</ThemedText>
                {heroRoute ? (
                  <ThemedText style={styles.heroSubtitle}>
                    {heroRoute}
                  </ThemedText>
                ) : null}
                {heroMeta ? (
                  <ThemedText style={styles.heroMeta}>{heroMeta}</ThemedText>
                ) : null}
                {listing?.type === "shipment" ? (
                  <ThemedText style={styles.heroCaption}>
                    Requested by {listing.data.owner}
                  </ThemedText>
                ) : null}
              </View>
            </View>
            {statusLabel ? (
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: `${tintColor}12` },
                  ]}
                >
                  <ThemedText style={[styles.statusText, { color: tintColor }]}>
                    {statusLabel}
                  </ThemedText>
                </View>
              </View>
            ) : null}
          </ThemedView>

          {!listing ? (
            <ThemedView
              style={[
                styles.sectionCard,
                { borderColor, backgroundColor: cardBackground },
              ]}
            >
              <SectionHeader
                icon="magnifyingglass"
                tintColor={tintColor}
                title="Listing unavailable"
              />
              <ThemedText style={styles.bodyText}>
                We could not find a listing matching that identifier. Please
                return to results and try again.
              </ThemedText>
            </ThemedView>
          ) : null}

          {listing?.type === "traveller" ? (
            <>
              <ThemedView
                style={[
                  styles.sectionCard,
                  { borderColor, backgroundColor: cardBackground },
                ]}
              >
                <SectionHeader
                  icon="airplane.circle.fill"
                  tintColor={tintColor}
                  title="Trip overview"
                />
                <View style={styles.metricGrid}>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>
                      Departure
                    </ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {formatDate(listing.data.departureDate)}
                    </ThemedText>
                    <ThemedText
                      style={[styles.metricHint, { color: tintColor }]}
                    >
                      {formatRelative(listing.data.departureDate)}
                    </ThemedText>
                  </View>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>
                      Space available
                    </ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {listing.data.availableKg}kg
                    </ThemedText>
                    <ThemedText style={styles.metricHint}>
                      of {listing.data.totalCapacityKg}kg total
                    </ThemedText>
                  </View>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>Rate</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      ${listing.data.pricePerKgUsd}/kg
                    </ThemedText>
                    <ThemedText style={styles.metricHint}>
                      Fixed rate provided by traveller
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.bodyText}>
                  {listing.data.focus}
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={[
                  styles.sectionCard,
                  { borderColor, backgroundColor: cardBackground },
                ]}
              >
                <SectionHeader
                  icon="checkmark.seal.fill"
                  tintColor={tintColor}
                  title="Trust signals"
                />
                {listing.data.verification.length > 0 ? (
                  <View style={styles.badgeRow}>
                    {listing.data.verification.map((badge) => (
                      <View
                        key={badge}
                        style={[
                          styles.badge,
                          { backgroundColor: `${tintColor}12` },
                        ]}
                      >
                        <IconSymbol
                          name="checkmark.seal.fill"
                          size={14}
                          color={tintColor}
                        />
                        <ThemedText
                          style={[styles.badgeText, { color: tintColor }]}
                        >
                          {badge}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <ThemedText style={styles.helperText}>
                    This traveller has not shared verification badges yet. Start
                    a chat to learn more.
                  </ThemedText>
                )}
                <ThemedText style={styles.bodyText}>
                  {listing.data.experience}
                </ThemedText>
              </ThemedView>
            </>
          ) : null}

          {listing?.type === "shipment" ? (
            <>
              <ThemedView
                style={[
                  styles.sectionCard,
                  { borderColor, backgroundColor: cardBackground },
                ]}
              >
                <SectionHeader
                  icon="cube.box.fill"
                  tintColor={tintColor}
                  title="Item details"
                />
                <View style={styles.metricGrid}>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>Ready by</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {formatDate(listing.data.readyBy)}
                    </ThemedText>
                    <ThemedText
                      style={[styles.metricHint, { color: tintColor }]}
                    >
                      {formatRelative(listing.data.readyBy)}
                    </ThemedText>
                  </View>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>Weight</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      {listing.data.weightKg}kg
                    </ThemedText>
                    <ThemedText style={styles.metricHint}>
                      Estimated package size
                    </ThemedText>
                  </View>
                  <View style={[styles.metricCard, { borderColor }]}>
                    <ThemedText style={styles.metricLabel}>Budget</ThemedText>
                    <ThemedText style={styles.metricValue}>
                      ${listing.data.budgetUsd}
                    </ThemedText>
                    <ThemedText style={styles.metricHint}>
                      Negotiable with sender
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.bodyText}>
                  {listing.data.summary}
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={[
                  styles.sectionCard,
                  { borderColor, backgroundColor: cardBackground },
                ]}
              >
                <SectionHeader
                  icon="clock.fill"
                  tintColor={tintColor}
                  title="Handling notes"
                />
                <ThemedText style={styles.bodyText}>
                  {listing.data.handlingNotes}
                </ThemedText>
              </ThemedView>
            </>
          ) : null}
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 48,
  },
  headerIcon: {
    bottom: -40,
    left: -10,
    position: "absolute",
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  heroHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  heroMeta: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  heroCaption: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  statusRow: {
    flexDirection: "row",
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  sectionHeaderText: {
    fontWeight: "700",
    fontSize: 16,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    minWidth: "45%",
  },
  metricLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  metricHint: {
    fontSize: 13,
    opacity: 0.7,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
});
