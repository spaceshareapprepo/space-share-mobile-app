import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';

import SignInForm from '@/components/auth/sign-in-form';

export default function SignInScreen() {
  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
      <Stack.Screen options={{ title: "Sign in" }} />
      <SignInForm />
    </ThemedView>
  );
}
