import { NextRequest, NextResponse } from "next/server";
import { getShows } from "@/lib/data";
import { isAuthenticated } from "@/lib/auth";
import { RateLimiters } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting: 3 requests per minute (strict for admin endpoints)
  const rateLimitResult = await RateLimiters.admin(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const shows = await getShows();
    return NextResponse.json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

