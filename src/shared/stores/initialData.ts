import { nanoquery } from "@nanostores/query";
import { apiRequest, generateJWT } from "../utils/api";
import { addMeta } from "../utils/dom";

type InitialData = {
  isLoggedIn: boolean;
  isPhoneVerified: boolean;
  userData: unknown | null;
};

type CsrfResponse = { csrf_token: string };
type UserAttributes = { phone_verified: boolean } & Record<string, unknown>;
type UserResponse = { data: { attributes: UserAttributes } };

export const [createFetcherStore, , { mutateCache }] = nanoquery({
  fetcher: async () => {
    const { csrf_token: csrfToken } =
      (await apiRequest<CsrfResponse>(
        "GET",
        "/csrf-token"
      )) || {};

    if (csrfToken) addMeta("csrf-token", csrfToken);

    const token = await generateJWT();
    if (!token) throw new Error("Failed to load JWT");

    const {
      data: { attributes },
    } = await apiRequest<UserResponse>(
      "GET",
      "/api/v3/users",
      null,
      {
        headers: {
          "X-User-Token": token,
        },
      }
    );

    const result: InitialData = {
      isLoggedIn: true,
      isPhoneVerified: Boolean(attributes?.phone_verified),
      userData: attributes ?? null,
    };
    return result;
  },

  onError: (error: unknown) => {
    console.error("Error fetching initial data:", error);
  },
  dedupeTime: Infinity,
  cacheLifetime: Infinity,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateInterval: 0,
  onErrorRetry: null,
});

const defaultInitialData: InitialData = {
  isLoggedIn: false,
  isPhoneVerified: false,
  userData: {},
};

export const $initialData = createFetcherStore<InitialData | null>(["/auth"]);
mutateCache("/auth", defaultInitialData);
