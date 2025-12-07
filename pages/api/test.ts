import dbConnect from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    res.status(200).json({ message: "MongoDB Connected Successfully 🎉" });
  } catch (error: any) {
    res.status(500).json({
      error: "Connection Failed ❌",
      details: error.message,
    });
  }
}
