import { getDeviceType } from "./platform";
import { isNullOrUndefined } from "./type";
import { getURLWithUTMParams } from "./url";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Primitive = string | number | boolean;
export type QueryParams = Record<
  string,
  Primitive | Primitive[] | null | undefined
>;

export function searchParams(
  params: QueryParams,
  transformArray = false
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => !isNullOrUndefined(v)
  );
  return entries
    .map(([key, value]) => {
      if (transformArray && Array.isArray(value)) {
        return (value as Primitive[])
          .map((v) => `${key}[]=${String(v)}`)
          .join("&");
      }
      return `${key}=${String(value as Primitive)}`;
    })
    .join("&");
}

export class ApiError<T = unknown> extends Error {
  isFromServer = true;
  response: Response;
  responseJson?: T;
  constructor(message: string, response: Response, json?: T) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.responseJson = json;
  }
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  let json: T | undefined;
  try {
    json = (await response.json()) as T;
  } catch {
    // Response has no or invalid JSON; keep json as undefined
  }

  if (response.headers.has("X-Flash-Messages")) {
    const flashHeader = response.headers.get("X-Flash-Messages") || "{}";
    const { error, notice } = JSON.parse(flashHeader) || {};
    if (error || notice) {
      const flashError = (error || notice) as string;
      if (json && typeof json === "object") {
        Object.assign(
          json as object,
          { flashError } as { flashError?: string }
        );
      } else {
        json = { flashError } as unknown as T;
      }
    }

    if (error) {
      (
        window as Window & {
          GTMtracker?: {
            pushEvent: (args: {
              event: string;
              data: { click_text: string; click_type: string };
            }) => void;
          };
        }
      ).GTMtracker?.pushEvent({
        event: "gtm_custom_click",
        data: {
          click_text: error,
          click_type: "Flash error",
        },
      });
    }
  }

  if (response.ok) {
    return json as T;
  }

  throw new ApiError<T>(response.statusText, response, json);
}

export type ApiRequestOptions = Omit<
  RequestInit,
  "method" | "headers" | "body"
> & {
  headers?: Record<string, string>;
  params?: QueryParams;
  dataType?: "FormData";
};

export async function apiRequest<T>(
  method: Method,
  path: string,
  body: unknown = null,
  options: ApiRequestOptions = {}
): Promise<T> {
  const deviceType = getDeviceType();
  const csrfMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  );

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-Accept-Flash": "true",
    "App-Name": deviceType,
    ...(csrfMeta ? { "X-CSRF-Token": csrfMeta.content } : {}),
  };

  const defaultOptions: RequestInit = { method };

  if (options.dataType === "FormData") {
    delete defaultHeaders["Content-Type"];
    defaultOptions.body = body as FormData;
  } else if (body && method !== "GET") {
    defaultOptions.body = JSON.stringify(body);
  }

  const { headers, params, ...remainingOptions } = options;
  const finalOptions: RequestInit = {
    ...defaultOptions,
    headers: { ...defaultHeaders, ...(headers || {}) },
    credentials: "same-origin",
    ...remainingOptions,
  };
  finalOptions.referrer = getURLWithUTMParams();
  if (params) {
    path += `?${searchParams(params)}`;
  } else if (
    method === "GET" &&
    body &&
    typeof body === "object" &&
    body !== null
  ) {
    path += `?${searchParams(body as QueryParams, true)}`;
  }

  const response = await fetch(path, finalOptions);
  return parseJsonResponse<T>(response);
}

export async function generateJWT(): Promise<string | undefined> {
  const csrfMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  );
  let token: string | undefined;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "text/plain",
      "X-Requested-With": "XMLHttpRequest",
      ...(csrfMeta?.content ? { "X-CSRF-Token": csrfMeta.content } : {}),
    };
    const response = await fetch("/generate-jwt", {
      method: "POST",
      headers,
      body: JSON.stringify({}),
    });
    if (!response.ok) throw new Error(String(response.status));
    token = await response.text();
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw error;
  }
  return token
}
