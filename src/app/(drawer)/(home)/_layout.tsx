import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat/[id]"
        options={{
          headerShown: true,
          title: "Chat",
          headerTitleAlign: "center",
          headerTitle: "Chat",
          presentation: "modal"
        }}
      />
      <Stack.Screen
        name="listings/edit/[id]"
        options={{ 
          headerShown: true,
          title: "", 
          headerTitle: "", 
          presentation: "modal" 
        }}
      />
      <Stack.Screen
        name="listings/[id]"
        options={{ 
          headerShown: true, 
          title: "", 
          headerTitle: "",
          presentation: "modal" 
        }}
      />
    </Stack>
  );
}
