import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Spinner } from "@/common/components/ui/spinner";
import { useStore } from "@nanostores/react";
import { defaultFormStore } from "./store";
import SignupForm from "./components/SignupForm";
import OtpStep from "./components/OtpForm";
import SuccessAnimation from "./components/SuccessAnimation";
import { $initialData } from "@/common/stores/initial-data";
import { $formTrigger } from "@/common/hooks/useFormTrigger";

type DefaultFormProps = {
  form_subtitle: string;
  signup_intent: string;
  otp_intent: string;
  form_title: string;
  turnstile_key: string;
  program: string;
  force_click_section?: string;
  force_click_source?: string;
};

const FormStep = ({
  forceSignupIntent,
  forceOtpIntent,
  siteKey,
  program,
  forceClickSource,
  forceClickSection,
}: {
  forceSignupIntent?: string;
  forceOtpIntent?: string;
  forceClickSource?: string;
  forceClickSection?: string;
  siteKey: string;
  program: string;
}) => {
  const { step } = useStore(defaultFormStore);
  const {
    clickSource: triggerClickSource,
    clickSection: triggerClickSection,
    signupIntent: triggerSignupIntent,
    otpIntent: triggerOtpIntent,
  } = useStore($formTrigger);

  const clickSource = forceClickSource || triggerClickSource || "unknown";
  const clickSection = forceClickSection || triggerClickSection || "unknown";
  const signupIntent = forceSignupIntent || triggerSignupIntent || "rcb_form";
  const otpIntent = forceOtpIntent || triggerOtpIntent || "rcb_form";

  switch (step) {
    case "signup":
      return (
        <SignupForm
          intent={signupIntent}
          {...{ siteKey, program, clickSource, clickSection }}
        />
      );
    case "otp":
      return (
        <OtpStep
          intent={otpIntent}
          {...{ program, clickSource, clickSection }}
        />
      );
    case "success":
      return <SuccessAnimation />;
    default:
      return null;
  }
};

const CoursePageForm = (props: DefaultFormProps) => {
  const {
    form_subtitle: formSubtitle,
    signup_intent: signupIntent,
    otp_intent: otpIntent,
    form_title: formTitle,
    turnstile_key: siteKey,
    force_click_section: forceClickSection,
    force_click_source: forceClickSource,
    program,
  } = props;

  const initialStore = useStore($initialData);
  const loading = initialStore?.loading ?? false;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card
          className="h-full w-full items-center justify-center gap-2 rounded-none bg-[#fafbfc] py-4"
          aria-label="Test Issuance Form"
        >
          <Spinner className="size-12" />
        </Card>
      </div>
    );
  } else {
    return (
      <div className="flex h-full items-center justify-center">
        <Card
          className="h-full w-full gap-2 rounded-none border-hidden bg-[#fafbfc] py-4"
          aria-label="Test Issuance Form"
        >
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl">{formTitle}</CardTitle>
            <CardDescription className="text-base">
              {formSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-auto flex-col px-0">
            <FormStep
              {...{
                signupIntent,
                otpIntent,
                siteKey,
                program,
                forceClickSection,
                forceClickSource,
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default CoursePageForm;
