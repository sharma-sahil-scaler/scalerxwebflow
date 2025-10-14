import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
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

const SignupForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const currentYear = new Date().getFullYear();

  const graduationYears = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) =>
      (currentYear - 30 + i).toString()
    );
  }, [currentYear]);

  const handleSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    console.log(data);
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col justify-between"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div
          className={cn(
            "flex flex-col gap-2",
            "no-scrollbar max-h-[16rem] overflow-x-hidden overflow-y-auto"
          )}
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

          <FooterBtn currentStep="personal-detail" />
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
