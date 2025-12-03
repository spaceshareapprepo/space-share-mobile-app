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

import ActivityIndicatorComponent from "@/components/activity-indicator";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import { DrawerProvider } from "@/providers/gluestack-drawer-provider";
import { useEffect } from "react";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

export const unstable_settings = {
  anchor: "(tabs)",
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
    const isLanding = first === undefined;
    const isOnTabs = first === "(tabs)";

    if (!isLoggedIn && !inAuthGroup && !isLanding) {
      router.replace("/(auth)/sign-in");
      return;
    }

    if (isLoggedIn && !isOnTabs && (inAuthGroup || isLanding)) {
      router.navigate("/(tabs)");
    }
  }, [isLoggedIn, session, segments, router]);

  if (session === undefined) {
    // Wait for the auth state to hydrate before deciding which stack to show.
    return (
      <ActivityIndicatorComponent />
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: true, title: "Sign in" }} />
        <Stack.Screen name="(auth)/sign-up" options={{ headerShown: true, title: "Sign up" }} />
      </Stack.Protected>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="spaceshare-animated" options={{ headerShown: true, title: "Space Share Animated" }} />
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
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GluestackUIProvider>
          <AuthProvider>
            <SplashScreenController />
            <AutocompleteDropdownContextProvider>
              <DrawerProvider>
                <RootNavigator />
              </DrawerProvider>
            </AutocompleteDropdownContextProvider>
            <StatusBar style="auto" animated/>
          </AuthProvider>
        </GluestackUIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
