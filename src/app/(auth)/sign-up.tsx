import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';

import SignUpForm from '@/components/auth/sign-up-form';

export default function SignUpScreen() {
  return (
    <ThemedView safeArea style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
      <Stack.Screen options={{ title: 'Sign up' }} />
        <SignUpForm/>
    </ThemedView>
  )
}
