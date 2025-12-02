import { expo } from "@/../app.json";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export async function useGoolgeOAuth() {

  const redirectTo =
    Platform.OS !== "web"
      ? `${expo.scheme}://v1/callback`
      : `${window.location.origin}/v1/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { prompt: "consent" },
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  if (error) {
    console.error("Google OAuth start failed", error);
    return;
  }

  const url = data?.url;
  if (Platform.OS === "web" && url) {
    window.location.assign(url);
    return;
  }

  if (url) {
    WebBrowser.maybeCompleteAuthSession();
    await WebBrowser.openAuthSessionAsync(url, redirectTo, {
      showInRecents: true,
    });
  } else {
    console.error("No OAuth URL returned");
  }
}
