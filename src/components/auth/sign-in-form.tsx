import AuthButton from "@/components/auth/auth-button";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Input, InputField } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { AlertCircleIcon, InfoIcon } from '@/components/ui/icon';

import GoogleSignInButton from '@/components/social-auth-buttons/google/google-sign-in-button';
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { HStack } from "@/components/ui/hstack";
import { VStack } from '@/components/ui/vstack';

type ValidationErrors = Partial<Record<"email" | "password", string>>;

type StatusMessage =
  | { variant: "error"; text: string }
  | { variant: "info"; text: string }
  | null;

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  function validate(): boolean {
    const errors: ValidationErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function signInWithEmail() {
    setStatusMessage(null);
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setStatusMessage({ variant: "error", text: error.message });
      }
    } catch (caughtError) {
      setStatusMessage({
        variant: "error",
        text: "Something went wrong while signing in. Please try again.",
      });
      console.error("Error during sign-in:", caughtError);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <ThemedView style={styles.container}>
      <VStack space="lg" className="w-full">
        <ThemedView>
          <ThemedText
            type="title"
            accessibilityRole="header"
            className="mb-6"
          >
            Sign in
          </ThemedText>
          <ThemedText className="text-sm">
            {" "}
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </ThemedText>
        </ThemedView>
        {statusMessage && (
          <ThemedView className="mt-3">
            <Alert
              action={statusMessage.variant === "error" ? "error" : "info"}
              variant="outline"
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
            >
              <AlertIcon
                as={
                  statusMessage.variant === "error" ? AlertCircleIcon : InfoIcon
                }
              />
              <AlertText>{statusMessage.text}</AlertText>
            </Alert>
          </ThemedView>
        )}
        <ThemedView>
          <FormControl isInvalid={Boolean(validationErrors.email)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>
                  Email
                </ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="email@address.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                accessibilityLabel="Email address"
                accessibilityHint="Enter the email you used to create your account"
                autoCorrect={false}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Must be a valid email address.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.email}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <FormControl isInvalid={Boolean(validationErrors.password)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>
                  Password
                </ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="sm">
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder=""
                autoCapitalize="none"
                secureTextEntry
                textContentType="password"
                accessibilityLabel="Password"
                accessibilityHint="Enter your account password"
                autoCorrect={false}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Must be at least 6 characters.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.password && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.password}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </ThemedView>
        <ThemedView>
          <AuthButton
            className="w-full self-end mt-4"
            size="sm"
            variant="solid"
            isDisabled={isLoading}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
            accessibilityHint="Submit your email and password to sign in"
            buttonText={isLoading ? "Signing in..." : "Sign in"}
            onPress={() => {
              void signInWithEmail();
            }}
          />
        </ThemedView>
        <ThemedView className="items-center" >
          <HStack space="lg" className="items-center">
            <Divider className="w-[100px]" />
            <ThemedText type="default"> or </ThemedText>
            <Divider className="w-[100px]" />
          </HStack>
        </ThemedView>
        <GoogleSignInButton buttonText="Sign in with Google" />
      </VStack>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    width: "100%",
  },
});