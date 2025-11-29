import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { SegmentedControl } from "@/components/segmented-control";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useThreads } from "@/hooks/use-threads-query";
import type { ThreadRow } from "@/constants/types";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useRouter } from "expo-router";
import { Avatar, AvatarFallbackText, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

type SegmentKey = "messages" | "notifications";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  icon: Parameters<typeof IconSymbol>[0]["name"];
  accent: "info" | "success" | "warning";
};

export default function InboxScreen() {
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#D9E3FB", dark: "#232940" },
    "background"
  );
  const mutedCard = useThemeColor(
    { light: "#F2F6FF", dark: "#181D2C" },
    "background"
  );

  const router = useRouter();
  const [segment, setSegment] = useState<SegmentKey>("messages");
  const { userId, isLoading: authLoading } = useRequireAuth();
  const { threads, isLoading: threadsLoading } = useThreads(userId ?? undefined);
  const isLoading = authLoading || threadsLoading;

  const notifications = useMemo<NotificationItem[]>(
    () => [
      {
        id: "notif-match",
        title: "New match found",
        body: "Kwame Danso is a strong fit for your Dallas to Accra item request.",
        timestamp: "5m ago",
        icon: "bell.fill",
        accent: "success",
      },
      {
        id: "notif-escrow",
        title: "Escrow beta invitation",
        body: "Help us test milestone payouts on your upcoming JFK to ACC trip.",
        timestamp: "1h ago",
        icon: "megaphone.fill",
        accent: "info",
      },
      {
        id: "notif-deadline",
        title: "Departure reminder",
        body: "Upload your boarding pass at least 12 hours before take-off.",
        timestamp: "1d ago",
        icon: "clock.fill",
        accent: "warning",
      },
    ],
    []
  );

  if (isLoading) {
    return null;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#06183A", dark: "#050E1E" }}
      headerImage={
        <IconSymbol
          name="tray.full.fill"
          size={260}
          color="rgba(255,255,255,0.25)"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView
          style={[styles.heroCard, { backgroundColor: mutedCard, borderColor }]}
        >
          <View style={styles.heroHeader}>
            <ThemedText type="title">Inbox</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Monitor traveller chats, shipment requests, and SpaceShare updates
              from one feed.
            </ThemedText>
          </View>
          <View style={styles.heroHighlights}>
            <Highlight
              icon="bubble.left.and.bubble.right.fill"
              label="Encrypted messaging"
            />
            <Highlight icon="checkmark.seal.fill" label="Moderator support" />
            <Highlight icon="bell.fill" label="Smart notifications roadmap" />
          </View>
        </ThemedView>

        <SegmentedControl
          options={segments}
          value={segment}
          onChange={setSegment}
          tintColor={tintColor}
          borderColor={borderColor}
        />

        {segment === "messages" ? (
          <View style={styles.list}>
            {threads.map((thread) => {
              const counterpartName =
                thread.buyer?.full_name ??
                thread.seller?.full_name ??
                "Unknown user";
              const listingTitle = thread.listing?.title ?? "Untitled listing";
              const updatedAt = formatDate(thread.updated_at);
              return (
                <Pressable
                  key={thread.id}
                  accessibilityLabel="Go to chat"
                  onPress={
                    () => router.navigate(
                      {pathname: "/chat/[id]",
                      params: { id: thread.id }})
                  }
                >
                  <ThemedView style={[styles.card, { borderColor }]}>
                    <ThemedView>
                      <Avatar>
                        <AvatarFallbackText>
                          {thread.buyer?.full_name}
                        </AvatarFallbackText>
                        <AvatarImage
                          source={{
                            uri: thread.buyer?.avatar_url!,
                          }}
                        />
                        <AvatarBadge />
                      </Avatar>
                    </ThemedView>
                    <View style={styles.cardBody}>
                      <ThemedText type="subtitle" style={styles.cardTitle}>
                        {listingTitle}
                      </ThemedText>
                      <ThemedText style={styles.cardSubtitle}>
                        {counterpartName}
                      </ThemedText>
                      <ThemedText style={styles.cardPreview} numberOfLines={2}>
                        {listingTitle}
                      </ThemedText>
                    </View>
                    <View style={styles.cardMeta}>
                      <ThemedText style={styles.cardTimestamp}>
                        {updatedAt}
                      </ThemedText>
                    </View>
                  </ThemedView>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((notification) => (
              <ThemedView
                key={notification.id}
                style={[styles.notificationCard, { borderColor }]}
              >
                <View
                  style={[styles.notificationIcon, accentStyles(notification.accent)]}
                >
                  <IconSymbol
                    name={notification.icon}
                    size={18}
                    color={accentStyles(notification.accent).color}
                  />
                </View>
                <View style={styles.notificationBody}>
                  <ThemedText type="subtitle" style={styles.notificationTitle}>
                    {notification.title}
                  </ThemedText>
                  <ThemedText style={styles.notificationText}>
                    {notification.body}
                  </ThemedText>
                </View>
                <ThemedText style={styles.notificationTimestamp}>
                  {notification.timestamp}
                </ThemedText>
              </ThemedView>
            ))}
          </View>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const segments: { key: SegmentKey; label: string }[] = [
  { key: "messages", label: "Messages" },
  { key: "notifications", label: "Notifications" },
];

function accentStyles(accent: NotificationItem["accent"]) {
  switch (accent) {
    case "success":
      return { backgroundColor: "rgba(34,197,94,0.15)", color: "#22C55E" };
    case "warning":
      return { backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316" };
    default:
      return { backgroundColor: "rgba(59,130,246,0.15)", color: "#2563EB" };
  }
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
  heroHighlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
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
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 16,
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  cardPreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    alignItems: "flex-end",
    gap: 8,
  },
  cardTimestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  unreadPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  notificationCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBody: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 16,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationTimestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  highlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

function Highlight({
  icon,
  label,
}: {
  icon: Parameters<typeof IconSymbol>[0]["name"];
  label: string;
}) {
  const tintColor = useThemeColor({}, "tint");
  return (
    <View style={[styles.highlight, { backgroundColor: `${tintColor}15` }]}>
      <IconSymbol name={icon} size={14} color={tintColor} />
      <ThemedText style={[styles.highlightText, { color: tintColor }]}>
        {label}
      </ThemedText>
    </View>
  );
}
