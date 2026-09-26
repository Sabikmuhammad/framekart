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
        console.warn(`[WA CATALOG FEED] Validation Failure: Product '${frame.slug}' is missing an image.`);
        continue;
      }

      // Validate Image URL
      try {
        const imgRes = await fetch(imgLink, { method: "HEAD", signal: AbortSignal.timeout(5000) });
        if (!imgRes.ok) {
          console.warn(`[WA CATALOG FEED] Validation Failure: Image for '${frame.slug}' returned HTTP ${imgRes.status} (${imgLink})`);
          continue;
        }
      } catch (e: any) {
        console.warn(`[WA CATALOG FEED] Validation Failure: Could not reach image for '${frame.slug}' (${imgLink}) - ${e.message}`);
        continue;
      }

      // Validate Product Link URL
      const productLink = `${baseUrl}/frames/${frame.slug}`;
      try {
        const linkRes = await fetch(productLink, { method: "HEAD", signal: AbortSignal.timeout(5000) });
        if (!linkRes.ok) {
          console.warn(`[WA CATALOG FEED] Validation Failure: Link for '${frame.slug}' returned HTTP ${linkRes.status} (${productLink})`);
          continue;
        }
      } catch (e: any) {
        console.warn(`[WA CATALOG FEED] Validation Failure: Could not reach link for '${frame.slug}' (${productLink}) - ${e.message}`);
        continue;
      }

      // Determine availability
      const availability = (frame.stock && frame.stock > 0) ? "in stock" : "out of stock";

      // Escape quotes and commas in fields for CSV
      const escapeCsv = (str: string) => {
        if (!str) return '""';
        const stringified = String(str);
        if (stringified.includes(",") || stringified.includes('"') || stringified.includes('\n')) {
          return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
      };

      const title = escapeCsv(frame.title || frame.name || "Untitled Product");
      const desc = escapeCsv(frame.description || "Premium frame by FrameKart");
      const link = escapeCsv(productLink);
      const imageLink = escapeCsv(imgLink);

      const row = [
        frame.slug,            // id (mapped to product_retailer_id)
        title,                 // title
        desc,                  // description
        availability,          // availability
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
