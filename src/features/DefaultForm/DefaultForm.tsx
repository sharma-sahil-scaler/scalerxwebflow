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

type DefaultFormProps = {
  form_subtitle: string;
  signup_intent: string;
  otp_intent: string;
  product: string;
  sub_product: string;
  platform: string;
  form_title: string;
  turnstile_key: string;
};

const FormStep = ({
  signupIntent,
  otpIntent,
  siteKey,
}: {
  signupIntent: string;
  otpIntent: string;
  product: string;
  subProduct: string;
  platform: string;
  siteKey: string;
}) => {
  const { step } = useStore(defaultFormStore);

  switch (step) {
    case "signup":
      return (
        <SignupForm
          intent={signupIntent}
          {...{ siteKey }}
        />
      );
    case "otp":
      return (
        <OtpStep
          intent={otpIntent}
        />
      );
    case "success":
      return <SuccessAnimation />;
    default:
      return null;
  }
};

const DefaultForm = (props: DefaultFormProps) => {
  const {
    form_subtitle: formSubtitle,
    signup_intent: signupIntent,
    otp_intent: otpIntent,
    product: product,
    sub_product: subProduct,
    platform: platform,
    form_title: formTitle,
    turnstile_key: siteKey,
  } = props;

  const initialStore = useStore($initialData);
  const loading = initialStore?.loading ?? false;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Card
          className="no-scrollbar gap-2 overflow-y-scroll items-center justify-center bg-[#fafbfc] py-4 sm:aspect-[430/420] sm:max-h-[80vh] sm:w-[30rem] sm:max-w-[50rem]"
          aria-label="Test Issuance Form"
        >
          <Spinner className="size-12" />
        </Card>
      </div>
    );
  } else {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Card
          className="no-scrollbar gap-2 overflow-y-scroll bg-[#fafbfc] py-4 sm:aspect-[430/420] sm:max-h-[80vh] sm:w-[30rem] sm:max-w-[50rem]"
          aria-label="Test Issuance Form"
        >
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl">{formTitle}</CardTitle>
            <CardDescription className="text-base">
              {formSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-auto flex-col px-4 pb-6 sm:px-6">
            <FormStep
              {...{
                signupIntent,
                otpIntent,
                product,
                subProduct,
                platform,
                siteKey,
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default DefaultForm;
