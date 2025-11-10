import { ThemedView } from '@/src/components/themed-view';
import { Stack } from 'expo-router';

import SignUpForm from '@/src/components/auth/sign-up-form';

export default function SignUpScreen() {
  return (
    <ThemedView>
      <Stack.Screen options={{ title: 'Sign up' }} />
        <SignUpForm/>
    </ThemedView>
  )
}
