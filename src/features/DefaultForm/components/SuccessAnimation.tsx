import { CheckCircle2 } from "lucide-react";

type SuccessAnimationProps = {
  title?: string;
  description?: string;
};

const SuccessAnimation = ({
  title = "Submission successful",
  description = "Thanks! Your details are submitted and your phone is verified.",
}: SuccessAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
      <div className="relative mb-2 h-24 w-24">
        <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
      </div>
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-base text-muted-foreground">{description}</div>
    </div>
  );
};

export default SuccessAnimation;
