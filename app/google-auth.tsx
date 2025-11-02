import { useAuthContext } from "@/hooks/use-auth-context";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoogleAuthCallback() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const navigatedRef = useRef(false);

  useEffect(() => {
    WebBrowser.dismissBrowser();
  }, []);

  useEffect(() => {
    // Early return while loading
    if (isLoading) return;

    // Prevent multiple navigations
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    // Navigate based on auth state
    if (isLoggedIn) {
      router.replace("/");
    } else {
      router.replace("/sign-in");
    }
  }, [isLoggedIn, isLoading]);

  const message = isLoading
    ? "Completing Google sign-in..."
    : isLoggedIn
    ? "Redirecting you to the app..."
    : "Redirecting to sign-in...";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{message}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});
