import { useStore } from "@nanostores/react";
import { $initialData } from "@/shared/stores/initialData";
import { useEffect } from "react";
import {
  getUTMPropagationParams,
  initializeUtmPropagation,
} from "@/shared/utils/analytics";
import { lazyLoadGtm, pushServerEvents } from "@/shared/utils/gtm";
import ToastHost from "@/shared/components/ToastHost";
import tracker from "@/shared/utils/tracker";
import { getURLWithUTMParams } from "@/shared/utils/url";

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

  return (
    <>
      <ToastHost />
    </>
  );
};

export default InitialLoad;
