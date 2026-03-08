/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { plansApi } from "@/features/plans/api/plans.api";
import type { Plan } from "@/features/plans/types/plan.type";
import { ApiError } from "@/lib/api/client";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthActions();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectGroupFilter, setSubjectGroupFilter] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [serverError, setServerError] = useState("");

  async function fetchPlans() {
    try {
      setIsLoading(true);
      setServerError("");

      const result = await plansApi.list({
        status: statusFilter || undefined,
        subjectGroup: subjectGroupFilter || undefined,
        gradeLevel: gradeLevelFilter || undefined,
      });

      setPlans(result.items);
      setTotal(result.meta?.total ?? result.items.length);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchPlans();
  }, [statusFilter, subjectGroupFilter, gradeLevelFilter]);

  async function handleCreatePlan() {
    try {
      setIsCreating(true);
      setServerError("");

      const created = await plansApi.create({
        title: "Untitled Lesson Plan",
        subjectGroup: user?.schoolName ? "General" : "",
        gradeLevel: "",
        semester: "",
        academicYear: "",
        schoolName: user?.schoolName || "",
        teacherName: user?.fullName || "",
      });

      setPlans((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Welcome, {user?.fullName ?? "Teacher"}
          </p>
          <p className="mt-1 text-sm text-neutral-600">Total plans: {total}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleCreatePlan()}
            disabled={isCreating}
            className="rounded border px-4 py-2"
          >
            {isCreating ? "Creating..." : "Create new plan"}
          </button>

          <button
            type="button"
            onClick={() => void logout()}
            className="rounded border px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm">Subject group</label>
          <input
            value={subjectGroupFilter}
            onChange={(e) => setSubjectGroupFilter(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="e.g. Mathematics"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Grade level</label>
          <input
            value={gradeLevelFilter}
            onChange={(e) => setGradeLevelFilter(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="e.g. P6"
          />
        </div>
      </div>

      {serverError && (
        <p className="mt-4 text-sm text-red-600">{serverError}</p>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Latest plans</h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-neutral-600">Loading plans...</p>
        ) : plans.length === 0 ? (
          <div className="mt-4 rounded border p-6">
            <p className="text-sm">No plans yet.</p>
            <p className="mt-1 text-sm text-neutral-600">
              Create your first lesson plan to get started.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{plan.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {plan.subjectGroup || "-"} • {plan.gradeLevel || "-"} •{" "}
                      {plan.status}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {plan.schoolName || "-"} • {plan.teacherName || "-"}
                    </p>
                  </div>

                  <div className="text-right text-xs text-neutral-500">
                    <p>Updated</p>
                    <p>{new Date(plan.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
