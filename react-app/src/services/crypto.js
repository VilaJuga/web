// ── Password hashing via Web Crypto PBKDF2 ────────────────────
// Hash format (string): "pbkdf2$<iterations>$<saltHex>$<hashHex>"
//
// We use the native SubtleCrypto API — no external dependencies.
// 100k iterations of SHA-256, 16-byte salt, 32-byte derived key.

const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function deriveKey(password, saltBytes, iterations, keyBytes) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    keyBytes * 8
  );
}

/** Hashes a plain password. Returns a self-contained hash string. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await deriveKey(password, salt, ITERATIONS, HASH_BYTES);
  return `pbkdf2$${ITERATIONS}$${bufferToHex(salt)}$${bufferToHex(derived)}`;
}

/** Verifies a plain password against a stored hash string. */
export async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string") return false;
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  const salt = hexToBuffer(parts[2]);
  const expectedHex = parts[3];
  const derived = await deriveKey(password, salt, iterations, expectedHex.length / 2);
  return bufferToHex(derived) === expectedHex;
}
