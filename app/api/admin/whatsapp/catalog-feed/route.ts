import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all frames (products) directly using Mongoose connection
    const db = mongoose.connection.db as any;
    const frames = await db.collection("frames").find({}).toArray();
    
    // Meta Catalog required headers
    const headers = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand"
    ];

    const rows = [headers.join(",")];

    const baseUrl = "https://framekart.co.in";

    for (const frame of frames) {
      // Format price correctly, Meta expects e.g., "499.00 INR"
      const priceString = `${frame.price}.00 INR`;
      
      // Determine image link
      let imgLink = frame.imageUrl || (frame.images && frame.images[0]) || "";
      if (imgLink.startsWith("/")) {
        imgLink = `${baseUrl}${imgLink}`;
      }
      if (!imgLink) {
        imgLink = `${baseUrl}/images/branding/Frame-2.png`;
      }

      // Escape quotes and commas in fields for CSV
      const escapeCsv = (str: string) => {
        if (!str) return '""';
        const stringified = String(str);
        if (stringified.includes(",") || stringified.includes('"') || stringified.includes('\n')) {
          return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
      };

      const title = escapeCsv(frame.name);
      const desc = escapeCsv(frame.description || "Premium frame by FrameKart");
      const link = escapeCsv(`${baseUrl}/frames/${frame.slug}`);
      const imageLink = escapeCsv(imgLink);

      const row = [
        frame.slug,            // id (mapped to product_retailer_id)
        title,                 // title
        desc,                  // description
        "in stock",            // availability
        "new",                 // condition
        priceString,           // price
        link,                  // link
        imageLink,             // image_link
        "FrameKart"            // brand
      ];

      rows.push(row.join(","));
    }

    const csvData = rows.join("\n");

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="framekart_catalog.csv"'
      }
    });
  } catch (error: any) {
    console.error("Error generating catalog feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
