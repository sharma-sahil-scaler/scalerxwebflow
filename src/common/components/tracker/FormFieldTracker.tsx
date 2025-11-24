import { useFormFieldTracking } from "@/common/hooks/useFormFieldTracking";

interface TrackedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onFieldBlur?: (fieldId: string, value: string) => void;
}

export default function FormFieldTracker({
  children,
  onFieldBlur,
}: TrackedFormProps) {
  useFormFieldTracking({
    onFieldBlur,
  });

  return <>{children}</>;
}
