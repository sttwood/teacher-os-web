"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/features/auth/api/auth.api";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";
import { AUTH_ROUTES } from "@/features/auth/constants/auth-routes";
import { ApiError } from "@/lib/api/client";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      schoolName: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const result = await authApi.register(values);
      setSuccessMessage(result.message);
      router.push(
        `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(values.email)}`,
      );
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input {...register("email")} className="w-full rounded border p-2" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded border p-2"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Full name</label>
          <input
            {...register("fullName")}
            className="w-full rounded border p-2"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">School name</label>
          <input
            {...register("schoolName")}
            className="w-full rounded border p-2"
          />
          {errors.schoolName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.schoolName.message}
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
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  );
}
