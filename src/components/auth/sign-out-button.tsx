import AuthButton from "@/components/auth/auth-button";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function onSignOutButtonPress() {
    setLoading(true);
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
    setLoading(false);
  }
  return (
    <AuthButton
      isDisabled={loading}
      size="lg"
      buttonText="Sign out"
      onPress={() => {
        void onSignOutButtonPress();
      }}
    />
  );
}