import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { adminUsers } from "./admin-users";

/**
 * Server-side admin login sessions.
 * Only a SHA-256 hash of the session token is stored; the raw token lives
 * in the admin's httpOnly cookie, so a database leak cannot be replayed.
 */
export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 500 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("admin_sessions_admin_id_idx").on(table.adminId),
    index("admin_sessions_expires_at_idx").on(table.expiresAt),
  ]
);
