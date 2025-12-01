import {
  CredentialResponse,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SignInWithIdTokenCredentials } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export function useGoogleAuth() {
  // Generate secure, random values for state and nonce
  const [nonce, setNonce] = useState("");
  const [sha256Nonce, setSha256Nonce] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function onGoogleButtonSuccess(authRequestResponse: CredentialResponse) {
    console.debug("Google sign in successful:", { authRequestResponse });
    if (authRequestResponse.clientId && authRequestResponse.credential) {
      const signInWithIdTokenCredentials: SignInWithIdTokenCredentials = {
        provider: "google",
        token: authRequestResponse.credential,
        nonce: nonce,
      };
      const { data, error } = await supabase.auth.signInWithIdToken(
        signInWithIdTokenCredentials
      );
      if (error) {
        console.error("Error signing in with Google:", error);
      }
      if (data) {
        console.log("Google sign in successful:", data);
      }
    }
  }

  function onGoogleButtonFailure() {
    console.error("Error signing in with Google");
  }

  useEffect(() => {
    function generateNonce(): string {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0].toString();
    }
    async function generateSha256Nonce(nonce: string): Promise<string> {
      const buffer = await window.crypto.subtle.digest(
        "sha-256",
        new TextEncoder().encode(nonce)
      );
      const array = Array.from(new Uint8Array(buffer));
      return array.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let nonce = generateNonce();
    setNonce(nonce);
    generateSha256Nonce(nonce).then((sha256Nonce) => {
      setSha256Nonce(sha256Nonce);
    });
  }, []);

  const login = useGoogleLogin({
    onSuccess: void onGoogleButtonSuccess,
    onError: void onGoogleButtonFailure,
  });

  return { login, isLoading, sha256Nonce };
}

type GoogleAuthButtonProps = {
  label?: string;
};

// Simple custom button wrapped in the Google OAuth provider (web)
export function GoogleSignInButton({
  label = "Continue with Google",
}: Readonly<GoogleAuthButtonProps>) {
  const { login, isLoading, sha256Nonce } = useGoogleAuth();

  return (
    <GoogleOAuthProvider
      clientId={process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID ?? ""}
      nonce={sha256Nonce}
    >
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => login()}
        disabled={isLoading}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 16,
          justifyContent: "center",
          elevation: 2,
        }}
        activeOpacity={0.8}
        accessibilityLabel={label}
      >
        <Text style={{ fontSize: 16, color: "#000", fontWeight: "500" }}>
          {isLoading ? "Signing in..." : label}
        </Text>
      </TouchableOpacity>
    </GoogleOAuthProvider>
  );
}
