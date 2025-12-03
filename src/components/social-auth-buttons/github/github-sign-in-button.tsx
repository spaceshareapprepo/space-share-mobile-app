import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useGithubOAuth } from "@/hooks/use-github-oauth";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";



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
      onPress={useGithubOAuth}
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
