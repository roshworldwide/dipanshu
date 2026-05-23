/**
 * Inquiry form contract. Shared by the client form (React Hook Form
 * resolver) and the server action — one schema, no drift.
 */
import { z } from "zod";

export const inquirySchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(80, "Name is too long."),
    company: z
      .string()
      .trim()
      .min(2, "Please enter your company name.")
      .max(120, "Company name is too long."),
    role: z
      .string()
      .trim()
      .min(2, "Please enter your role.")
      .max(80, "Role is too long."),
    website: z
      .string()
      .trim()
      .url("Please enter a valid URL (including https://).")
      .or(z.literal(""))
      .optional(),
    email: z.string().trim().email("Please enter a valid email address."),
    /** Honeypot — must stay empty. Bots tend to fill every field. */
    fax: z.string().optional(),
    /** Cognitive check: the SVG asks 2 + 3. */
    humanCheck: z.string().trim(),
  })
  // Object-level refine keeps `humanCheck` typed as a plain string.
  .refine((d) => d.humanCheck === "5", {
    message: "Please answer the question correctly.",
    path: ["humanCheck"],
  });

export type InquiryInput = z.infer<typeof inquirySchema>;

/** Fields the storage layer persists — derived, never trusts the client. */
export interface InquiryRecord {
  id: string;
  receivedAt: string;
  fullName: string;
  company: string;
  role: string;
  website: string;
  email: string;
  ipHash: string;
  userAgent: string;
}
