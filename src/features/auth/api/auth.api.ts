import { apiClient, toApiError } from "@/lib/api/client";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailConfirmRequest,
  VerifyEmailConfirmResponse,
  VerifyEmailResendRequest,
  VerifyEmailResendResponse,
} from "@/features/auth/types/auth.type";

export const authApi = {
  async register(payload: RegisterRequest) {
    try {
      const { data } = await apiClient.post<RegisterResponse>(
        "/auth/register",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async login(payload: LoginRequest) {
    try {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/login",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async me() {
    try {
      const { data } = await apiClient.get<MeResponse>("/auth/me");
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async verifyEmailConfirm(payload: VerifyEmailConfirmRequest) {
    try {
      const { data } = await apiClient.post<VerifyEmailConfirmResponse>(
        "/auth/verifyEmail/confirm",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async verifyEmailResend(payload: VerifyEmailResendRequest) {
    try {
      const { data } = await apiClient.post<VerifyEmailResendResponse>(
        "/auth/verifyEmail/resend",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async forgotPassword(payload: ForgotPasswordRequest) {
    try {
      const { data } = await apiClient.post<ForgotPasswordResponse>(
        "/auth/forgotPassword",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async resetPassword(payload: ResetPasswordRequest) {
    try {
      const { data } = await apiClient.post<ResetPasswordResponse>(
        "/auth/resetPassword",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async refresh(payload: RefreshTokenRequest) {
    try {
      const { data } = await apiClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async logout(payload: LogoutRequest) {
    try {
      const { data } = await apiClient.post<LogoutResponse>(
        "/auth/logout",
        payload
      );
      return data;
    } catch (error) {
      throw toApiError(error);
    }
  },
};