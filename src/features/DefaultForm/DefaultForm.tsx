import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useStore } from "@nanostores/react";
import { defaultFormStore } from "./store";
import SignupForm from "./components/SignupForm";
import OtpStep from "./components/OtpForm";


type DefaultFormProps = {
  form_subtitle: string;
};

const FormStep = () => {
  const { step } = useStore(defaultFormStore);

  switch (step) {
    case 'signup':
      return <SignupForm />;
    case 'otp':
      return <OtpStep />;
  }
};

const DefaultForm = (props: DefaultFormProps) => {
  const { form_subtitle: formSubtitle } = props;
  const { step } = useStore(defaultFormStore);

  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card
        className="no-scrollbar gap-2 overflow-y-scroll bg-[#fafbfc] py-4 sm:aspect-[430/420] sm:max-h-[80vh] sm:w-[30rem] sm:max-w-[50rem]"
        aria-label="Test Issuance Form"
        role="form"
      >
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-xl">Form Title</CardTitle>
          <CardDescription className="text-base">
            {formSubtitle}
            {step}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-auto flex-col px-4 pb-6 sm:px-6">
          <FormStep />
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultForm;
