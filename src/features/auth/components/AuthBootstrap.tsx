"use client";

import { useEffect, useRef } from "react";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";

type Props = {
  children: React.ReactNode;
};

export function AuthBootstrap({ children }: Props) {
  const hasRun = useRef(false);

  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!isHydrated || hasRun.current) return;

    hasRun.current = true;

    async function bootstrap() {
      if (!accessToken && !refreshToken) {
        return;
      }

      try {
        const result = await authApi.me();
        setUser(result.user);
      } catch {
        clearAuth();
      }
    }

    void bootstrap();
  }, [isHydrated, accessToken, refreshToken, setUser, clearAuth]);

  return <>{children}</>;
}
