import { ThemedText } from '@/components/themed-text';
import { useAuthContext } from "@/hooks/use-auth-context";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";

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
    <>
      <ActivityIndicator size="large" />
      <ThemedText className="mt-16 text-16">{message}</ThemedText>
    </>
  );
}
