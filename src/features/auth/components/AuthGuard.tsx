"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
  AUTH_ROUTES,
  PUBLIC_AUTH_PAGES,
} from "@/features/auth/constants/auth-routes";

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;

    const isPublicPage = PUBLIC_AUTH_PAGES.includes(
      pathname as (typeof PUBLIC_AUTH_PAGES)[number],
    );

    if (!isAuthenticated && !isPublicPage) {
      router.replace(AUTH_ROUTES.login);
      return;
    }

    if (
      isAuthenticated &&
      (pathname === AUTH_ROUTES.login || pathname === AUTH_ROUTES.register)
    ) {
      router.replace(AUTH_ROUTES.dashboard);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated) {
    return <div className="p-6"> Loading...</div>;
  }

  return <>{children} </>;
}
