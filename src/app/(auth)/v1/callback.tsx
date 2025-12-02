import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ThemedText } from "@/components/themed-text";

function parseHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  };
}

export default function AuthCallback() {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const { access_token, refresh_token } = parseHash();
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) console.error("setSession failed", error);
          router.replace("/");
        });
    } else {
      router.replace("/sign-in");
    }
  }, []);

  return (
    <>
      <ActivityIndicator />
      <ThemedText style={{ marginTop: 16 }}>
        Completing sign-in...
      </ThemedText>
    </>
  );
}
