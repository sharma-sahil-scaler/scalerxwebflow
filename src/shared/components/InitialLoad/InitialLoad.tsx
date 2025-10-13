import { useStore } from "@nanostores/react";
import { $initialData } from "../../stores/initalData";
import { useEffect } from "react";
import {
  getUTMPropagationParams,
  initializeUtmPropagation,
} from "../../utils/analytics";
import { lazyLoadGtm, pushServerEvents } from "../../utils/gtm";
import tracker from "../../utils/tracker";
import { getURLWithUTMParams } from "../../utils/url";

const InitialLoad = ({
  product,
  subProduct,
}: {
  product: string;
  subProduct: string;
}) => {
  const { data, error } = useStore($initialData);
  const { isLoggedIn } = data ?? {};

  useEffect(() => {
    initializeUtmPropagation();
    lazyLoadGtm();
    pushServerEvents();
  }, []);

  useEffect(() => {
    const pageUrl = getURLWithUTMParams();
    const url = new URL(window.location.href);

    tracker.pushToPendingList = true;
    tracker.superAttributes = {
      attributes: {
        product: product,
        subproduct: subProduct,
        page_path: url.pathname,
        page_url: url.href,
        query_params: Object.fromEntries(url.searchParams.entries()) as Record<
          string,
          string
        >,
        utm_propagation_params: getUTMPropagationParams(),
      },
    };

    tracker.pageview({
      page_url: pageUrl,
    });
  }, [product, subProduct]);

  useEffect(() => {
    if (isLoggedIn || error) {
      tracker.pushToPendingList = false;
      tracker.isLoggedIn = !!isLoggedIn;
    }
  }, [isLoggedIn, error]);

  return null;
};

export default InitialLoad;
