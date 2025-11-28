import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ListingRow } from "@/constants/types";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useMyListingsQuery } from "@/hooks/user-my-listings-query";
import * as fn from "@/lib/utils";
import { router } from 'expo-router';

const segments = [
  { key: "shipped", label: "Shipped Items" },
  { key: "offeredSpace", label: "Offered Spaces" },
] as const;
type SegmentKey = (typeof segments)[number]["key"];

export default function MyShipmentsScreen() {
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#D8E2FA", dark: "#242A3D" },
    "background"
  );

  const { session, isLoading, profile } = useAuthContext();
  // const [user, setUser] = useState<string | null | undefined>(null);
  const [segment, setSegment] = useState<SegmentKey>("shipped");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingRow[]>([]);

  const ownerId = useMemo(
    () => session?.user?.id ?? profile?.id ?? null,
    [session?.user?.id, profile?.id]
  );

  useEffect(() => {
    let isMounted = true;
    if (!ownerId || isLoading) return; // wait for auth to hydrate

    async function loadListings() {
      setLoading(true);
      setError(null);

      
      try {
        const { data, error: dbError } = await useMyListingsQuery({ ownerId: ownerId });

        if (dbError) throw dbError;
        if (isMounted) setListings((data as unknown as ListingRow[]) ?? []);
      } catch (err) {
        if (isMounted) setError("Could not load your listings. Pull to refresh or try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadListings();
    return () => {
      isMounted = false;
    };
  }, [ownerId, isLoading]);

  const shippedItems = useMemo(
    () => listings.filter((item) => item.type_of_listing === "shipment"),
    [listings]
  );

  const offeredSpaces = useMemo(
    () => listings.filter((item) => item.type_of_listing === "travel"),
    [listings]
  );

  const handlePress = (id:string, segment: string) =>
    router.navigate({
      pathname: "/listings/[id]",
      params: {
        id,
        segment,
      },
    });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#03162F", dark: "#040B18" }}
      headerImage={
        <IconSymbol
          name="cube.box.fill"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.heroCard, { borderColor }]}>
          <View style={styles.heroHeader}>
            <ThemedText type="title">My Shared Spaces</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Track posted items, monitor traveller commitments, and prepare safe hand-offs across
              the {'USA <-> Ghana'} corridor.
            </ThemedText>
          </View>
          <View style={styles.heroStats}>
            <StatBlock
              icon="cube.box.fill"
              value={shippedItems.length}
              label="My shipment posts"
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
                style={[styles.segmentButton, isActive && { backgroundColor: tintColor }]}
              >
                <ThemedText
                  style={[styles.segmentLabel, isActive ? styles.segmentLabelActive : undefined]}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {loading ? (
          <ThemedView style={{ padding: 16, gap: 8, alignItems: "center" }}>
            <ActivityIndicator />
            <ThemedText>Loading your listings...</ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView style={{ padding: 16, gap: 8 }}>
            <ThemedText>{error}</ThemedText>
          </ThemedView>
        ) : segment === "shipped" ? (
          <View style={styles.list}>
            {shippedItems.length === 0 ? (
              <ThemedText>No shipment posts yet.</ThemedText>
            ) : (
              shippedItems.map((shipment) => (
                <Pressable 
                  key={shipment.id}
                  onPress={() => handlePress(shipment.id, "shipment")}
                  accessibilityRole="button"
                  accessibilityLabel={`View shipment ${shipment.title}`}
                >
                  <ThemedView key={shipment.id} style={[styles.card, { borderColor }]}>
                    <View style={[styles.avatar, { backgroundColor: `${tintColor}15` }]}>
                      <IconSymbol name="cube.box.fill" color={tintColor} size={18} />
                    </View>
                    <View style={styles.cardBody}>
                      <ThemedText type="subtitle" style={styles.cardTitle}>
                        {shipment.title || "Untitled shipment"}
                      </ThemedText>
                      <ThemedText style={styles.cardRoute}>
                        {`${shipment.origin?.city ?? ""} (${shipment.origin?.iata_code ?? ""})`} to {`${shipment.destination?.city ?? ""} (${shipment.destination?.iata_code ?? ""})`}
                      </ThemedText>
                      <ThemedText style={styles.cardDetail}>
                        {shipment.max_weight_kg ?? ""}kg - budget ${shipment.price_per_unit ?? ""}{" "}
                        {shipment.currency_code ?? ""}
                      </ThemedText>
                      <ThemedText style={styles.cardMetaText}>
                        Ready {fn.formatRelative(shipment.departure_date || "")}
                      </ThemedText>
                    </View>
                    <View style={styles.cardTagColumn}>
                      <StatusTag
                        label={shipment.shipment_code === "urgent" ? "High priority" : "Matching"}
                        tone={shipment.shipment_code === "urgent" ? "warning" : "info"}
                      />
                      <StatusTag label="Awaiting matches" tone="neutral" />
                    </View>
                  </ThemedView>
                </Pressable>
              ))
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {offeredSpaces.length === 0 ? (
              <ThemedText>No travel listings yet.</ThemedText>
            ) : (
              offeredSpaces.map((listing) => (
                <Pressable
                  key={listing.id}
                  onPress={() => handlePress(listing.id, "traveller")}
                  accessibilityRole="button"
                  accessibilityLabel={`View offered spaces ${listing.title}`}
                >
                  <ThemedView key={listing.id} style={[styles.card, { borderColor }]}>
                    <View style={[styles.avatar, { backgroundColor: `${tintColor}15` }]}>
                      <IconSymbol name="airplane.circle.fill" color={tintColor} size={18} />
                    </View>
                    <View style={styles.cardBody}>
                      <ThemedText type="subtitle" style={styles.cardTitle}>
                        {listing.title}
                      </ThemedText>
                      <ThemedText style={styles.cardDetail}>
                        {listing.max_weight_kg ?? ""}kg free
                      </ThemedText>
                      <ThemedText style={styles.cardMetaText}>
                        Departs {fn.formatDate(listing.departure_date || "")}
                      </ThemedText>
                      <ThemedText style={styles.cardMetaText}>
                        Price ${listing.price_per_unit ?? ""} {listing.currency_code ?? ""}
                      </ThemedText>
                    </View>
                    <View style={styles.cardTagColumn}>
                      <StatusTag
                        label={listing.shipment_code === "matching" ? "Closing soon" : "Taking requests"}
                        tone={listing.shipment_code === "matching" ? "warning" : "success"}
                      />
                      <StatusTag label="Accepting new requests" tone="neutral" />
                    </View>
                  </ThemedView>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

type StatusTone = "warning" | "success" | "info" | "neutral";

function StatusTag({ label, tone }: Readonly<{ label: string; tone: StatusTone }>) {
  const palette = {
    warning: { backgroundColor: "rgba(249, 115, 22, 0.15)", color: "#F97316" },
    success: { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#0F766E" },
    info: { backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#2563EB" },
    neutral: { backgroundColor: "rgba(148, 163, 184, 0.15)", color: "#475569" },
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
  icon: Parameters<typeof IconSymbol>[0]["name"];
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

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 48,
  },
  headerIcon: {
    bottom: -60,
    left: -35,
    position: "absolute",
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
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
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
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
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
