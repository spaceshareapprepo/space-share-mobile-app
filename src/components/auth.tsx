import AuthButton from "@/components/auth/auth-button";
import { Input, InputField } from "@/components/ui/input";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
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
    setLoading(false);
  }

  async function onSignOutButtonPress() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <AuthButton
          isDisabled={loading}
          buttonText="Sign in"
          onPress={() => {
            void signInWithEmail();
          }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <AuthButton
          isDisabled={loading}
          buttonText="Sign up"
          onPress={() => {
            void signUpWithEmail();
          }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <AuthButton
          isDisabled={loading}
          buttonText="Sign out"
          onPress={() => {
            void onSignOutButtonPress();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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
