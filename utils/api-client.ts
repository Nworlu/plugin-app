import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import {
  isSessionInvalidError,
  triggerSessionInvalid,
} from "@/utils/auth-session";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8001/api";

const TOKEN_KEY = "authToken";

export const tokenStorage = {
  get: () => AsyncStorage.getItem(TOKEN_KEY),
  set: (token: string) => AsyncStorage.setItem(TOKEN_KEY, token),
  remove: () => AsyncStorage.removeItem(TOKEN_KEY),
};

export type ApiResponse<T = unknown> = {
  status: number;
  message?: string;
  data: T;
  token?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detail?: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: AxiosRequestConfig & { withAuth?: boolean } = {},
): Promise<T> {
  const { withAuth = false, headers: extraHeaders = {}, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (withAuth) {
    const token = await tokenStorage.get();
    if (!token) {
      throw new ApiError(
        401,
        "Authentication required. Please log in to continue.",
        "Missing authentication token",
        "AUTH_REQUIRED",
      );
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const url = `${API_BASE_URL.replace(/\/$/, "")}/${path}`;
    console.log(`[API] ➡️  ${rest.method ?? "GET"} ${url}`, rest.data ?? "");

    const response = await axios.request<ApiResponse<T>>({
      url,
      headers,
      ...rest,
    });

    console.log(`[API] ✅ ${rest.method ?? "GET"} ${url}`, response.data);

    const body = response.data;
    // Some endpoints (auth) return a token at the top level alongside data.
    // Merge it into the result so callers can access it as data.token.
    if (body.token) {
      return { ...(body.data as object), token: body.token } as T;
    }
    // Fall back to returning the full body when the endpoint doesn't use a
    // { data: ... } wrapper (e.g. the signed-URL endpoint returns fields directly).
    return body.data !== undefined ? body.data : (body as unknown as T);
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      const body = err.response.data as ApiResponse<unknown>;
      const status = body?.status ?? err.response.status;
      const message = body?.message ?? "An error occurred";

      console.log(
        `[API] ❌ ${rest.method ?? "GET"} ${API_BASE_URL.replace(/\/$/, "")}/${path}`,
        status,
        body,
      );

      if (withAuth && isSessionInvalidError(status, message)) {
        void triggerSessionInvalid();
      }

      throw new ApiError(
        status,
        message,
        (body as unknown as { error?: string })?.error,
        isSessionInvalidError(status, message)
          ? "SESSION_INVALID"
          : undefined,
      );
    }
    throw err;
  }
}

export const apiClient = {
  get: <T>(path: string, withAuth = false) =>
    request<T>(path, { method: "GET", withAuth }),

  post: <T>(path: string, body: unknown, withAuth = false) =>
    request<T>(path, { method: "POST", data: body, withAuth }),

  put: <T>(path: string, body: unknown, withAuth = false) =>
    request<T>(path, { method: "PUT", data: body, withAuth }),

  patch: <T>(path: string, body: unknown, withAuth = false) =>
    request<T>(path, { method: "PATCH", data: body, withAuth }),

  delete: <T>(path: string, withAuth = false) =>
    request<T>(path, { method: "DELETE", withAuth }),
};
