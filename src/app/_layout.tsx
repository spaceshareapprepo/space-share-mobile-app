import "@/styles/global.css";
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

import ActivityIndicatorComponent from "@/components/activity-indicator";
import { SplashScreenController } from "@/components/splash-screen-controller";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DrawerProvider } from "@/providers/gluestack-drawer-provider";
import SessionProvider from "@/providers/session-provider";
import { useEffect } from "react";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";


function RootNavigator() {
  const { isLoggedIn, session } = useAuthContext();

  // FIX: This useEffect now just ensures the session hydrates. The <Stack> logic handles the routes.
  useEffect(() => {
    if (session === undefined) return; 
    console.log('Auth state hydrated:', isLoggedIn ? 'Logged In' : 'Logged Out');
  }, [isLoggedIn, session]);

  if (session === undefined) 
    {
    // Show a loading screen while auth state is unknown
    return (
      <ActivityIndicatorComponent /> 
    );
  } 
  
  // The Stack definition handles which routes are available based on authentication status.
  return (
    <Stack>
        {/* User is logged in: Show the main app tabs and other screens */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* other top-level screens that are only available when logged in */}
          <Stack.Screen name="about" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="spaceshare-animated" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>
        {/* User is not logged in: Only show authentication screens and an index (optional landing)*/}
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Public landing page */}
          <Stack.Screen name="(auth)/sign-in" options={{ headerShown: true, title: "Sign in" }} />
          <Stack.Screen name="(auth)/sign-up" options={{ headerShown: true, title: "Sign up" }} />
          <Stack.Screen name="(auth)/v1/callback" options={{ headerShown: false }} />
        </Stack.Protected>
      {/* If you have screens accessible to everyone (like a generic index/landing page that exists outside (auth) or (tabs)), they go here if needed. */}
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
    <SessionProvider>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GluestackUIProvider>
            <SplashScreenController />
            <AutocompleteDropdownContextProvider>
              <DrawerProvider>
                <RootNavigator />
              </DrawerProvider>
            </AutocompleteDropdownContextProvider>
            <StatusBar style="auto" animated />
          </GluestackUIProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}
