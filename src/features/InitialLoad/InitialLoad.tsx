import { useStore } from "@nanostores/react";
import { $initialData } from "@/common/stores/initial-data";
import { useEffect } from "react";
import {
  getUTMPropagationParams,
  initializeUtmPropagation,
} from "@/common/utils/analytics";
import { lazyLoadGtm, pushServerEvents } from "@/common/utils/gtm";
import ToastHost from "@/common/components/ui/shadow-toast";
import tracker from "@/common/utils/tracker";
import { getURLWithUTMParams } from "@/common/utils/url";
import { useAnalyticsHandler } from "@/common/hooks/useAnalyticsHandler";
import attribution from "@/common/utils/attribution";

const InitialLoad = ({
  product,
  subProduct,
}: {
  product: string;
  subProduct: string;
}) => {
  const { data, error } = useStore($initialData);
  const { isLoggedIn } = data ?? {};

  useAnalyticsHandler();

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

    attribution.setPlatform();
    attribution.setProduct(product);
    tracker.pageview({
      page_url: pageUrl,
    });
  }, [product, subProduct]);

  useEffect(() => {
    if (isLoggedIn || error) {
      tracker.isLoggedIn = !!isLoggedIn;
      tracker.pushToPendingList = false;
    }
  }, [isLoggedIn, error]);

  return (
    <>
      <ToastHost />
    </>
  );
};

export default InitialLoad;
