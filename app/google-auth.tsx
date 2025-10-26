import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function GoogleAuthCallback() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const navigatedRef = useRef(false);

  useEffect(() => {
    WebBrowser.dismissBrowser();
  }, []);

  useEffect(() => {
    if (navigatedRef.current) {
      return;
    }

    if (isLoggedIn) {
      navigatedRef.current = true;
      router.replace("/(tabs)");
      return;
    }

    if (!isLoading) {
      navigatedRef.current = true;
      router.replace("/sign-in");
    }
  }, [isLoggedIn, isLoading]);

  const message = isLoading
    ? "Completing Google sign-in..."
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
