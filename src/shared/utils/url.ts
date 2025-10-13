import { getCookie } from "./cookie";

const BYPASS_UTM = 'bypass_utm';
const UTM_MEDIUM = 'utm_medium';
const UTM_SOURCE = 'utm_source';

export function getURLWithUTMParams(): string {
  let pageUrl = window.location.href;
  const utmQuery = getCookie(BYPASS_UTM);
  if (
    !pageUrl.includes(UTM_MEDIUM)
    && !pageUrl.includes(UTM_SOURCE)
    && utmQuery
  ) {
    const nonUtmQuery = window.location.search;
    pageUrl += nonUtmQuery ? `&${utmQuery}` : `?${utmQuery}`;
  }
  return pageUrl;
}