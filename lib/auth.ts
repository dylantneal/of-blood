import { cookies } from "next/headers";

/**
 * Check if user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    return false;
  }
}

