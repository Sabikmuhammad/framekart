import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Please sign in first" }, { status: 401 });
    }

    await dbConnect();
    
    // Update user role in MongoDB
    const dbUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { role: "admin" },
      { new: true }
    );

    if (!dbUser) {
      return NextResponse.json({ 
        error: "User not found in database. Please sign in first to create your user record.",
        userId 
      }, { status: 404 });
    }

    // Sync role to Clerk publicMetadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "admin",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "✅ You are now an admin! Refresh the page to see admin buttons.",
      user: {
        id: dbUser.clerkId,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role
      }
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    return NextResponse.json({ 
      error: "Failed to update role",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
