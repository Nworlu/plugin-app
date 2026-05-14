import { apiClient } from "@/utils/api-client";
import type { InitPaymentPayload, InitPaymentResponse } from "./types";

export const paymentApi = {
  /** Initialize a Paystack payment, returns authorizationUrl */
  initialize: (payload: InitPaymentPayload) =>
    apiClient.post<InitPaymentResponse>("payment/paystack", payload, true),

  /** Handle Paystack callback (pass reference from query param) */
  callback: (reference: string) =>
    apiClient.get<{ success: boolean }>(
      `payment/paystack/callback?reference=${encodeURIComponent(reference)}`,
    ),
};
