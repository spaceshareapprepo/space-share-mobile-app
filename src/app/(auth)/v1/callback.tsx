import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";

function parseHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  };
}

export default function AuthCallback() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const handled = useRef(false);

  useEffect(() => {
      WebBrowser.dismissBrowser();
    }, []);

  useEffect(() => {
    // Early return while loading
    if (isLoading) return;

    // Prevent multiple navigations
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
  }, [isLoggedIn, isLoading]);

  return (
    <>
      <ActivityIndicator />
      <ThemedView>
        <ThemedText style={{ marginTop: 16 }}>Completing sign-in...</ThemedText>
      </ThemedView>
    </>
  );
}
