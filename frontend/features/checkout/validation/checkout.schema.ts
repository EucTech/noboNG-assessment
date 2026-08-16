import { z } from "zod";

export const NIGERIAN_PHONE_PATTERN = /^(?:\+?234|0)[789][01]\d{8}$/;

export const NIGERIAN_STATES = [
  "Abia",
  "Abuja (FCT)",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(160, "Email is too long"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .refine(
      (value) => NIGERIAN_PHONE_PATTERN.test(value),
      "Enter a valid Nigerian phone number, for example +2348012345678",
    ),
  addressLine: z
    .string()
    .trim()
    .min(5, "Enter your street address")
    .max(160, "Address is too long"),
  city: z
    .string()
    .trim()
    .min(2, "Enter your city")
    .max(60, "City is too long"),
  state: z.enum(NIGERIAN_STATES, { message: "Select your state" }),
});

export type CheckoutFormValues = z.input<typeof checkoutSchema>;
export type CheckoutCustomer = z.output<typeof checkoutSchema>;
