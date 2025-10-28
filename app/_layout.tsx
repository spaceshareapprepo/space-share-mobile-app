import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "react-native-url-polyfill/auto";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SplashScreenController } from "@/components/splash-screen-controller";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";

import {
  Menu,
  MenuItem,
  MenuItemLabel,
} from '@/components/ui/menu';
import {
  Icon,
  MenuIcon,
} from '@/components/ui/icon';
import { LogOut } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { ThemedView } from "@/components/themed-view";
import SignOutButton from "@/components/auth/sign-out-button";

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
    <>
    <ThemedView className="self-end">
    <Menu
      placement="bottom right"
      offset={10}
      disabledKeys={['Settings']}
      trigger={({ ...triggerProps }) => {
        return (
          <Button {...triggerProps}>
            <ButtonText><Icon as={MenuIcon} size="lg" className="" /></ButtonText>
          </Button>
        );
      }}
      
    >
      <MenuItem key="Sign out" textValue="Sign out">
        <Icon as={LogOut} size="lg" className="mr-2" />
        <MenuItemLabel size="lg"><SignOutButton/></MenuItemLabel>
      </MenuItem>
    </Menu>
    </ThemedView>
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
      <Stack.Screen name="google-auth" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  if (!loaded) {
    // Async font loading only occurs in development.
    return null
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
