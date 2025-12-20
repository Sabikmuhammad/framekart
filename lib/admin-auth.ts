import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function checkAdminAuth() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check Clerk public metadata for admin role
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const isAdmin = user.publicMetadata?.role === "admin";

  if (!isAdmin) {
    redirect("/403");
  }

  return { userId, user };
}
