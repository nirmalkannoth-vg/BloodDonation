import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Blood Donation",
  "Blood Request",
  "Organise a Camp",
  "Volunteer",
  "Feedback",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(255),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{10}$/.test(v), "Phone number must be 10 digits")
    .optional(),
  subject: z.enum(CONTACT_SUBJECTS, {
    errorMap: () => ({ message: "Please choose what this is about" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  /** Honeypot — real users never see or fill this field. */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
