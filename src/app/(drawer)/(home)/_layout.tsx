import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="/chat/[id]" options={{ headerShown: false }}/>
      <Stack.Screen
            name="listings/edit/[id]"
            options={{ headerShown: true, title: "" }}
          />
      <Stack.Screen
            name="listings/[id]"
            options={{
              title: "Listing Detail",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: "",
              headerTransparent: true,
            }}
          />
    </Stack>
  );
}
