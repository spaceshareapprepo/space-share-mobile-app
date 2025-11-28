import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ListingDetailsSkeleton } from "@/components/skeleton/listings-skeleton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { Button, ButtonText } from "@/components/ui/button";
import type {
  ListingMatch,
  ListingRow,
  SegmentKey,
} from "@/constants/types";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { fetchListing, fetchThread, createThread } from "@/lib/database/db";
import * as fn from "@/lib/utils";
import { supabase } from "@/lib/supabase"
import { HStack } from "@/components/ui/hstack";
import { FormControl } from "@/components/ui/form-control"


function isShipment(listing: ListingRow): boolean {
  return listing.type_of_listing === "shipment";
}

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

async function startConversation({
  listingId,
  buyerId,
  sellerId,
}: {
  listingId: string;
  buyerId: string | null;
  sellerId: string | null;
}): Promise<void> {
  try {
    const { data, error } = await supabase.auth.getUser();
    console.log(`User: ${JSON.stringify(data?.user?.id)}`)
    if (error || !data?.user) {
      router.navigate("/(auth)/sign-in");
      return;
    }

    if (!buyerId || !sellerId) {
      throw new Error("Invalid buyer or seller ID");
    }

    // Reuse existing thread between these parties for this listing
    const existing = await fetchThread({
      listingId,
      buyerId,
      sellerId,
    });

    // fetchThread returns a shape like { data: { id: ... }, error: null } or { data: [], error: Error }
    // Ensure data is not an array before accessing .id to satisfy TypeScript
    const existingThreadId =
      existing &&
      typeof existing === "object" &&
      "data" in existing &&
      existing.data &&
      !Array.isArray(existing.data)
        ? (existing.data as { id?: string }).id
        : undefined;

    const threadId =
      existingThreadId ??
      (await createThread({
        listingId,
        buyerId,
        sellerId,
      }));

    if (!threadId) {
      throw new Error("Unable to create or fetch thread");
    }

    router.navigate({
      pathname: "/(drawer)/(home)/chat/[id]",
      params: { id: threadId },
    });
  } catch (err) {
    console.error(`Failed to start conversation: ${err}`);
    // Handle error appropriately - show toast/alert or navigate to error page
  }
}

function TravellerSection({
  id,
  userId,
  ownerId,
  listing,
  tintColor,
  borderColor,
  cardBackground,
}: {
  id: string;
  userId: string | null;
  ownerId: string | undefined;
  listing: ListingMatch;
  tintColor: string;
  borderColor: string;
  cardBackground: string;
}) {
  const isOwner = userId === ownerId;
  return (
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
          <MetricCard
            label="Departure"
            value={fn.formatDate(listing.data.departure_date)}
            hint={fn.formatRelative(listing.data.departure_date)}
            hintColor={tintColor}
            borderColor={borderColor}
          />
          <MetricCard
            label="Space available"
            value={`${listing.data.max_weight_kg}kg`}
            hint={`of ${listing.data.max_weight_kg}kg total`}
            borderColor={borderColor}
          />
          <MetricCard
            label="Rate"
            value={`$${listing.data.price_per_unit}/kg`}
            hint="Fixed rate provided by traveller"
            borderColor={borderColor}
          />
        </View>
        <ThemedText style={styles.bodyText}>
          {listing.data.description}
        </ThemedText>
        {isOwner ? (
          <ThemedView>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/listings/edit/[id]",
                  params: { id },
                })
              }
            >
              <ButtonText>Edit</ButtonText>
            </Button>
          </ThemedView>
        ) : (
          <ThemedView>
            <HStack className="flex justify-end">
              <FormControl>
                <Button
                  onPress={() => {
                    if (!id) return;
                    startConversation({
                      listingId: id,
                      buyerId: userId,
                      sellerId: ownerId ?? null,
                    });
                  }}
                >
                  <ButtonText>Send a message</ButtonText>
                </Button>
              </FormControl>
            </HStack>
          </ThemedView>
        )}
      </ThemedView>
    </>
  );
}

