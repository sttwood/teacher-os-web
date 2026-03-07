"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/features/auth/api/auth.api";
import { ApiError } from "@/lib/api/client";
import { AUTH_ROUTES } from "@/features/auth/constants/auth-routes";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    async function confirmEmail() {
      if (!token) return;

      try {
        setIsSubmitting(true);
        setServerError("");
        setSuccessMessage("");

        const result = await authApi.verifyEmailConfirm({ token });
        setSuccessMessage(result.message);
      } catch (error) {
        const apiError = error as ApiError;
        setServerError(apiError.message);
      } finally {
        setIsSubmitting(false);
      }
    }

    void confirmEmail();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      setServerError("Email is required to resend verification");
      return;
    }

    try {
      setIsResending(true);
      setServerError("");
      setSuccessMessage("");

      const result = await authApi.verifyEmailResend({ email });
      setSuccessMessage(result.message);
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Verify email</h1>

      {token ? (
        <div className="mt-6 space-y-4">
          {isSubmitting && <p>Verifying your email...</p>}

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          {successMessage && (
            <>
              <p className="text-sm text-green-600">{successMessage}</p>
              <Link href={AUTH_ROUTES.login} className="underline">
                Go to login
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm">
            We sent a verification link to{" "}
            <span className="font-medium">{email || "your email"}</span>.
          </p>

          <p className="text-sm text-neutral-600">
            Please check your inbox and click the verification link to activate
            your account.
          </p>

          <p className="text-sm text-neutral-600">
            In local development, the verification token/link is printed in the
            backend console.
          </p>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !email}
            className="rounded border px-4 py-2"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>

          <div>
            <Link href={AUTH_ROUTES.login} className="underline">
              Back to login
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
