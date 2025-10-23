import { useCallback } from "react";

import tracker, { type CustomAttributes } from "@/common/utils/tracker";
import { type EventPayload } from "@/common/types/gtm";

export const useTracking = () => {
  const trackClick = useCallback(
    (attributes: CustomAttributes) => {
      tracker.click(attributes);
    },
    [],
  );

  const trackPageView = useCallback(
    (attributes = {}) => {
      tracker.pageview(attributes);
    },
    [],
  );

  const trackHover = useCallback(
    (attributes: CustomAttributes) => {
      tracker.hover(attributes);
    },
    [],
  );

  const trackRawEvent = useCallback(
    (event: EventPayload) => {
      tracker.pushRawEvent(event);
    },
    [],
  );

  const setLoggedIn = useCallback(
    (status: boolean) => {
      tracker.isLoggedIn = status;
    },
    [],
  );

  const setSuperAttributes = useCallback(
    (attributes: object) => {
      tracker.superAttributes = attributes;
    },
    [],
  );

  const trackError = useCallback(
    (clickType: string, message: string) => {
      trackClick({
        click_type: clickType,
        custom: { message },
      });
    },
    [trackClick],
  );

  const trackFormSubmitStatus = useCallback(
    (status: string, attributes?: object) => {
      trackClick({
        form_status: status,
        ...attributes,
      });
    },
    [trackClick],
  );

  const trackGtmFormSubmitStatus = useCallback(
    (formId: string, status: boolean, attributes?: object) => {
      tracker.formSubmitStatus({
        form_id: formId,
        status,
        ...attributes,
      });
    },
    [],
  );

  return {
    setLoggedIn,
    setSuperAttributes,
    trackClick,
    trackError,
    trackFormSubmitStatus,
    trackGtmFormSubmitStatus,
    trackHover,
    trackPageView,
    trackRawEvent
  };
};
