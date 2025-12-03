import ActivityIndicatorComponent from "@/components/activity-indicator";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";

function parseHash() {
  const params = new URLSearchParams(globalThis.location.hash.slice(1));
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  };
}

export default function AuthCallback() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const navigationRef = useRef(false);

  useEffect(() => {
      WebBrowser.dismissBrowser();
    }, []);

  useEffect(() => {
    // Early return while loading
    if (isLoading) return;

    // Prevent multiple navigations
    if (navigationRef.current) return;
    navigationRef.current = true;

    const { access_token, refresh_token } = parseHash();
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }: { error: any }) => {
          if (error) console.error("setSession failed", error);
          router.replace("/(tabs)");
        });
    } else {
      router.replace("/sign-in");
    }
  }, [isLoggedIn, isLoading]);

  return (
      <ActivityIndicatorComponent />
  );
}
