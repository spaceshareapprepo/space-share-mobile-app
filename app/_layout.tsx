import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
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

export const unstable_settings = {
  anchor: "(tabs)",
};

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn, session } = useAuthContext();

  if (session === undefined) {
    // Wait for the auth state to hydrate before deciding which stack to show.
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="google-auth" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack.Protected>
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
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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
