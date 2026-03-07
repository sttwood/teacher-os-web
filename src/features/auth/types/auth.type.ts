export type User = {
  id: string;
  email: string;
  fullName: string;
  schoolName: string;
  isVerified: boolean;
  isActive: boolean;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  schoolName: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type MeResponse = {
  user: User;
};

export type VerifyEmailConfirmRequest = {
  token: string;
};

export type VerifyEmailConfirmResponse = {
  message: string;
};

export type VerifyEmailResendRequest = {
  email: string;
};

export type VerifyEmailResendResponse = {
  message: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type LogoutResponse = {
  message: string;
};