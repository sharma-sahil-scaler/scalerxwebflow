import { z } from "zod";

export const emailLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const phoneLoginFormSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 digits" })
    .max(15, { message: "Phone number too long" }),
});

export const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
});
