export type BaseAttributes = Record<string, unknown>;

export type CustomAttributes = BaseAttributes & {
  custom?: BaseAttributes;
};

export type PageViewAttributes = BaseAttributes & {
  page_path?: string;
  page_title?: string;
  page_url?: string;
  query_params?: Record<string, string>;
};

export type ClickAttributes = CustomAttributes;
export type HoverAttributes = CustomAttributes;

export type FormSubmitStatusAttributes = CustomAttributes & {
  form_id: string;
  status: boolean;
};

export const GTMEventType = {
  PAGE_VIEW: "we_page_load",
  CLICK: "gtm_custom_click",
  HOVER: "hover",
  FORM_SUBMIT_STATUS: "form_submit_status",
} as const;
export type GTMEventType = (typeof GTMEventType)[keyof typeof GTMEventType];

export type EventPayload = {
  event: string;
  attributes: BaseAttributes;
  custom_attributes?: BaseAttributes;
};

export type TrackerConfig = {
  attributes?: {
    attributes?: BaseAttributes;
    custom?: BaseAttributes;
  };
  isEnabled?: boolean;
};

type PendingEvent = {
  event: string;
  attributes: CustomAttributes;
};

const DEFAULT_CONFIG: Required<Omit<TrackerConfig, "attributes">> & {
  attributes: NonNullable<TrackerConfig["attributes"]>;
} = {
  isEnabled: true,
  attributes: {},
};

// ---------- small utils ----------
function isUndefined(v: unknown): v is undefined {
  return typeof v === "undefined";
}
function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const out: Record<string, unknown> = Array.isArray(target)
    ? { ...(target as unknown as Record<string, unknown>) }
    : { ...target };
  Object.keys(source || {}).forEach((key) => {
    const sVal = (source as Record<string, unknown>)[key];
    const tVal = out[key];
    if (isObject(tVal) && isObject(sVal)) {
      out[key] = deepMerge(
        tVal as Record<string, unknown>,
        sVal as Record<string, unknown>
      );
    } else {
      out[key] = sVal as unknown;
    }
  });
  return out as T;
}
function removeEmptyKeys<T extends Record<string, unknown>>(obj: T): T {
  if (!isObject(obj)) return obj;
  const out: Record<string, unknown> = {};
  Object.keys(obj).forEach((k) => {
    const v = (obj as Record<string, unknown>)[k];
    if (!isUndefined(v) && v !== null && v !== "") {
      out[k] = isObject(v) ? removeEmptyKeys(v as Record<string, unknown>) : v;
    }
  });
  return out as T;
}

// ---------- Tracker ----------

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

class Tracker {
  _platform: "web" | "android" | "ios";
  _isLoggedIn: boolean;
  _isEnabled: boolean;
  _shouldTrack: boolean;
  _pendingList: PendingEvent[];
  _pushToPendingList: boolean;
  _superAttributes: {
    attributes?: BaseAttributes;
    custom?: BaseAttributes;
  };

  constructor(config: TrackerConfig = {}) {
    const finalConfig: Required<Omit<TrackerConfig, "attributes">> & {
      attributes?: TrackerConfig["attributes"];
    } = { ...DEFAULT_CONFIG, ...config };
    this._platform = "web";
    this._isLoggedIn = false;
    this._isEnabled = Boolean(finalConfig.isEnabled);
    this._shouldTrack = true;
    this._superAttributes = finalConfig.attributes || {};
    this._pendingList = [];
    this._pushToPendingList = false;

    this._initialiseDataLayer();
    // this._enhancePublicMethods();
  }

  _isWindowUndefined(): boolean {
    return typeof window === "undefined";
  }

  _initialiseDataLayer(): void {
    if (this._isWindowUndefined()) return;

    window.dataLayer ||= [];
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  get shouldTrack(): boolean {
    return this._shouldTrack;
  }

  get superAttributes(): {
    attributes?: BaseAttributes;
    custom?: BaseAttributes;
  } {
    return this._superAttributes;
  }

  set superAttributes(attributes: {
    attributes?: BaseAttributes;
    custom?: BaseAttributes;
  }) {
    this._superAttributes = deepMerge(this.superAttributes, attributes);
  }

  set isLoggedIn(status: boolean) {
    this._isLoggedIn = status;
  }

  set pushToPendingList(shouldPush: boolean) {
    this._pushToPendingList = shouldPush;

    if (!shouldPush) {
      this._pushPendingEvents();
    }
  }

  _pushPendingEvents(): void {
    if (this._pendingList.length) {
      this._pendingList.forEach(({ event, attributes }) =>
        this._trackEvent(event, attributes)
      );
      this._pendingList = [];
    }
  }

  _createEventPayload(
    event: string,
    _attributes: CustomAttributes
  ): EventPayload {
    const { custom: customAttributes, ...attributes } = _attributes;
    const {
      custom: customSuperAttributes = {},
      attributes: superAttributes = {},
    } = this.superAttributes;

    return {
      event,
      attributes: {
        is_logged_in: this._isLoggedIn,
        ...superAttributes,
        ...attributes,
      },
      custom_attributes: {
        ...customSuperAttributes,
        ...(customAttributes as BaseAttributes | undefined),
      },
    };
  }

  _pushToDataLayer(payload: EventPayload | Record<string, unknown>): void {
    window.dataLayer!.push({
      _clear: true,
      ...payload,
    });
  }

  _logEvent(payload: { event: string }): void {
    console.info(
      `"${payload.event}" event has been received with below payload: `,
      payload
    );
  }

  _trackEvent(
    event: GTMEventType | string,
    _attributes: CustomAttributes
  ): void {
    if (!this.isEnabled) return;
    if (this._pushToPendingList) {
      this._pendingList.push({
        event: String(event),
        attributes: _attributes,
      });
      return;
    }

    const attributes = removeEmptyKeys(_attributes);
    const eventPayload = this._createEventPayload(String(event), attributes);

    if (this.shouldTrack) {
      this._pushToDataLayer(eventPayload);
    } else {
      this._logEvent(eventPayload);
    }
  }

  _createPageViewAttributes(attributes: BaseAttributes): PageViewAttributes {
    const { title } = window.document;
    const url = new URL(window.location.href);

    return {
      page_title: title,
      page_path: url.pathname,
      page_url: url.href,
      query_params: Object.fromEntries(url.searchParams),
      ...attributes,
    };
  }

  pushRawEvent(event: Record<string, unknown>): void {
    this._pushToDataLayer(event);
  }

  click(attributes: CustomAttributes): void {
    this._trackEvent(GTMEventType.CLICK, attributes);
  }

  pageview(attributes: Partial<PageViewAttributes> = {}): void {
    const finalAttributes = this._createPageViewAttributes(
      attributes as BaseAttributes
    );
    this._trackEvent(GTMEventType.PAGE_VIEW, finalAttributes);
  }

  hover(attributes: CustomAttributes): void {
    this._trackEvent(GTMEventType.HOVER, attributes);
  }

  formSubmitStatus(attributes: FormSubmitStatusAttributes): void {
    this._trackEvent(GTMEventType.FORM_SUBMIT_STATUS, attributes);
  }
}

const tracker = new Tracker({});
export default tracker;
