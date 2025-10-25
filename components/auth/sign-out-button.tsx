import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import AuthButton from "@/components/auth/auth-button";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

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
    <AuthButton
      isDisabled={loading}
      buttonText="Sign out"
      onPress={() => {
        void onSignOutButtonPress();
      }}
    />
  );
}