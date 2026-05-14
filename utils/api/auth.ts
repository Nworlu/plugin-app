import { apiClient } from "@/utils/api-client";
import type {
  AuthUser,
  LoginStep1Response,
  LoginStep2Response,
  RegisterStep1Response,
  RegisterStep2Response,
  SignedUrlResponse,
} from "./types";

export const authApi = {
  /** Step 1: initiate registration, triggers OTP */
  registerStep1: (payload: {
    email: string;
    phone: string;
    country: string;
    firstName: string;
    lastName: string;
  }) =>
    apiClient.post<RegisterStep1Response>("auth/sign-up-one", {
      email: payload.email,
      country: payload.country,
      contact: { phone: payload.phone, country: payload.country },
      name: { firstname: payload.firstName, lastname: payload.lastName },
      platform: "mobile",
      role: "organizer",
    }),

  /** Step 2: verify OTP and create account */
  registerStep2: (payload: { code: string; email: string }) =>
    apiClient.post<RegisterStep2Response>("auth/sign-up-two", payload),

  /** Step 1: initiate login */
  loginStep1: (email: string) =>
    apiClient.post<LoginStep1Response>("auth/login-step-one", { email }),

  /** Step 2: verify OTP and receive token */
  loginStep2: (email: string, code: string) =>
    apiClient.post<LoginStep2Response>("auth/login-step-two", { email, code }),

  /** Get the currently authenticated user */
  getMe: () => apiClient.get<AuthUser>("auth/me", true),

  /** Get a GCS signed URL for file upload */
  getSignedUrl: (fileName: string, contentType: string) =>
    apiClient.post<SignedUrlResponse>(
      "auth/uploads/gc-signed-url",
      { fileName, contentType },
      true,
    ),
};
