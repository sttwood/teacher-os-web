"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth/api/auth.api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema";
import { ApiError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setServerError("");
      const result = await authApi.forgotPassword(values);
      setSuccessMessage(result.message);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Forgot password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input {...register("email")} className="w-full rounded border p-2" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
          {isSubmitting ? "Submitting..." : "Send reset link"}
        </button>
      </form>
    </main>
  );
}
