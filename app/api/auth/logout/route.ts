import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
} from "@/lib/auth";
import { RateLimiters } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting: 10 requests per minute
  const rateLimitResult = await RateLimiters.api(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const cookieStore = await cookies();
    cookieStore.delete({
      name: ADMIN_SESSION_COOKIE,
      path: ADMIN_SESSION_COOKIE_OPTIONS.path,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}

