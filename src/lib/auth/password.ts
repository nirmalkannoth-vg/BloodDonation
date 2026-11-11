import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Kept free of "@/..." and Next.js imports so CLI scripts can use it too.

const KEY_LENGTH = 64;
const SALT_BYTES = 16;
const DEFAULT_PARAMS = { N: 16384, r: 8, p: 1 } as const;

export const MIN_PASSWORD_LENGTH = 8;

function deriveKey(password: string, salt: Buffer, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

/** Returns a self-describing hash: scrypt$N$r$p$<salt b64>$<key b64> */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const { N, r, p } = DEFAULT_PARAMS;
  const key = await deriveKey(password, salt, { N, r, p });
  return ["scrypt", N, r, p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltB64, keyB64] = parts;
  const expected = Buffer.from(keyB64, "base64");
  const actual = await deriveKey(password, Buffer.from(saltB64, "base64"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