function ShipmentSection({
  id,
  userId,
  ownerId,
  listing,
  tintColor,
  borderColor,
  cardBackground,
}: {
  id: string;
  userId: string | null;
  ownerId: string | undefined;
  listing: ListingMatch;
  tintColor: string;
  borderColor: string;
  cardBackground: string;
}) {
  const isOwner = userId === ownerId;
  return (
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
          <MetricCard
            label="Ready by"
            value={fn.formatDate(listing.data.departure_date)}
            hint={fn.formatRelative(listing.data.departure_date)}
            hintColor={tintColor}
            borderColor={borderColor}
          />
          <MetricCard
            label="Weight"
            value={`${listing.data.max_weight_kg}kg`}
            hint="Estimated package size"
            borderColor={borderColor}
          />
          <MetricCard
            label="Budget"
            value={`$${listing.data.price_per_unit}`}
            hint="Negotiable with sender"
            borderColor={borderColor}
          />
        </View>
        <ThemedText style={styles.bodyText}>
          {listing.data.description}
        </ThemedText>
      </ThemedView>
      {isOwner ? (
          <ThemedView>
            <Button
              onPress={() =>
                router.push({
                  pathname: "/listings/edit/[id]",
                  params: { id },
                })
              }
            >
              <ButtonText>Edit</ButtonText>
            </Button>
          </ThemedView>
        ) : (
          <ThemedView>
            <HStack className="flex justify-end">
              <FormControl>
                <Button
                  onPress={() => {
                    if (!id) return;
                    startConversation({
                      listingId: id,
                      buyerId: userId,
                      sellerId: ownerId ?? null,
                    });
                  }}
                >
                  <ButtonText>Send a message</ButtonText>
                </Button>
              </FormControl>
            </HStack>
          </ThemedView>
        )}
    </>
  );
}

function MetricCard({
  label,
  value,
  hint,
  hintColor,
  borderColor,
}: {
  label: string;
  value: string;
  hint: string;
  hintColor?: string;
  borderColor: string;
}) {
  return (
    <View style={[styles.metricCard, { borderColor }]}>
      <ThemedText style={styles.metricLabel}>{label}</ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
      <ThemedText
        style={[styles.metricHint, hintColor && { color: hintColor }]}
      >
        {hint}
      </ThemedText>
    </View>
  );
}

export default function ListingDetailsScreen() {
  const { session } = useAuthContext();
  const [loading, setLoading] = useState(true);

  const userId = session?.user?.id ?? null;

  const params = useLocalSearchParams<{
    id?: string | string[];
    segment?: SegmentKey | SegmentKey[];
  }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [cachedListing, setCachedListing] = useState<ListingRow | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCached() {
      if (!id) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);
        const cached = await AsyncStorage.getItem(`listing:${id}`);

        if (cached) {
          if (isMounted) {
            setCachedListing(JSON.parse(cached));
            setLoading(false);
          }
          return;
        }

        const { data } = await fetchListing(id);
        const remoteListing = Array.isArray(data) ? data[0] : data;

        if (remoteListing && isMounted) {
          setCachedListing(remoteListing as unknown as ListingRow);
          await AsyncStorage.setItem(
            `listing:${id}`,
            JSON.stringify(remoteListing)
          );
        }
      } catch (err) {
        console.warn("Failed to load cached listing", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCached();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const listing: ListingMatch | null = cachedListing
  ? { type: isShipment(cachedListing) ? "shipment" : "traveller", data: cachedListing }
  : null;

  const ownerId = listing?.data.owner?.id

  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#1F2937" },
    "background"
  );
  const cardBackground = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background"
  );

  const headerTitle = listing?.data.owner?.full_name;
  const heroInitials = fn.getInitials(String(listing?.data.owner?.full_name));
  const heroRoute =
    listing?.type === "traveller" || listing?.type === "shipment"
      ? `${listing?.data.origin?.name} -> ${listing?.data.destination?.name}`
      : "";

  const heroMeta =
    listing?.type === "traveller"
      ? `Departs ${fn.formatDate(listing.data.departure_date)} · ${fn.formatRelative(
          listing.data.departure_date
        )}`
      : listing?.type === "shipment"
        ? `Ready ${fn.formatDate(listing.data.departure_date)} · ${fn.formatRelative(
            listing.data.departure_date
          )}`
        : "";

  const statusLabel =
    listing?.type === "traveller"
      ? listing.data.is_verified === true
        ? "Closing soon"
        : "Open for offers"
      : listing?.type === "shipment"
        ? listing.data.is_verified === true
          ? "Urgent match"
          : "Matching"
        : "";

  const headerIcon =
    listing?.type === "shipment" ? "cube.box.fill" : "airplane.circle.fill";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: headerTitle || "Listing" }} />
        <ListingDetailsSkeleton />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `${headerTitle}` }} />
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
                    Requested by {listing?.data.owner?.full_name || "Unknown Sender"}
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
          ) : null }

          {listing?.type === "traveller" ? (
            <TravellerSection
              id={listing.data.id}
              userId={userId}
              ownerId={ownerId}
              listing={listing}
              tintColor={tintColor}
              borderColor={borderColor}
              cardBackground={cardBackground}
            />
          ) : null}

          {listing?.type === "shipment" ? (
            <ShipmentSection
              id={listing.data.id}
              userId={userId}
              ownerId={ownerId}
              listing={listing}
              tintColor={tintColor}
              borderColor={borderColor}
              cardBackground={cardBackground}
            />
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
});
