import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import SignInForm from '@/components/auth/sign-in-form';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';

export default function SignInScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign in' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Sign in</ThemedText>
        <SignInForm/>
        <GoogleSignInButton />
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
})