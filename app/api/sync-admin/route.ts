import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Get user from MongoDB
    const dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Update Clerk publicMetadata with role from MongoDB
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: dbUser.role,
      },
    });

    return NextResponse.json({ 
      success: true, 
      role: dbUser.role,
      message: "Role synced to Clerk successfully" 
    });
  } catch (error) {
    console.error("Error syncing admin role:", error);
    return NextResponse.json({ error: "Failed to sync role" }, { status: 500 });
  }
}
