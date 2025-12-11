import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, customerPhone, customerEmail, customerName, orderId } = await req.json();

    // Check if environment variables are set
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error("Cashfree credentials not configured");
      return NextResponse.json(
        { 
          success: false, 
          error: "Cashfree credentials not configured. Please add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to your .env.local file" 
        },
        { status: 500 }
      );
    }

    // Get the host dynamically from request headers
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const orderData = {
      order_amount: amount,
      order_currency: "INR",
      order_id: `order_${orderId}_${Date.now()}`,
      customer_details: {
        customer_id: `customer_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${baseUrl}/api/cashfree/callback?order_id=${orderId}`,
      },
    };

    console.log("Creating Cashfree order:", { order_id: orderData.order_id, amount: orderData.order_amount });

    const apiUrl = process.env.CASHFREE_ENVIRONMENT === "production"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API error response:", data);
      throw new Error(`Cashfree API error: ${data.message || JSON.stringify(data)}`);
    }

    console.log("Cashfree order created successfully:", data.order_id);

    return NextResponse.json({ 
      success: true, 
      data: {
        payment_session_id: data.payment_session_id,
        order_id: data.order_id,
      }
    });
  } catch (error: any) {
    console.error("Cashfree order creation error:", error.message);
    console.error("Full error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to create Cashfree order. Please check server logs.",
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
}
