import {
  BYPASS_UTM,
  GOOGLE_URL,
  ORGANIC_SEARCH,
  ORGANIC_SITE_LIST,
  ORGANIC_SOCIAL,
  ORGANIC_VIDEO,
  REFERRAL,
  SEARCH_SITE_LIST,
  UTM_MEDIUM_DEFAULT,
  UTM_SOURCE_DEFAULT,
  VIDEO_SITE_LIST,
} from "../constants/analytics";
import { getCookie, setCookie } from "./cookie";

function getUtmParamsFromSearch(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  params.forEach((value, key) => {
    if (key.startsWith("utm_")) {
      if (key === "utm_source") {
        utmParams[key] = value.includes("google.com") ? GOOGLE_URL : value;
      } else {
        utmParams[key] = value;
      }
    }
  });

  return utmParams;
}

function utmParamsToQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

function sameOrigin(url: string): boolean {
  const { host } = window.location;
  return url.includes(host);
}

function findDomain(arr: Array<string>, url: string): boolean {
  try {
    const hostnameArr = new URL(url).hostname.split(".");
    return arr.some((arrEle) => hostnameArr.includes(arrEle));
  } catch {
    return false;
  }
}

function getUtmParamsFromReferrer(): Record<string, string> {
  const utmParams: Record<string, string> = {};

  if (document.referrer && !sameOrigin(document.referrer)) {
    let utmMedium = REFERRAL;

    if (findDomain(SEARCH_SITE_LIST, document.referrer)) {
      utmMedium = ORGANIC_SEARCH;
    } else if (findDomain(ORGANIC_SITE_LIST, document.referrer)) {
      utmMedium = ORGANIC_SOCIAL;
    } else if (findDomain(VIDEO_SITE_LIST, document.referrer)) {
      utmMedium = ORGANIC_VIDEO;
    }

    utmParams.utm_medium = utmMedium;
    utmParams.utm_source = document.referrer.includes("google.com")
      ? GOOGLE_URL
      : document.referrer;
  } else {
    utmParams.utm_medium = UTM_MEDIUM_DEFAULT;
    utmParams.utm_source = UTM_SOURCE_DEFAULT;
  }

  return utmParams;
}

export function initializeUtmPropagation(): void {
  const cookieMinutes = 30;
  let utmParams = getUtmParamsFromSearch();
  let utmQuery = decodeURIComponent(utmParamsToQueryString(utmParams));

  if (!utmQuery) {
    utmQuery = getCookie(BYPASS_UTM) || "";

    if (!utmQuery) {
      utmParams = getUtmParamsFromReferrer();
      utmQuery = utmParamsToQueryString(utmParams);
    }
  }

  if (utmQuery) {
    if (!utmQuery.includes("utm_content")) {
      utmQuery += `&utm_content=${window.location.pathname}`;
    }

    utmQuery = decodeURIComponent(utmQuery);
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + cookieMinutes * 60 * 1000);
    setCookie(BYPASS_UTM, utmQuery, { expires: expiryDate });
  }
}

export function getUTMPropagationParams() {
  const utmQuery = getCookie(BYPASS_UTM) as string;
  const utmParams: Record<string, string> = {};
  if (utmQuery) {
    const params = utmQuery.split("&");
    if (params) {
      params.forEach((param) => {
        const [key, value] = param.split("=");

        utmParams[key] = value;
      });
    }
  }

  return utmParams;
}
