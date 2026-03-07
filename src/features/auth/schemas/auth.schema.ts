import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  schoolName: z.string().min(1, "School name is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});

export const verifyEmailConfirmSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailConfirmFormValues = z.infer<
  typeof verifyEmailConfirmSchema
>;