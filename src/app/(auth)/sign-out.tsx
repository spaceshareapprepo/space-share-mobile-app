import { ThemedText } from '@/components/themed-text';
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";

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
    <>
      <ActivityIndicator size="large" animating={loading} />
      <ThemedText className="text-16">
        {errorMessage ? "We couldn't sign you out." : "Signing you out..."}
      </ThemedText>
      {errorMessage && (
        <ThemedText className="text-14 text-center text-[#B00020]">{errorMessage}</ThemedText>
      )}
    </>
  );
}
