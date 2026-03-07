"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthActions();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome, {user?.fullName ?? "Teacher"}</p>

      <button
        type="button"
        onClick={() => void logout()}
        className="mt-4 rounded border px-4 py-2"
      >
        Logout
      </button>
    </main>
  );
}
