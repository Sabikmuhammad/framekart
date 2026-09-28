import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { pincode: string } }
) {
  try {
    const { pincode } = params;

    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, message: "Invalid pincode format" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Upstream API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Pincode API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch pincode details" },
      { status: 500 }
    );
  }
}
