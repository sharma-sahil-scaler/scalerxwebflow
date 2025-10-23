export const GTMEventType = {
  PAGE_VIEW: 'we_page_load',
  CLICK: 'gtm_custom_click',
  HOVER: 'hover',
  FORM_SUBMIT_STATUS: 'form_submit_status',
} as const;
export type GTMEventType = (typeof GTMEventType)[keyof typeof GTMEventType];

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

export type ViewAttributes = BaseAttributes & {
  element_id?: string;
  element_location?: string;
  element_type?: string;
};

export type HoverAttributes = CustomAttributes;

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

export type PendingEvent = {
  event: string;
  attributes: CustomAttributes;
};

export type FormSubmitStatusAttributes = CustomAttributes & {
  form_id: string;
  status: boolean;
};
