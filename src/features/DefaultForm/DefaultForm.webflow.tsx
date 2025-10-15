import { declareComponent } from "@webflow/react";
import DefaultForm from "./DefaultForm";
import { props } from "@webflow/data-types";

import "@/global.css";

const SignupFormComponent = declareComponent(DefaultForm, {
  name: "DefaultForm",
  description: "DefaultForm component",
  group: "General",
  props: {
    form_subtitle: props.Text({
      name: "Form Subtitle",
      defaultValue: "Powered by Scaler Companion",
    }),
    turnstile_key: props.Text({
      name: "Turnstile Key",
      defaultValue: "",
    }),
    signup_intent: props.Text({
      name: "Signup Intent",
      defaultValue: "",
    }),
    otp_intent: props.Text({
      name: "Otp Intent",
      defaultValue: "",
    }),
    product: props.Text({
      name: "Product",
      defaultValue: "",
    }),
    sub_product: props.Text({
      name: "Sub Product",
      defaultValue: "",
    }),
    platform: props.Text({
      name: "Platform",
      defaultValue: "",
    }),
    form_title: props.Text({
      name: "Form Title",
      defaultValue: "Talk To a Scaler Career Counsellor",
    }),
  },
  options: {
    ssr: false,
  },
});

export default SignupFormComponent;
