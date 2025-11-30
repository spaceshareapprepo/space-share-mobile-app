import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { TouchableOpacity, Platform } from "react-native";

import { expo } from "@/../app.json";
import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

function extractParamsFromUrl(url: string) {
  const parsedUrl = new URL(url);
  const hash = parsedUrl.hash.substring(1); // Remove the leading '#'
  const params = new URLSearchParams(hash);

  return {
    access_token: params.get("access_token"),
    expires_in: Number.parseInt(params.get("expires_in") || "0"),
    refresh_token: params.get("refresh_token"),
    token_type: params.get("token_type"),
    provider_token: params.get("provider_token"),
    code: params.get("code"),
  };
}

async function onSignInButtonPress() {
  console.debug("onSignInButtonPress - start");
  const res = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${expo.scheme}://github-auth`,
      queryParams: { prompt: "consent" },
      skipBrowserRedirect: true,
    },
  });

  const githubOAuthUrl = res.data.url;

  if (!githubOAuthUrl) {
    console.error("no oauth url found!");
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(
    githubOAuthUrl,
    `${expo.scheme}://github-auth`,
    { showInRecents: true }
  ).catch((err) => {
    console.error("onSignInButtonPress - openAuthSessionAsync - error", {
      err,
    });
    console.log(err);
  });

  console.debug("onSignInButtonPress - openAuthSessionAsync - result", {
    result,
  });

  if (result && result.type === "success") {
    console.debug("onSignInButtonPress - openAuthSessionAsync - success");
    const params = extractParamsFromUrl(result.url);
    console.debug("onSignInButtonPress - openAuthSessionAsync - success", {
      params,
    });

    if (params.access_token && params.refresh_token) {
      console.debug("onSignInButtonPress - setSession");
      const { data, error } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      console.debug("onSignInButtonPress - setSession - success", {
        data,
        error,
      });
      return;
    } else {
      console.error("onSignInButtonPress - setSession - failed");
      // sign in/up failed
    }
  } else {
    console.error("onSignInButtonPress - openAuthSessionAsync - failed");
  }
}

type GithubSignInButtonProps = Readonly<{
  label?: string;
}>;

export default function GithubSignInButton({
  label,
}: GithubSignInButtonProps) {
  // to warm up the browser
  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== "web") {
        WebBrowser.coolDownAsync();
      }
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={onSignInButtonPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        paddingVertical: 16,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        justifyContent: "center",
        elevation: 2, // For Android shadow
      }}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Image
        source={{
          uri: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        }}
        style={{ width: 24, height: 24, marginRight: 10 }}
      />
      <ThemedText
        style={{
          fontSize: 16,
          color: "#757575",
          fontWeight: "500",
        }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}
