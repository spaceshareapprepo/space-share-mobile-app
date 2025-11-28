import "@/styles/global.css";
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

import { SplashScreenController } from "@/components/splash-screen-controller";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

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

    const [first] = segments;
    const inAuthGroup = first === "(auth)";
    const isOnGoogleAuth = first === "google-auth";
    const isLanding = first === undefined;

    if (!isLoggedIn && !inAuthGroup && !isLanding) {
      router.replace("/");
      return;
    }

    if (isLoggedIn && (inAuthGroup || isOnGoogleAuth || isLanding)) {
      router.replace("/(drawer)/(home)/(tabs)");
    }
  }, [isLoggedIn, session, segments, router]);

  if (session === undefined) {
    // Wait for the auth state to hydrate before deciding which stack to show.
    return <ActivityIndicator />;
  }

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="google-auth" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: true, title: "" }} />
        <Stack.Screen name="(auth)/sign-up" options={{ headerShown: true, title: "" }} />
        </Stack.Protected>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
        <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
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
              <AutocompleteDropdownContextProvider>
                <RootNavigator />
              </AutocompleteDropdownContextProvider>
              <StatusBar style="auto" />
            </AuthProvider>
          </ThemeProvider>
        </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
