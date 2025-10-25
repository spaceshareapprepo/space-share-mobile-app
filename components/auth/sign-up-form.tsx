import AuthButton from "@/components/auth/auth-button";
import { Input, InputField } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signUpWithEmail() {
    setIsLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced]}>
        <Input>
          <InputField
            value={email}
            onChangeText={setEmail}
            placeholder="email@address.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </Input>
      </View>
      <View style={styles.verticallySpaced}>
        <Input>
          <InputField
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry
            textContentType="password"
          />
        </Input>
      </View>
      <View style={styles.verticallySpaced}>
        <AuthButton
          isDisabled={isLoading}
          buttonText= {isLoading ? "Creating an account..." : "Sign up"}
          onPress={() => {
            void signUpWithEmail();
          }}
        />
      </View>
      <View className="mt-4 text-center text-sm pb-2">
        <Text>
          {" "}
           Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
