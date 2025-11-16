import { cookies } from "next/headers";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin-auth";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const ADMIN_SESSION_COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_DURATION_SECONDS,
  path: "/",
});

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.error("ADMIN_SESSION_SECRET is not configured");
    return null;
  }
  return secret;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeCompare(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

interface SessionParts {
  nonce: string;
  issuedAt: number;
  signature: string;
  payload: string;
}

function parseSessionToken(token: string): SessionParts | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [nonce, issuedAtRaw, signature] = parts;
  if (!nonce || !issuedAtRaw || !signature) {
    return null;
  }

  const issuedAt = Number(issuedAtRaw);
  if (Number.isNaN(issuedAt)) {
    return null;
  }

  return {
    nonce,
    issuedAt,
    signature,
    payload: `${nonce}.${issuedAtRaw}`,
  };
}

export function createSessionToken(): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  const nonce = randomUUID();
  const issuedAt = Date.now();
  const payload = `${nonce}.${issuedAt}`;
  const signature = signPayload(payload, secret);

  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  const secret = getSessionSecret();
  if (!secret) {
    return false;
  }

  const parsed = parseSessionToken(token);
  if (!parsed) {
    return false;
  }

  const isExpired = Date.now() - parsed.issuedAt > SESSION_DURATION_SECONDS * 1000;
  if (isExpired) {
    return false;
  }

  const expectedSignature = signPayload(parsed.payload, secret);
  return safeCompare(expectedSignature, parsed.signature);
}

/**
 * Check if user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!authCookie?.value) {
      return false;
    }

    return verifySessionToken(authCookie.value);
  } catch (error) {
    console.error("Failed to read admin session cookie", error);
    return false;
  }
}

