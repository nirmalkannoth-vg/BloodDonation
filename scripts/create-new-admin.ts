/**
 * Create (or update) an admin user in the Neon database.
 *
 * If an admin with the same email already exists, their name, role and
 * password are updated and the account is re-activated — so this also works
 * as a password reset.
 *
 * USAGE:
 *   npm run script:create-admin -- <email> <full_name> <password> [role]
 *
 * EXAMPLES:
 *   npm run script:create-admin -- "john@example.com" "John Doe" "S3cure-pass!"
 *   npm run script:create-admin -- "jane@example.com" "Jane Doe" "S3cure-pass!" ADMIN
 *
 * ROLES:
 *   SUPER_ADMIN  - Full access: can manage admin users, view audit logs, all settings
 *   ADMIN        - Standard access: manage donors, requests, content, notifications
 *
 * Default role is SUPER_ADMIN if not specified.
 */

import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminUsers } from "../src/db/schema/admin-users";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../src/lib/auth/password";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

const [rawEmail, fullName, password, role] = process.argv.slice(2);

if (!rawEmail || !fullName || !password) {
  console.error(
    "\n❌ Missing required arguments.\n" +
    "Usage: npm run script:create-admin -- <email> <full_name> <password> [role]\n" +
    'Example: npm run script:create-admin -- "admin@ngo.org" "Admin Name" "S3cure-pass!" SUPER_ADMIN\n'
  );
  process.exit(1);
}

const email = rawEmail.trim().toLowerCase();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(`\n❌ "${rawEmail}" is not a valid email address.\n`);
  process.exit(1);
}

if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`\n❌ Password must be at least ${MIN_PASSWORD_LENGTH} characters.\n`);
  process.exit(1);
}

const validRoles = ["SUPER_ADMIN", "ADMIN"];
const adminRole = (role || "SUPER_ADMIN").toUpperCase() as "SUPER_ADMIN" | "ADMIN";

if (!validRoles.includes(adminRole)) {
  console.error(`\n❌ Invalid role "${role}". Must be SUPER_ADMIN or ADMIN.\n`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("\n❌ DATABASE_URL is not set in .env.local\n");
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
const db = drizzle(client);

async function main() {
  console.log("\n👤 Creating admin user...");
  console.log(`   Email   : ${email}`);
  console.log(`   Name    : ${fullName}`);
  console.log(`   Role    : ${adminRole}\n`);

  const passwordHash = await hashPassword(password);

  const [admin] = await db
    .insert(adminUsers)
    .values({
      email,
      fullName,
      passwordHash,
      role: adminRole,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: {
        fullName,
        passwordHash,
        role: adminRole,
        isActive: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  console.log("✅ Admin user created/updated successfully!\n");
  console.log("📋 Record:");
  console.log(`   ID      : ${admin.id}`);
  console.log(`   Email   : ${admin.email}`);
  console.log(`   Name    : ${admin.fullName}`);
  console.log(`   Role    : ${admin.role}`);
  console.log(`   Active  : ${admin.isActive}`);
  console.log(`   Created : ${admin.createdAt}\n`);
  console.log("👉 The user can now log in at /admin/login with this email and password.\n");
}

main()
  .then(() => client.end())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error("\n❌ Error:", err.message);
    await client.end().catch(() => {});
    process.exit(1);
  });
