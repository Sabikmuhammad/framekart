import dbConnect from "../lib/db";
import User from "../models/User";

// Update this with your Clerk user ID
const CLERK_USER_ID = "YOUR_CLERK_USER_ID_HERE";

async function makeAdmin() {
  try {
    await dbConnect();
    
    const user = await User.findOneAndUpdate(
      { clerkId: CLERK_USER_ID },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log("✅ User updated to admin successfully!");
      console.log("User:", user);
    } else {
      console.log("❌ User not found with Clerk ID:", CLERK_USER_ID);
      console.log("\nTip: Check your MongoDB database or sign in first to create the user via webhook.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

makeAdmin();
