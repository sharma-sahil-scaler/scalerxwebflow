import { apiRequest } from "@/shared/utils/api";

interface CreateRegistrationPayload {
  account_type: string;
  attributions?: {
    intent: string;
    element?: string;
    product?: string;
    sub_product?: string;
  };
  type: string;
  user: {
    country_code: string;
    email: string;
    orgyear: string;
    phone_number: string;
    name?: string;
    skip_existing_user_check?: boolean;
    whatsapp_consent?: string;
  };
  "cf-turnstile-response"?: string;
}

interface VerifyOtpPayload {
  attributions?: {
    intent: string;
    sub_product: string;
  };
  user: {
    otp: string;
    phone_number: string;
    email?: string;
    skip_existing_user_check?: boolean;
  };
}

interface RequestCallbackPayload {
  attributions?: {
    intent: string;
    sub_product: string;
  };
  user: {
    program: string;
    position: string;
  };
}
export async function createUser(payload: CreateRegistrationPayload) {
  return apiRequest<unknown>("POST", "/users/v2/", payload);
}

export async function verifyUser(payload: VerifyOtpPayload) {
  return apiRequest<unknown>("POST", "/users/v2/verify", payload);
}

export async function updateUser(payload: CreateRegistrationPayload) {
  return apiRequest<unknown>("PUT", "/users/v2/account", payload);
}

export async function requestCallback(payload: RequestCallbackPayload) {
  return apiRequest<unknown>("POST", "/request-callback", payload);
}