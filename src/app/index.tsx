import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import ActivityIndicatorComponent from "@/components/activity-indicator";

function withAlpha(hexColor: string, alpha: number) {
  const sanitized = hexColor.replace("#", "");
  const full =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => char + char)
          .join("")
      : sanitized.padEnd(6, "0").slice(0, 6);

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function LandingScreen() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuthContext();
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const haloColor = withAlpha(tint, 0.22);
  const haloAccent = withAlpha(tint, 0.16);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <ActivityIndicatorComponent />
    );
  }

  return (
    <ThemedView safeArea style={styles.container}>
      <View style={[styles.halo, { backgroundColor: haloColor }]} />
      <View style={[styles.haloSmall, { backgroundColor: haloAccent }]} />
      <View style={styles.content}>
        <ThemedText style={[styles.kicker, { color: tint }]}>
          SpaceShare
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Move anything, faster.
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Connect with trusted travellers, ship essentials the same week, and
          track every step along the way.
        </ThemedText>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Go to sign in"
            onPress={() => router.push("/(auth)/sign-in")}
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: tint },
            ]}
          >
            <ThemedText style={[styles.buttonLabel, styles.primaryLabel]}>
              Sign in
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityLabel="Go to sign up"
            onPress={() => router.push("/(auth)/sign-up")}
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: tint },
            ]}
          >
            <ThemedText style={[styles.buttonLabel, { color: tint }]}>
              Create account
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 520,
    gap: 18,
    alignItems: "flex-start",
  },
  halo: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    top: -140,
    right: -120,
    opacity: 0.8,
  },
  haloSmall: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    bottom: -120,
    left: -140,
    opacity: 0.6,
  },
  kicker: {
    fontSize: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primaryButton: {
    borderColor: "transparent",
  },
  secondaryButton: {
    backgroundColor: "transparent",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  primaryLabel: {
    color: "#0B1021",
  },
});
