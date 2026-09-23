import { getCurrentUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";

export async function checkAdminAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin-login");
  }

  const isAdmin = user.role === "ADMIN";

  if (!isAdmin) {
    redirect("/403");
  }

  return { userId: user._id.toString(), user };
}
