import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { shipmentRequests, travellerListings } from '@/constants/mock-data';
import { useThemeColor } from '@/hooks/use-theme-color';

import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';

const verifiedBadges = [
  'Government ID uploaded',
  'Flight itinerary verified',
  'Moderator reviewed',
];

export default function ProfileScreen() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#DCE3F8', dark: '#23283A' },
    'background'
  );
  
  const completedTrips = travellerListings.length;
  const itemsDelivered = shipmentRequests.filter((item) => item.status !== 'urgent').length + 6;
  
  const { profile } = useAuthContext();
  console.log(`Profile: ${JSON.stringify(profile)}`);
  const displayName = profile?.full_name ?? profile?.email ?? '';
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#021B35', dark: '#010A16' }}
      headerImage={
        <IconSymbol
          size={280}
          color="rgba(255,255,255,0.2)"
          name="person.crop.circle"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.headerCard, { borderColor }]}>
          <View>
            <Avatar size="lg">
              <AvatarFallbackText>{displayName}</AvatarFallbackText>
              <AvatarImage 
                  source={{
                  uri: session?.user.user_metadata.avatar_url ?? '',
              }}/>
              <AvatarBadge />
            </Avatar>
          </View>
          <View style={styles.headerText}>
            <ThemedText type="title">{displayName}</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Traveller · New York → Accra corridor</ThemedText>
            <View style={styles.headerMeta}>
              <IconSymbol name="checkmark.seal.fill" size={18} color={tintColor} />
              <ThemedText style={styles.headerMetaText}>Verified SpaceShare member</ThemedText>
            </View>
          </View>
        </ThemedView>

        <View style={styles.statsRow}>
          <ThemedView style={[styles.statCard, { backgroundColor: `${tintColor}12` }]}>
            <ThemedText type="subtitle" style={styles.statValue}>
              {completedTrips}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Trips shared</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statCard, { backgroundColor: `${tintColor}08` }]}>
            <ThemedText type="subtitle" style={styles.statValue}>
              {itemsDelivered}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Items delivered</ThemedText>
          </ThemedView>
        </View>

        <ThemedView style={[styles.sectionCard, { borderColor }]}>
          <ThemedText type="subtitle">Verification journey</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Every traveller completes a layered vetting flow to protect both parties across the
            SpaceShare community.
          </ThemedText>
          <View style={styles.badgeList}>
            {verifiedBadges.map((badge) => (
              <View key={badge} style={[styles.badge, { backgroundColor: `${tintColor}12` }]}>
                <IconSymbol name="checkmark.seal.fill" size={16} color={tintColor} />
                <ThemedText style={[styles.badgeText, { color: tintColor }]}>{badge}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={[styles.sectionCard, { borderColor }]}>
          <ThemedText type="subtitle">Preferences</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Ama prioritises sealed tech accessories, stable packaged foods, and personal care items
            with receipts. Fragile goods should include protective packaging.
          </ThemedText>
          <View style={styles.preferencesList}>
            <PreferenceItem
              icon="cube.box.fill"
              label="Max item weight"
              value="Up to 10kg per client"
            />
            <PreferenceItem
              icon="clock.fill"
              label="Preferred hand-off window"
              value="3 hours before boarding"
            />
            <PreferenceItem
              icon="paperplane.fill"
              label="Upcoming route"
              value="JFK → ACC · departs Apr 5"
            />
          </View>
        </ThemedView>

        <ThemedView style={[styles.sectionCard, { borderColor }]}>
          <ThemedText type="subtitle">Roadmap actions</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Coming soon: Ratings, instant identity checks, and end-to-end trip tracking alerts.
            Interested in beta testing? Join the pilot mailing list.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

function PreferenceItem({
  icon,
  label,
  value,
}: Readonly<{
  icon: Parameters<typeof IconSymbol>[0]['name'];
  label: string;
  value: string;
}>) {
  const tintColor = useThemeColor({}, 'tint');
  return (
    <View style={styles.preferenceItem}>
      <View style={[styles.preferenceIcon, { backgroundColor: `${tintColor}15` }]}>
        <IconSymbol name={icon} color={tintColor} size={18} />
      </View>
      <View style={styles.preferenceText}>
        <ThemedText style={styles.preferenceLabel}>{label}</ThemedText>
        <ThemedText style={styles.preferenceValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingBottom: 48,
  },
  headerIcon: {
    bottom: -70,
    left: -30,
    position: 'absolute',
  },
  headerCard: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.75,
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  headerMetaText: {
    fontSize: 13,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  statValue: {
    fontSize: 26,
  },
  statLabel: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.75,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  badgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  preferencesList: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  preferenceIcon: {
    padding: 12,
    borderRadius: 16,
  },
  preferenceText: {
    flex: 1,
    gap: 4,
  },
  preferenceLabel: {
    fontSize: 13,
    opacity: 0.7,
  },
  preferenceValue: {
    fontSize: 15,
    lineHeight: 20,
  },
});
