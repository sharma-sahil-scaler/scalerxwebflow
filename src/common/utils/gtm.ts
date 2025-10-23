/* eslint-disable */
// @ts-nocheck
import { GTM_ID } from "@/common/constants/analytics";
import { getCookie } from "@/common/utils/cookie";
import tracker from "@/common/utils/tracker";
import { deleteCookie } from "@/common/utils/cookie";

const COOKIE_KEY = "gtm_data"

export function lazyLoadGtm() {
  if (GTM_ID) {
    let isGTMLoaded = false;
    const loadGTM = () => {
      if (!isGTMLoaded) {
        isGTMLoaded = true;

        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          const f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != "dataLayer" ? "&l=" + l : "";
          j.defer = true;
          j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          j.addEventListener("load", function () {
            const _ge = new CustomEvent("initializedGTM", { bubbles: true });
            d.dispatchEvent(_ge);
          });
          f.parentNode?.insertBefore(j, f);
        })(window, document, "script", "dataLayer", GTM_ID);

        (function (a, s, y, n, c, h, i, d, e) {
          s.className += " " + y;
          h.start = 1 * new Date();
          h.end = i = function () {
            s.className = s.className.replace(RegExp(" ?" + y), "");
          };
          (a[n] = a[n] || []).hide = h;
          setTimeout(function () {
            i();
            h.end = null;
          }, c);
          h.timeout = c;
        })(window, document.documentElement, "async-hide", "dataLayer", 4000, {
          [GTM_ID]: true,
        });

        window.removeEventListener("mousemove", loadGTM);
        window.removeEventListener("click", loadGTM);
        window.removeEventListener("scroll", loadGTM);
        window.removeEventListener("touchstart", loadGTM);
        window.removeEventListener("bypass_gtm_optimisation", loadGTM);
      }
    };
    window.addEventListener("mousemove", loadGTM);
    window.addEventListener("click", loadGTM);
    window.addEventListener("scroll", loadGTM);
    window.addEventListener("touchstart", loadGTM);
    window.addEventListener("bypass_gtm_optimisation", loadGTM);
  }
}

export function pushServerEvents() {
  if (typeof window === "undefined") return;

  const cookieData = getCookie(COOKIE_KEY) as string;
  if (!cookieData) return;

  const decodedCookieData = decodeURIComponent(
    cookieData.replace(/\+/g, "%20")
  );
  const events = JSON.parse(decodedCookieData);
  if (!Array.isArray(events)) return;

  events.forEach((event: string) => {
    tracker.pushRawEvent(JSON.parse(event));
  });
  deleteCookie(COOKIE_KEY);
}
