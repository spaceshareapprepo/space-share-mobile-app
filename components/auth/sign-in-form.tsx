import AuthButton from "@/components/auth/auth-button";
import { Input, InputField } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithEmail() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
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
      <View style={[styles.verticallySpaced]}>
        <AuthButton
          isDisabled={isLoading}
          buttonText={isLoading ? "Signing in..." : "Sign in"}
          onPress={() => {
            void signInWithEmail();
          }}
        />
      </View>
      <View className="mt-4 text-center text-sm pb-2">
        <Text>
          {" "}
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
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
