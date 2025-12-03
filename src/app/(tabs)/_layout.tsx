import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { HStack } from "@/components/ui/hstack";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DrawerButton } from "@/hooks/use-drawer";

export const unstable_settings = {
  anchor: "(tabs)",
  initialRouteName: 'index',
};

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      backBehavior="order"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        headerShown: true,
        headerTitle: "",
        headerRight: () => (
          <HStack
          style={{ marginRight: 15, gap: 12 }}>
            <Pressable
              onPress={() => router.push("/inbox")}
              hitSlop={12}
              accessibilityLabel="Open inbox"
            >
              <IconSymbol
                size={22}
                name="bell.fill"
                color={Colors[colorScheme ?? "light"].tint}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push("/profile")}
              hitSlop={12}
              accessibilityLabel="Open profile"
            >
              <IconSymbol
                size={22}
                name="user.circle.fontawesome6"
                color={Colors[colorScheme ?? "light"].tint}
              />
            </Pressable>
          </HStack>
        ),
        headerLeft: () => (
          <HStack style={{ marginLeft: 15, gap: 12 }}>
            <DrawerButton />
          </HStack>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: "Publish",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-spaces"
        options={{
          title: "My Spaces",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="workspace.outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chatbubbles.outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
