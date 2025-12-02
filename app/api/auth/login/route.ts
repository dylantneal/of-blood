import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
  createSessionToken,
} from "@/lib/auth";
import { RateLimiters } from "@/lib/rate-limit";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute (prevent brute force)
  const rateLimitResult = await RateLimiters.auth(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    if (!ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Check password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const sessionToken = createSessionToken();
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, ADMIN_SESSION_COOKIE_OPTIONS);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

