"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/security/rate-limit";

export interface ContactResult {
  success: boolean;
  error?: string;
}

/**
 * Stores a contact-form message as an admin notification
 * (Admin → Notifications), so no message is lost.
 */
export async function submitContactMessage(data: ContactInput): Promise<ContactResult> {
  const validation = contactSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { name, email, phone, subject, message, website } = validation.data;

  // Bots fill the hidden field — pretend it worked and drop it
  if (website) return { success: true };

  const headersList = await headers();
  const ip = (headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown")
    .split(",")[0]
    .trim();

  const rateLimit = await checkRateLimit(`contact:${ip}`, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rateLimit.success) {
    return {
      success: false,
      error: "You've sent several messages already. Please try again later or call us.",
    };
  }

  try {
    const contactLine = [email, phone ? `+91 ${phone}` : null].filter(Boolean).join(" · ");

    await db.insert(notifications).values({
      type: "CONTACT_MESSAGE",
      title: `Contact: ${subject} — ${name}`.slice(0, 255),
      message: `${contactLine}\n\n${message}`,
      entityType: "contact_message",
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving contact message:", error);
    return { success: false, error: "Couldn't send your message. Please try again or call us." };
  }
}
