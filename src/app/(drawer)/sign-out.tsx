import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignOutScreen() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        console.error("Error signing out:", error);
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      router.replace("/");
    } catch (caughtError) {
      console.error("Unexpected error while signing out:", caughtError);
      setErrorMessage(
        "Something went wrong while signing you out. Please try again."
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void handleSignOut();
  }, [handleSignOut]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ActivityIndicator size="large" animating={loading} />
      <Text style={styles.message}>
        {errorMessage ? "We couldn't sign you out." : "Signing you out..."}
      </Text>
      {errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  message: {
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    textAlign: "center",
    color: "#B00020",
  },
});
