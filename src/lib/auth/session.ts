import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, lt } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";

export const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a DB session for the admin and sets the httpOnly cookie.
 * Must be called from a Server Action or Route Handler.
 */
export async function createSession(
  adminId: string,
  meta: { ipAddress?: string | null; userAgent?: string | null } = {}
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Housekeeping: drop this admin's expired sessions
  await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.adminId, adminId), lt(adminSessions.expiresAt, new Date())));

  await db.insert(adminSessions).values({
    tokenHash: hashToken(token),
    adminId,
    ipAddress: meta.ipAddress?.slice(0, 45) ?? null,
    userAgent: meta.userAgent?.slice(0, 500) ?? null,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export type SessionLookup =
  | { status: "none" }
  | { status: "inactive" }
  | {
      status: "active";
      admin: {
        id: string;
        email: string;
        fullName: string;
        role: "ADMIN" | "SUPER_ADMIN";
        isActive: boolean;
      };
    };

/** Reads the session cookie and validates it against the database. */
export async function lookupSession(): Promise<SessionLookup> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return { status: "none" };

  const [row] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      fullName: adminUsers.fullName,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, hashToken(token)), gt(adminSessions.expiresAt, new Date())))
    .limit(1);

  if (!row) return { status: "none" };
  if (!row.isActive) return { status: "inactive" };
  return { status: "active", admin: row };
}

/**
 * Deletes the current session from the DB and clears the cookie.
 * Must be called from a Server Action or Route Handler.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    try {
      await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)));
    } catch {
      // Still clear the cookie even if the DB delete fails
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
