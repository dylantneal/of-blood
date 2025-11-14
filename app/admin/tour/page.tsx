import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { TourAdminClient } from "./tour-admin-client";

export default async function TourAdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <TourAdminClient />;
}
