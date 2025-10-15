import { useCallback, useMemo, useState } from "react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useStore } from "@nanostores/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/shared/stores/toast";
import { ApiError } from "@/shared/utils/api";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FooterBtn } from "./FooterBtn";
import { defaultFormStore } from "../store";
import { createUser, updateUser } from "../api";
import { useTracking } from "@/shared/hooks/useTracking";
import { $initialData } from "@/shared/stores/initialData";
import { parsePhoneNumber } from "libphonenumber-js";
import TurnstileVerification from "@/shared/components/Turnstile/Turnstile";
import { CREATE_REGISTRATION_ERROR_MAP } from "../constant";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  orgyear: z.string().min(4, { message: "Graduation year is required" }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => value && isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
  whatsapp_consent: z.boolean(),
});

const SignupForm = (props: {
  attributions?: {
    intent: string;
    platform: string;
    product: string;
    sub_product: string;
  };
  turnstileKey: string;
}) => {
  const { attributions } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { trackClick, trackFormSubmitStatus, trackError } = useTracking();
  const currentYear = new Date().getFullYear();
  const initialData = useStore($initialData);
  const isLoggedIn = initialData?.data?.isLoggedIn;
  const [token, setToken] = useState("");

  const graduationYears = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) =>
      (currentYear - 30 + i).toString()
    );
  }, [currentYear]);

  const handleSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);
        trackClick({ click_text: "Get Started", click_type: "form_filled" });
        const parsedPhone = parsePhoneNumber(data.phone);
        const formattedNumber = `+${parsedPhone.countryCallingCode}-${parsedPhone.nationalNumber}`;
        const payload = {
          account_type: "academy",
          attributions,
          "cf-turnstile-response": token,
          type: "marketing",
          user: {
            ...data,
            country_code: `+${parsedPhone.countryCallingCode}`,
            phone_number: formattedNumber,
            skip_existing_user_check: true,
            whatsapp_consent: data.whatsapp_consent
              ? "whatsapp_consent_yes"
              : "whatsapp_consent_no",
          },
        };

        if (isLoggedIn) {
          await updateUser(payload);
        } else {
          await createUser(payload);
        }
        toast.show({ title: "Signup successful", variant: "success" });
        defaultFormStore.set({
          step: "otp",
          email: data.email,
          phoneNumber: data.phone,
        });
        trackFormSubmitStatus("signup_form_success");
        trackClick({ click_source: "form_first", click_type: "requested_otp" });
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          const status = error.response?.status;
          const errorMessage =
            CREATE_REGISTRATION_ERROR_MAP[status || "default"];
          toast.show({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive",
          });
          trackError("signup_form_error", errorMessage);
        } else {
          toast.show({ title: "Something went wrong", variant: "destructive" });
          trackError("signup_form_error", "Something went wrong");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      attributions,
      isLoggedIn,
      token,
      trackClick,
      trackError,
      trackFormSubmitStatus,
    ]
  );

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div
          className={cn("flex flex-col gap-2", "no-scrollbar overflow-y-auto")}
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
                <FormControl>
                  <Input
                    className="h-10 sm:h-12"
                    placeholder="Name"
                    aria-describedby="name-message"
                    data-field-id="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="name-message" />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
                <FormControl>
                  <Input
                    className="h-10 sm:h-12"
                    placeholder="Email"
                    aria-describedby="email-message"
                    data-field-id="email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="email-message" />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
                <FormControl className="h-10 sm:h-12">
                  <PhoneInput
                    className="flex w-full gap-4"
                    placeholder="Mobile Number"
                    aria-describedby="phone-message"
                    data-field-id="phone"
                    defaultCountry="IN"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="phone-message" />
              </FormItem>
            )}
          />
          <FormField
            name="orgyear"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full gap-2">
                <Select
                  value={field.value}
                  onValueChange={(value: string) => {
                    field.onChange(value);
                  }}
                >
                  <FormControl className="!h-10 w-full text-base sm:!h-12">
                    <SelectTrigger>
                      <SelectValue placeholder="Graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="h-58 w-full">
                    {graduationYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="whatsapp_consent"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    className="mr-0 data-[state=checked]:border-none data-[state=checked]:bg-[#006AFF]"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription className="text-foreground text-[0.65rem] md:text-xs">
                    I wish to receive updates & confirmation via WhatsApp
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <div className="-mt-2 text-[0.65rem] whitespace-nowrap sm:text-sm">
            By continuing you agree to &nbsp;
            <a
              className="text-blue-600 hover:underline"
              href="https://scaler.com/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Scaler's Terms
            </a>
            &nbsp; and &nbsp;
            <a
              className="text-blue-600 hover:underline"
              href="https://scaler.com/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>
          <TurnstileVerification
            siteKey={props.turnstileKey}
            onTokenObtained={setToken}
          />
          <FooterBtn currentStep="personal-detail" isDisabled={isSubmitting} />
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
