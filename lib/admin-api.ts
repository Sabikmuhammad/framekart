import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export interface AdminApiUser {
  clerkId: string;
  role: "admin";
  email?: string;
  name?: string;
}

export async function requireAdminApiUser() {
  const { userId } = auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId }).lean<AdminApiUser | null>();
  if (!user || user.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}
