import { CredentialResponse, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { supabase } from "@/lib/supabase";

export function useGoogleAuth() {
  const [nonce, setNonce] = useState("");
  const [sha256Nonce, setSha256Nonce] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const n = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    setNonce(n);
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(n)).then((buf) => {
      const hex = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setSha256Nonce(hex);
    });
  }, []);

  const handleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: res.credential,
        nonce,
      });
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: () =>handleSuccess,
    onError: () => console.error("Google sign-in failed"),
  });

  return { login, isLoading, sha256Nonce };
}

type GoogleAuthButtonProps = {
  label?: string;
};

// Simple custom button wrapped in the Google OAuth provider (web)
export function GoogleSignInButton({ label = "Continue with Google" }: Readonly<GoogleAuthButtonProps>) {
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
