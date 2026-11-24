import {timingSafeEqual} from "node:crypto";

const ALGORITHM = "pbkdf2";
const DIGEST = "sha256";
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const KEY_BYTES = 32;

const encoder = new TextEncoder();

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {name: "PBKDF2", hash: "SHA-256", salt, iterations},
    key,
    KEY_BYTES * 8
  );
  return Buffer.from(bits);
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return [
    ALGORITHM,
    DIGEST,
    ITERATIONS,
    Buffer.from(salt).toString("base64url"),
    hash.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password, stored) {
  const [algorithm, digest, iterations, salt, hash] = String(stored).split("$");

  if (algorithm !== ALGORITHM || digest !== DIGEST || !salt || !hash) return false;

  const count = Number(iterations);
  if (!Number.isInteger(count) || count < 1) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), count);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
