import { declareComponent } from "@webflow/react";
import DefaultForm from "./DefaultForm";
import { props } from "@webflow/data-types";

const SignupFormComponent = declareComponent(DefaultForm, {
  name: "DefaultForm",
  description: "DefaultForm component",
  group: "General",
  props: {
    form_subtitle: props.Text({
      name: "Form Subtitle",
      defaultValue: "Powered by Scaler Companion",
    }),
  },
});


export default SignupFormComponent;
