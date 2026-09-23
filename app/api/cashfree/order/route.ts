/**
 * Cashfree Payment Gateway - Order Creation API
 * 
 * This endpoint creates a payment order with Cashfree PG v2 API
 * and returns a payment_session_id required for SDK checkout.
 * 
 * Flow:
 * 1. Validate input data (amount, customer details, orderId)
 * 2. Create order in Cashfree with proper configuration
 * 3. Return payment_session_id to frontend
 * 4. Frontend uses SDK to open checkout modal
 * 
 * Environment Variables Required:
 * - CASHFREE_CLIENT_ID: App ID from Cashfree dashboard
 * - CASHFREE_CLIENT_SECRET: Secret key from Cashfree dashboard
 * - CASHFREE_ENV: "sandbox" or "production"
 */

import { NextRequest, NextResponse } from "next/server";
import { CashfreeOrderSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = CashfreeOrderSchema.parse(body);
    const { amount, customerPhone, customerEmail, customerName, orderId, trackingToken } = validatedData;

    console.log("📦 Creating Cashfree order for:", { orderId, amount, customerEmail });

    // ===== Environment Configuration =====
    const environment = process.env.CASHFREE_ENV || "sandbox";
    const isProd = environment === "production";
    
    const clientId = isProd 
      ? process.env.CASHFREE_CLIENT_ID 
      : (process.env.CASHFREE_TEST_CLIENT_ID || process.env.CASHFREE_CLIENT_ID);
      
    const clientSecret = isProd 
      ? process.env.CASHFREE_CLIENT_SECRET 
      : (process.env.CASHFREE_TEST_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET);

    // Validate credentials
    if (!clientId || !clientSecret) {
      console.error("❌ Cashfree credentials not configured");
      return NextResponse.json(
        { 
          success: false, 
          error: "Payment gateway not configured. Please contact support.",
          details: process.env.NODE_ENV === "development" 
            ? "Missing CASHFREE_CLIENT_ID or CASHFREE_CLIENT_SECRET in environment variables"
            : undefined
        },
        { status: 500 }
      );
    }

    // Determine API URL based on environment
    const apiUrl = environment === "production"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    console.log("🔧 Using Cashfree environment:", environment);

    // ===== Construct Return/Callback URLs =====
    // Use NEXT_PUBLIC_APP_URL if set (production), otherwise construct from host
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const baseUrl = appUrl || `https://${req.headers.get('host') || 'localhost:3000'}`;
    
    let returnUrl = `${baseUrl}/api/cashfree/callback?db_order_id=${orderId}`;
    if (trackingToken) {
      returnUrl += `&token=${trackingToken}`;
    }
    const notifyUrl = `${baseUrl}/api/cashfree/webhook`;

    // ===== Verify Order & Amount Server-Side =====
    const dbConnect = (await import("@/lib/db")).default;
    const Order = (await import("@/models/Order")).default;
    await dbConnect();
    
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      console.error("❌ Order not found for Cashfree payment:", orderId);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    
    // Security: Do NOT trust frontend amount. Use server-calculated amount.
    const serverAmount = dbOrder.totalAmount || amount;

    // Normalize phone number (digits only, max 10 for India)
    let normalizedPhone = customerPhone.replace(/\D/g, '');
    if (normalizedPhone.length > 10) {
      normalizedPhone = normalizedPhone.slice(-10);
    }
    
    // ===== Create Cashfree Order Payload =====
    // Generate unique order ID (Cashfree requires alphanumeric + underscore/hyphen only)
    const cashfreeOrderId = `order_${orderId}_${Date.now()}`;
    
    const orderPayload = {
      order_id: cashfreeOrderId,
      order_amount: parseFloat(serverAmount.toFixed(2)), // Ensure 2 decimal places
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: normalizedPhone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
      order_note: `FrameKart Order ${orderId}`,
    };

    console.log("📤 Sending to Cashfree:", {
      order_id: orderPayload.order_id,
      amount: orderPayload.order_amount,
      currency: orderPayload.order_currency,
      customer: orderPayload.customer_details.customer_email,
    });

    // ===== Call Cashfree API =====
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(orderPayload),
    });

    const responseData = await response.json();

    // ===== Handle API Response =====
    if (!response.ok) {
      console.error("❌ Cashfree API error (Safe Log):", {
        status: response.status,
        type: responseData.type,
        code: responseData.code,
        environment,
        credentialsConfigured: !!clientId && !!clientSecret
      });

      // Return detailed error in development, generic in production
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to initialize payment. Please try again.",
          details: process.env.NODE_ENV === "development" 
            ? `Cashfree error: ${responseData.message || responseData.type || 'Unknown error'}`
            : undefined
        },
        { status: 400 }
      );
    }

    // ===== Validate Response Data =====
    if (!responseData.payment_session_id) {
      console.error("❌ No payment_session_id in response:", responseData);
      return NextResponse.json(
        { 
          success: false, 
          error: "Payment initialization failed. Invalid response from payment gateway.",
          details: process.env.NODE_ENV === "development" 
            ? "Missing payment_session_id in Cashfree response"
            : undefined
        },
        { status: 500 }
      );
    }

    console.log("✅ Cashfree order created successfully");
    console.log("📋 Order ID:", responseData.order_id);
    console.log("🔑 Session ID:", responseData.payment_session_id);

    // ===== Update Database with Cashfree Order ID =====
    try {
      await Order.findByIdAndUpdate(orderId, {
        cashfreeOrderId: responseData.order_id,
        paymentStatus: "pending",
      });
      
      console.log("✅ Database updated with Cashfree order ID");
    } catch (dbError) {
      console.error("⚠️ Failed to update database (non-fatal):", dbError);
      // Continue - payment can still proceed
    }

    // ===== Return Success Response =====
    return NextResponse.json({ 
      success: true, 
      data: {
        payment_session_id: responseData.payment_session_id,
        order_id: responseData.order_id,
      }
    });

  } catch (error: any) {
    console.error("❌ Cashfree order creation failed:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid payment data provided",
          details: process.env.NODE_ENV === "development" 
            ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
            : undefined
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: "Payment initialization failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
