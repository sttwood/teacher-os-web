"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth/api/auth.api";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/lib/api/client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token") || "";
    setValue("token", token);
  }, [searchParams, setValue]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setServerError("");
      const result = await authApi.resetPassword(values);
      setSuccessMessage(result.message);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Reset password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm">Token</label>
          <input {...register("token")} className="w-full rounded border p-2" />
          {errors.token && (
            <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">New password</label>
          <input
            type="password"
            {...register("newPassword")}
            className="w-full rounded border p-2"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded border px-4 py-2"
        >
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </main>
  );
}
