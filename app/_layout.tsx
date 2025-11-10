import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import "./global.css";

import { SplashScreenController } from "@/components/splash-screen-controller";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export const unstable_settings = {
  anchor: "(drawer)",
};

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn, session } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;

    const [firstSegment] = segments;
    const inAuthGroup = firstSegment === "(auth)";
    const isOnGoogleAuth = firstSegment === "google-auth";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/sign-in");
      return;
    }

    if (isLoggedIn && (inAuthGroup || isOnGoogleAuth)) {
      router.replace("/");
    }
  }, [isLoggedIn, session, segments, router]);

  if (session === undefined) {
    // Wait for the auth state to hydrate before deciding which stack to show.
    return <ActivityIndicator />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>
      <Stack.Screen name="google-auth" options={{ headerShown: false }} />
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <SplashScreenController />
            <RootNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
