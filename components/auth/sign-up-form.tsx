import AuthButton from "@/components/auth/auth-button";
import GoogleSignInButton from "@/components/social-auth-buttons/google/google-sign-in-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
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
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, InfoIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

type ValidationErrors = Partial<
  Record<"firstName" | "lastName" | "username" | "email" | "password", string>
>;

type StatusMessage =
  | { variant: "error"; text: string }
  | { variant: "info"; text: string }
  | null;

export default function SignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  function validate(): boolean {
    const errors: ValidationErrors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      errors.username = "Username is required.";
    } else if (trimmedUsername.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function signUpWithEmail() {
    setStatusMessage(null);
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedUsername = username.trim();
      const normalizedEmail = email.trim();

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            username: trimmedUsername,
          },
        },
      });

      if (error) {
        setStatusMessage({ variant: "error", text: error.message });
        return;
      }

      if (!data.session) {
        setStatusMessage({
          variant: "info",
          text: "Please check your inbox to verify your email before signing in.",
        });
      }
    } catch (caughtError) {
      setStatusMessage({
        variant: "error",
        text: "Something went wrong while creating your account. Please try again.",
      });
      console.error("Error during sign-up:", caughtError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <VStack space="lg" className="w-full">
        <ThemedView>
          <ThemedText type="title" accessibilityRole="header" className="mb-3">
            Sign up
          </ThemedText>
          <ThemedText className="text-sm">
            {" "}
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </ThemedText>
        </ThemedView>
        {statusMessage && (
          <ThemedView>
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

        <VStack space="md">
          
            <FormControl
              isInvalid={Boolean(validationErrors.firstName)}
              size="sm"
            >
              <FormControlLabel>
                <FormControlLabelText>
                  <ThemedText>First name</ThemedText>
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  autoCapitalize="words"
                  textContentType="givenName"
                  accessibilityLabel="First name"
                  accessibilityHint="Enter your first name"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  Share the name you use day to day.
                </FormControlHelperText>
              </FormControlHelper>
              {validationErrors.firstName && (
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {validationErrors.firstName}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            <FormControl
              isInvalid={Boolean(validationErrors.lastName)}
              size="sm"
            >
              <FormControlLabel>
                <FormControlLabelText>
                  <ThemedText>Last name</ThemedText>
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  autoCapitalize="words"
                  textContentType="familyName"
                  accessibilityLabel="Last name"
                  accessibilityHint="Enter your last name"
                />
              </Input>
              <FormControlHelper>
                <FormControlHelperText>
                  Used to personalize your account.
                </FormControlHelperText>
              </FormControlHelper>
              {validationErrors.lastName && (
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {validationErrors.lastName}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          
          <FormControl isInvalid={Boolean(validationErrors.username)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Username</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
                accessibilityLabel="Username"
                accessibilityHint="Choose a public display name"
                autoCorrect={false}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Minimum 3 characters. Letters, numbers, and underscores only.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.username && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.username}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(validationErrors.email)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Email</ThemedText>
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
                accessibilityHint="Enter the email where we can reach you"
                autoCorrect={false}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                We will send a verification message to this address.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.email && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.email}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(validationErrors.password)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Password</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder=""
                autoCapitalize="none"
                secureTextEntry
                textContentType="newPassword"
                accessibilityLabel="Password"
                accessibilityHint="Use at least 6 characters"
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
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.password}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>

        <ThemedView>
          <AuthButton
            className="w-full self-end mt-4"
            size="sm"
            variant="solid"
            isDisabled={isLoading}
            accessibilityRole="button"
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
            accessibilityHint="Submit your details to create an account"
            buttonText={isLoading ? "Creating an account..." : "Sign up"}
            onPress={() => {
              void signUpWithEmail();
            }}
          />
        </ThemedView>
        <ThemedView className="items-center">
          <HStack space="lg" className="items-center">
            <Divider className="w-[100px]" />
            <ThemedText type="default"> or </ThemedText>
            <Divider className="w-[100px]" />
          </HStack>
        </ThemedView>
        <GoogleSignInButton buttonText="Sign up with Google" />
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
