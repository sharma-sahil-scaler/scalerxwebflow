export const getCookie = (cookieName: string) => {
  if (!cookieName) return undefined;

  const cookies = document.cookie.split(";");
  const gtmCookie = cookies.find((row) =>
    row.trim().startsWith(`${cookieName}=`)
  );
  const gtmCookieValue = gtmCookie?.split("=").slice(1).join("=");
  return gtmCookieValue ? decodeURIComponent(gtmCookieValue) : undefined;
};

export type CookieOptions = {
  path?: string;
  domain?: string;
  expires?: Date | string | number;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  ["max-age"]?: number | string;
};

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  const cookieOptions: Record<string, string | number | boolean> = {
    path: "/",
  };
  if (options.path) cookieOptions.path = options.path;
  if (options.domain) cookieOptions.domain = options.domain;
  if (options.expires instanceof Date) {
    cookieOptions.expires = options.expires.toUTCString();
  } else if (
    typeof options.expires === "string" ||
    typeof options.expires === "number"
  ) {
    cookieOptions.expires = options.expires;
  }
  if (typeof options.secure === "boolean")
    cookieOptions.secure = options.secure;
  if (options.sameSite) cookieOptions.sameSite = options.sameSite;
  if (options["max-age"] !== undefined)
    cookieOptions["max-age"] = options["max-age"];
  const cookieName = encodeURIComponent(name);
  const cookieValue = encodeURIComponent(value);
  let updatedCookie = `${cookieName}=${cookieValue}`;
  Object.keys(cookieOptions).forEach((key) => {
    updatedCookie += `; ${key}`;
    const v = cookieOptions[key];
    if (v !== true) {
      updatedCookie += `=${String(v)}`;
    }
  });
  document.cookie = updatedCookie;
};

export const deleteCookie = (name: string) => {
  setCookie(name, "", {
    "max-age": -1,
  });
};
