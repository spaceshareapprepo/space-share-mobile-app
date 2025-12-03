import { useEffect, useMemo } from "react";
import { RelativePathString, useRouter } from "expo-router";

import { useAuthContext } from "@/hooks/use-auth-context";

type RequireAuthOptions = {
  redirectTo?: RelativePathString;
};

export function useRequireAuth(options: RequireAuthOptions = {}) {
  const { redirectTo = "/" } = options;
  const router = useRouter();
  const auth = useAuthContext();

  useEffect(() => {
    if (!auth.isLoading && !auth.isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [auth.isLoading, auth.isLoggedIn, redirectTo, router]);

  const userId = useMemo(
    () => auth.session?.user?.id ?? auth.profile?.id ?? null,
    [auth.session?.user?.id, auth.profile?.id]
  );

  return {
    ...auth,
    userId,
  };
}
