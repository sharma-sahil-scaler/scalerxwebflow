import { declareComponent } from "@webflow/react";
import InitialLoad from "./InitialLoad";
import { props } from "@webflow/data-types";

import "@/global.css";

const InitialLoadComponent = declareComponent(InitialLoad, {
  name: "InitialLoad",
  description: "InitialLoad component",
  group: "General",
  props: {
    product: props.Text({
      name: "Page Product",
      defaultValue: "online_mba_page",
    }),
    subProduct: props.Text({
      name: "Page Subproduct",
      defaultValue: "home",
    }),
  },
  options: {
    ssr: false,
  },
});

export default InitialLoadComponent;
