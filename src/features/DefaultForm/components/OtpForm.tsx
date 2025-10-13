import { Button } from "../../../components/ui/button";
import { defaultFormStore } from "../store";

const OtpForm = () => {
  return (
    <div>
      OtpForm
      <Button
        onClick={() => {
          defaultFormStore.set({ step: "signup" });
        }}
      >
        Signup
      </Button>
    </div>
  );
};

export default OtpForm;
