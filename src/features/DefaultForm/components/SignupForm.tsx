import { Button } from "../../../components/ui/button";
import { defaultFormStore } from "../store";

const SignupForm = () => {
  return (
    <div>
      SignupForm
      <Button
        onClick={() => {
          defaultFormStore.set({ step: "otp" });
        }}
      >
        Otp
      </Button>
    </div>
  );
};

export default SignupForm;
