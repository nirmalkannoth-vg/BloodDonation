"use server";

import { db } from "@/db";
import { adminUsers, auditLogs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { headers } from "next/headers";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export interface AuthResult {
  success: boolean;
  error?: string;
}

// Used when the email doesn't exist so response time doesn't reveal valid accounts
let dummyHash: Promise<string> | null = null;
function getDummyHash() {
  dummyHash ??= hashPassword("not-a-real-password");
  return dummyHash;
}

export async function signIn(data: LoginInput): Promise<AuthResult> {
  try {
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    const email = validation.data.email.trim().toLowerCase();
    const { password } = validation.data;

    const headersList = await headers();
    const ip = (headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown")
      .split(",")[0]
      .trim();
    const userAgent = headersList.get("user-agent");

    const rateLimit = await checkRateLimit(`login:${ip}:${email}`, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.success) {
      return {
        success: false,
        error: "Too many login attempts. Please try again in a few minutes.",
      };
    }

    let admin;
    try {
      const result = await db
        .select()
        .from(adminUsers)
        .where(eq(sql`lower(${adminUsers.email})`, email))
        .limit(1);
      admin = result[0];
    } catch {
      return {
        success: false,
        error: "Unable to verify admin access. Please try again.",
      };
    }

    const passwordOk = await verifyPassword(
      password,
      admin?.passwordHash ?? (await getDummyHash())
    );

    if (!admin || !passwordOk) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!admin.isActive) {
      return {
        success: false,
        error: "Your admin account has been deactivated",
      };
    }

    await createSession(admin.id, { ipAddress: ip, userAgent });

    // Bookkeeping — non-blocking, never fail the login if these fail
    try {
      await db
        .update(adminUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(adminUsers.id, admin.id));
      await db.insert(auditLogs).values({
        adminId: admin.id,
        action: "ADMIN_LOGIN",
        entityType: "admin_user",
        entityId: admin.id,
        ipAddress: ip,
        metadata: {
          email: admin.email,
          userAgent,
        },
      });
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) throw err;
    return {
      success: false,
      error: "An error occurred during sign in. Please try again.",
    };
  }
}

export async function signOut(): Promise<void> {
  await destroySession();
}
