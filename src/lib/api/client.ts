import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";
import { env } from "@/lib/env";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
};

export type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorResponse = {
  status: "failed";
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, updateTokens, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const response = await axios.post<
      ApiSuccessResponse<{
        message: string;
        accessToken: string;
        refreshToken: string;
      }>
    >(`${env.apiUrl}/auth/refresh`, {
      refreshToken,
    });

    const payload = response.data.data;

    updateTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });

    return payload.accessToken;
  } catch {
    clearAuth();
    return null;
  }
}

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${accessToken}`;
    config.headers = headers;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      throw toApiError(error);
    }

    const status = error.response?.status;
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        const headers = (originalRequest.headers ?? {}) as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers = headers;

        return apiClient(originalRequest);
      }
    }

    throw toApiError(error);
  }
);

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status ?? 500;
    const code = axiosError.response?.data?.error?.code || "UNKNOWN_ERROR";
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "Request failed";

    return new ApiError(message, code, status);
  }

  return new ApiError("Request failed", "UNKNOWN_ERROR", 500);
}