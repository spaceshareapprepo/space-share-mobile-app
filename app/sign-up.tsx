import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import SignUpForm from '@/components/auth/sign-up-form';
import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sign up' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Sign up</ThemedText>
        <SignUpForm/>
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