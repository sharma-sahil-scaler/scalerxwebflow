import { useStore } from "@nanostores/react";
import { z } from "zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFormStore } from "@/features/DefaultForm/store";
import { verifyUser } from "@/features/DefaultForm/api";
import { parsePhoneNumber } from "libphonenumber-js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Flex } from "@/common/components/layout/flex";
import { toast } from "@/common/stores/toast";
import { PhoneInput } from "@/common/components/ui/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/common/components/ui/input-otp";
import { ApiError } from "@/common/utils/api";
import { FooterBtn } from "./FooterBtn";
import { VERIFY_OTP_ERROR_MAP } from "../constant";
import { useTracking } from "@/common/hooks/useTracking";

const otpSchema = z.object({
  otp: z.string().min(4, { message: "Enter OTP" }),
});

const OtpForm = (props: {
  attributions?: {
    intent: string;
    platform: string;
    product: string;
    sub_product: string;
  };
}) => {
  const { attributions } = props;
  const { email, phoneNumber } = useStore(defaultFormStore);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  });
  const { trackError, trackClick } = useTracking();

  const handleSubmit = useCallback(
    async (data: z.infer<typeof otpSchema>) => {
      try {
        const parsedPhone = parsePhoneNumber(phoneNumber || "");
        const formattedNumber = `+${parsedPhone.countryCallingCode}-${parsedPhone.nationalNumber}`;

        trackClick({ click_source: "otp_form", click_type: "otp_submit" });
        setSubmitting(true);
        await verifyUser({
          attributions,
          user: {
            email: email || "",
            phone_number: formattedNumber || "",
            skip_existing_user_check: true,
            otp: data.otp,
          },
        });
        toast.show({
          title: "OTP verification successful",
          variant: "success",
        });
        trackClick({ click_source: "otp_form", click_type: "otp_verified" });
        defaultFormStore.set({ step: "success" });
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          const status = error.response?.status;
          const errorMessage = VERIFY_OTP_ERROR_MAP[status || "default"];
          toast.show({
            title: "OTP verification failed",
            description: errorMessage,
            variant: "destructive",
          });
          trackError("otp_verification_error", errorMessage);
        } else {
          toast.show({
            title: "OTP verification failed",
            description: "Something went wrong",
            variant: "destructive",
          });
          trackError("otp_verification_error", "Something went wrong");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [attributions, email, phoneNumber, trackClick, trackError]
  );

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Flex
          className="gap max-h-[20rem] overflow-y-auto"
          direction="col"
          gap="md"
        >
          <FormItem className="mt-2 mr-2 flex w-full flex-col gap-2">
            <FormControl className="h-10 sm:h-12">
              <PhoneInput
                className="flex w-full gap-4"
                disabled
                value={phoneNumber}
                placeholder="Mobile Number"
                aria-describedby="phone-message"
              />
            </FormControl>
            <FormMessage id="phone-message" />
          </FormItem>

          <FormField
            name="otp"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-start">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP
                    containerClassName="w-full"
                    maxLength={6}
                    {...field}
                    data-field-id="otp"
                  >
                    <InputOTPGroup className="my-2 w-full justify-between gap-4">
                      {Array.from({ length: 6 }).map((_, index) => {
                        return (
                          <InputOTPSlot
                            key={index}
                            className="h-12 flex-1 rounded-xl"
                            index={index}
                          />
                        );
                      })}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Flex>
        <FooterBtn currentStep="otp" isDisabled={submitting} />
      </form>
    </Form>
  );
};

export default OtpForm;
