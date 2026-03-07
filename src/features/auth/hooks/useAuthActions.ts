"use client";

import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api/auth.api";
import { AUTH_ROUTES } from "@/features/auth/constants/auth-routes";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function useAuthActions() {
  const router = useRouter();
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch {
      // ignore logout API failure, still clear client state
    } finally {
      clearAuth();
      router.replace(AUTH_ROUTES.login);
    }
  };

  return {
    logout,
  };
}