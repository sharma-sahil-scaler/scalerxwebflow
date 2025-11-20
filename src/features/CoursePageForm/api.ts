import { apiRequest, generateJWT } from "@/common/utils/api";
import CaseUtil from "@/common/utils/case-utils";
import { GET_LIVE_CLASS_ENDPOINT, PROGRAM_TO_SLUG } from "./constant";
import attribution from "@/common/utils/attribution";

interface CreateRegistrationPayload {
  account_type: string;
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
  type: string;
  source: string;
  user: {
    otp: string;
    phone_number: string;
    email?: string;
    skip_existing_user_check?: boolean;
    rcb_prams?: unknown
  };
}

interface RequestCallbackPayload {
  attributions?: {
    intent: string;
    element?: string;
    product?: string;
    sub_product?: string;
  };
  user: {
    program: string;
    position: string;
  };
}

interface BookLiveClassPayload {
  program: string,
  attributions?: {
    intent: string;
    element?: string;
    product?: string;
    sub_product?: string;
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

export async function getUpcomingLiveClass(
  program: string,
  token: string
) {
  return apiRequest(
    'GET',
    `${GET_LIVE_CLASS_ENDPOINT}/${PROGRAM_TO_SLUG[program as keyof typeof PROGRAM_TO_SLUG]}`,
    {},
    {
      headers: {
        'X-user-token': token
      }
    }
  )
}

export async function registerEvent(id: string, token: string, program: string) {
  const refererUrl = new URL(window.location.href);
  refererUrl.searchParams.set('default-live-class-booking', "true");

  attribution.setAttribution("book_live_class", {
    program
  })

  return apiRequest(
    'POST',
    `/api/v3/events/${id}/registrations`,
    {
      attributions: attribution.getAttribution()
    },
    {
      headers: {
        'X-user-token': token,
        'X-REFERER': refererUrl.toString(),
      },
    },
  )
}

export async function bookLiveClass(payload: BookLiveClassPayload) {
  const { program } = payload;

  const formattedProgram = CaseUtil.kebabCase(program)
  try {
    if(!program) throw new Error("No Program Passed")
    const jwt = await generateJWT() || '';
    const response = await getUpcomingLiveClass(formattedProgram, jwt) as { data?: { id?: string } };
    const eventId = response?.data?.id;

    if(eventId) {
      await registerEvent(eventId, jwt, program);
    }
  } catch {
    console.log("Hello World")
  } finally {
    if(formattedProgram === 'ai-ml') {
      window.location.replace(`/ai_ml/free-live-class`);
    }  else {
      window.location.replace(`/${formattedProgram}/free-live-class`);
    }
  }
}