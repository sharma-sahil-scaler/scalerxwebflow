import BotVerification from "@/common/components/integrations/shadow-turnstile";
import { Checkbox } from "@/common/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import { PhoneInput } from "@/common/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { useWebflowContext } from "@webflow/react";
import attribution from "@/common/utils/attribution";
import { useTracking } from "@/common/hooks/useTracking";
import { $initialData } from "@/common/stores/initial-data";
import { toast } from "@/common/stores/toast";
import { ApiError } from "@/common/utils/api";
import {
  createUser,
  requestCallback,
  updateUser,
} from "@/features/CoursePageForm/api";
import { defaultFormStore } from "@/features/CoursePageForm/store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
  useRef,
  useId,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CREATE_REGISTRATION_ERROR_MAP, JOB_TITLE_OPTIONS } from "../constant";
import { FooterBtn } from "./FooterBtn";
import { createPortal } from "react-dom";

type UserProfile = {
  email?: string;
  phone_number?: string;
  orgyear?: string | number;
  whatsapp_consent?: boolean;
};

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  orgyear: z.string().min(4, { message: "Graduation year is required" }),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => value && isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
  position: z.string().min(1, { message: "Position is required" }),
  whatsapp_consent: z.boolean(),
});

const SignupForm = (props: {
  intent: string;
  siteKey: string;
  program: string;
  clickSource: string;
  clickSection: string;
}) => {
  const { siteKey, clickSource, clickSection } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone_number: "",
      orgyear: "",
      position: "",
      whatsapp_consent: false,
    },
  });
  const { mode } = useWebflowContext();
  console.log("Mode", mode)
  const slotRef = useRef<HTMLSlotElement | null>(null);
  const { trackClick, trackFormSubmitStatus } = useTracking();
  const currentYear = new Date().getFullYear();
  const initialData = useStore($initialData);
  const isLoggedIn = initialData?.data?.isLoggedIn;
  const isPhoneVerified = initialData?.data?.isPhoneVerified;
  const userData = initialData?.data?.userData as
    | UserProfile
    | null
    | undefined;
  const [token, setToken] = useState("");
  const id = useId();

  const graduationYears = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) =>
      (currentYear - 30 + i).toString()
    );
  }, [currentYear]);

  const handleTokenObtained = useCallback((token: string) => {
    setToken(token);
  }, []);

  const handleSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);
        trackClick({ click_text: "Get Started", click_type: "form_filled" });
        const parsedPhone = parsePhoneNumber(data.phone_number);
        const countryCode = `+${parsedPhone.countryCallingCode}`;
        const formattedNumber = `+${parsedPhone.countryCallingCode}-${parsedPhone.nationalNumber}`;

        const toWhatsappConsent = (consent: boolean) =>
          consent ? "whatsapp_consent_yes" : "whatsapp_consent_no";

        const basePayload = {
          account_type: "academy",
          type: "marketing",
          "cf-turnstile-response": token,
          source: "Course Page",
          user: {
            ...data,
            country_code: countryCode,
            phone_number: formattedNumber,
            skip_existing_user_check: true,
            whatsapp_consent: toWhatsappConsent(data.whatsapp_consent),
          },
        } as const;

        if (isPhoneVerified && isLoggedIn) {
          await requestCallback({
            attributions: attribution.getAttribution(),
            user: {
              program: "Online Mba",
              position: data.position,
            },
          });
        } else if (isLoggedIn) {
          await updateUser(basePayload);
        } else {
          await createUser(basePayload);
        }

        if (isPhoneVerified && isLoggedIn) {
          defaultFormStore.set({
            step: "success",
          });
          return;
        }
        toast.show({ title: "Signup successful", variant: "success" });
        trackFormSubmitStatus("signup_form_success");
        trackClick({ click_source: "form_first", click_type: "requested_otp" });
        trackClick({
          click_type: "lead_gen_request",
          custom: {
            ip: "rcb",
            source: clickSource,
            section: clickSection,
          },
        });
        defaultFormStore.set({
          step: "otp",
          email: data.email,
          phoneNumber: data.phone_number,
        });
      } catch (error: unknown) {
        let errorMessage = CREATE_REGISTRATION_ERROR_MAP.default;
        if (error instanceof ApiError) {
          const status = error.response?.status;
          errorMessage = CREATE_REGISTRATION_ERROR_MAP[status || "default"];
          toast.show({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast.show({ title: "Something went wrong", variant: "destructive" });
        }
        trackClick({
          click_type: "lead_gen_request_error",
          custom: {
            source: clickSource,
            section: clickSection,
            message: errorMessage,
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isLoggedIn,
      isPhoneVerified,
      token,
      trackClick,
      clickSection,
      clickSource,
      trackFormSubmitStatus,
    ]
  );

  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email || "",
        phone_number: (userData.phone_number || "").replace("-", ""),
        orgyear: (userData.orgyear || "").toString(),
        position: "",
        whatsapp_consent: true,
      });
    }
  }, [form, userData]);

  const handleFieldBlurTracking = useCallback(
    (name: string, value: string) => {
      console.log("Name", name);
      if (!value) return;

      trackClick({
        click_type: "form_input_filled",
        custom: {
          ip: "rcb",
          source: clickSource,
          section: clickSection,
          field_name: name,
        },
      });
    },
    [trackClick, clickSection, clickSource]
  );

  const findHost = () => {
    const root = slotRef.current?.getRootNode();
    if (root instanceof ShadowRoot) {
      return root.host as HTMLElement;
    }
    return null;

  }

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className={cn("flex flex-col gap-2 px-4 pb-6 sm:px-6")}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
                <FormControl>
                  <Input
                    className="h-10 rounded-none border-gray-300 sm:h-12"
                    placeholder="Email"
                    aria-describedby="email-message"
                    data-field-id="email"
                    type="email"
                    disabled={isLoggedIn && !!field.value}
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      handleFieldBlurTracking("email", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage id="email-message" />
              </FormItem>
            )}
          />
          <FormField
            name="orgyear"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full gap-2">
                <Select
                  disabled={isLoggedIn && !!field.value}
                  value={field.value}
                  onValueChange={(value: string) => {
                    handleFieldBlurTracking("orgyear", value);
                    field.onChange(value);
                  }}
                >
                  <FormControl className="!h-10 w-full text-base sm:!h-12">
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="h-58 w-full rounded-none">
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
            name="position"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full gap-2">
                <Select
                  value={field.value}
                  onValueChange={(value: string) => {
                    handleFieldBlurTracking("position", value);
                    field.onChange(value);
                  }}
                >
                  <FormControl className="!h-10 w-full rounded-none text-base sm:!h-12">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Job Title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="h-58 w-full rounded-none">
                    {JOB_TITLE_OPTIONS.map((jobTitle) => (
                      <SelectItem key={jobTitle.value} value={jobTitle.value}>
                        {jobTitle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone_number"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
                <FormControl className="h-10 sm:h-12">
                  <PhoneInput
                    className="flex w-full gap-4 rounded-none"
                    placeholder="Mobile Number"
                    aria-describedby="phone-message"
                    data-field-id="phone_number"
                    defaultCountry="IN"
                    disabled={isLoggedIn && !!field.value}
                    {...field}
                    onBlur={() => {
                      field.onBlur();
                      handleFieldBlurTracking("phone_number", field.value);
                    }}
                  />
                </FormControl>
                <FormMessage id="phone-message" />
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
                    checked={!!field.value}
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
          {mode === "publish" && findHost() && (
            <>
              <slot name={id} ref={slotRef}></slot>
              {createPortal(
                <div slot={id}>
                  <BotVerification
                    onTokenObtained={handleTokenObtained}
                    siteKey={siteKey}
                  />
                </div>,
                findHost()
              )}
            </>
          )}
        </div>
        <FooterBtn
          currentStep="personal-detail"
          isDisabled={isSubmitting}
          buttonWrapperClass="px-4 pb-6 sm:px-6"
        />
        <div className="-mt-2 self-center text-[0.65rem] whitespace-nowrap sm:text-sm">
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
      </form>
    </Form>
  );
};

export default memo(SignupForm);
