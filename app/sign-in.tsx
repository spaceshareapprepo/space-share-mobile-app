import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';

import SignInForm from '@/components/auth/sign-in-form';

export default function SignInScreen() {
  return (
    <ThemedView>
      <Stack.Screen options={{ title: 'Sign in' }} />
      <SignInForm/>
    </ThemedView>
  )
}