import { z } from "zod";

import {
  emailLoginFormSchema,
  otpFormSchema,
  phoneLoginFormSchema,
} from "@/schema/forms/login-form";

export enum FormStep {
  EMAIL_LOGIN = "email_login",
  OTP_LOGIN = "otp",
  PHONE_LOGIN = "phone_login",
}

export interface LoginFormSchema {
  emailForm: EmailLoginFormSchema;
  otpForm: OtpFormData;
  phoneForm: PhoneLoginFormSchema;
}

export interface LoginFormContextType {
  currentStep: FormStep;
  formData: LoginFormSchema;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: FormStep) => void;
  resetForm: () => void;
  updateFormData: (data: Partial<LoginFormSchema>) => void;
}

export type EmailLoginFormSchema = z.infer<typeof emailLoginFormSchema>;
export type PhoneLoginFormSchema = z.infer<typeof phoneLoginFormSchema>;
export type OtpFormData = z.infer<typeof otpFormSchema>;
