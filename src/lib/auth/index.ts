import { cache } from "react";
import { redirect } from "next/navigation";
import { lookupSession, destroySession } from "./session";
import type { AdminRole } from "@/types";

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  admin: {
    id: string;
    email: string;
    fullName: string;
    role: AdminRole;
    isActive: boolean;
  };
}

// Deduplicated per request (layout + page both call this)
const getLookup = cache(lookupSession);

function toSession(admin: AdminSession["admin"]): AdminSession {
  return {
    user: { id: admin.id, email: admin.email },
    admin: { ...admin, role: admin.role as AdminRole },
  };
}

export async function getSession(): Promise<AdminSession | null> {
  const result = await getLookup();
  return result.status === "active" ? toSession(result.admin) : null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const result = await getLookup();

  if (result.status === "none") {
    redirect("/admin/login");
  }

  if (result.status === "inactive") {
    redirect("/admin/unauthorized");
  }

  return toSession(result.admin);
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (session.admin.role !== "SUPER_ADMIN") {
    redirect("/admin/dashboard?error=unauthorized");
  }

  return session;
}

export function hasPermission(
  session: AdminSession,
  requiredRole: AdminRole
): boolean {
  if (requiredRole === "ADMIN") {
    return session.admin.role === "ADMIN" || session.admin.role === "SUPER_ADMIN";
  }
  return session.admin.role === requiredRole;
}

/** Must be called from a Server Action or Route Handler. */
export async function signOut() {
  await destroySession();
}
