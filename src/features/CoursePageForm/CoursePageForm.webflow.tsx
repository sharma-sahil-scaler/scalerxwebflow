import { declareComponent } from "@webflow/react";
import DefaultForm from "./CoursePageForm";
import { props } from "@webflow/data-types";

import "@/global.css";

const SignupFormComponent = declareComponent(DefaultForm, {
  name: "CoursePageForm",
  description: "CoursePageForm component",
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
    form_title: props.Text({
      name: "Form Title",
      defaultValue: "Talk To a Scaler Career Counsellor",
    }),
    program: props.Variant({
      name: "Page Program",
      group: "Property",
      options: ["academy", "data_science", "devops", "ai_ml"],
      defaultValue: "academy"
    }),
    force_click_section: props.Text({
      name: "Force Click Section",
      defaultValue: "Click Section For Mixpanel",
    }),
    force_click_source: props.Text({
      name: "Force Click Source",
      defaultValue: "Click Source For Mixpanel",
    })

  },
  options: {
    ssr: false,
  },
});

export default SignupFormComponent;
