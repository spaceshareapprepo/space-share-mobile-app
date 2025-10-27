import { supabase } from "@/lib/supabase";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import type { GoogleLoginProps } from "@react-oauth/google";
import { SignInWithIdTokenCredentials } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import "react-native-get-random-values";

function onGoogleButtonFailure() {
  console.error("Error signing in with Google");
}

type GoogleSignInButtonProps = {
  buttonText?: string;
};

function mapButtonTextToVariant(
  buttonText?: string
): GoogleLoginProps["text"] | undefined {
  if (!buttonText) {
    return undefined;
  }

  const normalized = buttonText.toLowerCase();

  if (normalized.includes("sign up")) {
    return "signup_with";
  }

  if (normalized.includes("continue")) {
    return "continue_with";
  }

  if (normalized === "sign in") {
    return "signin";
  }

  if (normalized.includes("sign in")) {
    return "signin_with";
  }

  return undefined;
}

export default function GoogleSignInButton({
  buttonText,
}: Readonly<GoogleSignInButtonProps>) {
  // Generate secure, random values for state and nonce
  const [nonce, setNonce] = useState("");
  const [sha256Nonce, setSha256Nonce] = useState("");

  async function onGoogleButtonSuccess(
    authRequestResponse: CredentialResponse
  ) {
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

  useEffect(() => {
    function generateNonce(): string {
      const array = new Uint32Array(1);
      globalThis.crypto.getRandomValues(array);
      return array[0].toString();
    }

    async function generateSha256Nonce(nonce: string): Promise<string> {
      const buffer = await globalThis.crypto.subtle.digest(
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

  return (
    <GoogleOAuthProvider
      clientId={process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID ?? ""}
      nonce={sha256Nonce}
    >
      <GoogleLogin
        nonce={sha256Nonce}
        onSuccess={onGoogleButtonSuccess}
        onError={onGoogleButtonFailure}
        useOneTap={true}
        auto_select={true}
        shape="pill"
        text={mapButtonTextToVariant(buttonText)}
      />
    </GoogleOAuthProvider>
  );
}
