import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { RateLimiters } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute (more lenient for auth checks)
  const rateLimitResult = await RateLimiters.api(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const authenticated = await isAuthenticated();
    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

