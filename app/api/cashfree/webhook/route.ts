/**
 * Cashfree Payment Gateway - Webhook Handler
 * 
 * This endpoint receives webhook notifications from Cashfree for payment status updates.
 * Webhooks are more reliable than redirect callbacks as they work even if user closes browser.
 * 
 * Flow:
 * 1. Receive webhook POST request from Cashfree
 * 2. Verify signature to ensure request is from Cashfree
 * 3. Process payment status (SUCCESS, FAILED, USER_DROPPED, etc.)
 * 4. Update order in database
 * 5. Send confirmation email on success
 * 6. Return 200 OK to acknowledge receipt
 * 
 * Important: Must return 200 OK within 10 seconds or Cashfree will retry
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = 'force-dynamic';

/**
 * Verify Cashfree webhook signature
 * Signature = Base64(HMAC-SHA256(raw_body, client_secret))
 */
function verifyWebhookSignature(
  rawBody: string, 
  receivedSignature: string, 
  clientSecret: string
): boolean {
  try {
    const expectedSignature = createHmac('sha256', clientSecret)
      .update(rawBody)
      .digest('base64');
    
    return expectedSignature === receivedSignature;
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const webhookId = `webhook_${Date.now()}`; // For tracking in logs
  
  try {
    console.log(`\n🔔 [${webhookId}] Webhook received from Cashfree`);
    
    // ===== Get Raw Body for Signature Verification =====
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // ===== Verify Signature =====
    const signature = req.headers.get('x-webhook-signature');
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    
    if (!clientSecret) {
      console.error(`❌ [${webhookId}] CASHFREE_CLIENT_SECRET not configured`);
      return NextResponse.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 }
      );
    }
    
    if (!signature) {
      console.error(`❌ [${webhookId}] No signature in webhook`);
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }
    
    const isValidSignature = verifyWebhookSignature(rawBody, signature, clientSecret);
    
    if (!isValidSignature) {
      console.error(`❌ [${webhookId}] Invalid webhook signature`);
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }
    
    console.log(`✅ [${webhookId}] Signature verified`);
    
    // ===== Extract Webhook Data =====
    const { 
      type,
      data 
    } = body;
    
    console.log(`📋 [${webhookId}] Webhook type: ${type}`);
    
    // ===== Handle Different Event Types =====
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order } = data;
      const cashfreeOrderId = order?.order_id;
      
      if (!cashfreeOrderId) {
        console.error(`❌ [${webhookId}] Missing order_id in webhook`);
        return NextResponse.json({ success: false }, { status: 400 });
      }
      
      console.log(`💰 [${webhookId}] Payment SUCCESS for order: ${cashfreeOrderId}`);
      
      // Find our order by Cashfree order ID
      await dbConnect();
      const dbOrder = await Order.findOne({ cashfreeOrderId });
      
      if (!dbOrder) {
        console.error(`❌ [${webhookId}] Order not found: ${cashfreeOrderId}`);
        // Return 200 to prevent retries for non-existent order
        return NextResponse.json({ 
          success: true, 
          message: "Order not found" 
        });
      }
      
      // Check if already processed (idempotency)
      if (dbOrder.paymentStatus === "completed") {
        console.log(`⚠️ [${webhookId}] Order already processed: ${dbOrder._id}`);
        return NextResponse.json({ 
          success: true, 
          message: "Already processed" 
        });
      }
      
      // Extract payment details
      const payment = data.payment;
      const paymentId = payment?.cf_payment_id;
      const paymentMethod = payment?.payment_group;
      const paymentTime = payment?.payment_time;
      
      // Update order
      dbOrder.paymentStatus = "completed";
      dbOrder.status = "Processing";
      dbOrder.paymentId = paymentId;
      dbOrder.paymentMethod = paymentMethod;
      dbOrder.paidAt = paymentTime ? new Date(paymentTime) : new Date();
      
      await dbOrder.save();
      
      console.log(`✅ [${webhookId}] Order updated: ${dbOrder._id}`);
      
      // Send confirmation email (don't wait for it)
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email');
        sendOrderConfirmationEmail(dbOrder).catch(emailError => {
          console.error(`❌ [${webhookId}] Email failed:`, emailError);
        });
      } catch (error) {
        console.error(`❌ [${webhookId}] Email import failed:`, error);
      }
      
      return NextResponse.json({ success: true });
      
    } else if (type === "PAYMENT_FAILED_WEBHOOK") {
      const { order } = data;
      const cashfreeOrderId = order?.order_id;
      
      console.log(`❌ [${webhookId}] Payment FAILED for order: ${cashfreeOrderId}`);
      
      await dbConnect();
      const dbOrder = await Order.findOne({ cashfreeOrderId });
      
      if (dbOrder && dbOrder.paymentStatus !== "completed") {
        dbOrder.paymentStatus = "failed";
        dbOrder.status = "Failed";
        await dbOrder.save();
        console.log(`✅ [${webhookId}] Order marked as failed: ${dbOrder._id}`);
      }
      
      return NextResponse.json({ success: true });
      
    } else if (type === "PAYMENT_USER_DROPPED_WEBHOOK") {
      const { order } = data;
      const cashfreeOrderId = order?.order_id;
      
      console.log(`⚠️ [${webhookId}] User DROPPED payment: ${cashfreeOrderId}`);
      
      await dbConnect();
      const dbOrder = await Order.findOne({ cashfreeOrderId });
      
      if (dbOrder && dbOrder.paymentStatus !== "completed") {
        dbOrder.paymentStatus = "cancelled";
        dbOrder.status = "Cancelled";
        await dbOrder.save();
        console.log(`✅ [${webhookId}] Order marked as cancelled: ${dbOrder._id}`);
      }
      
      return NextResponse.json({ success: true });
      
    } else {
      console.log(`ℹ️ [${webhookId}] Unhandled webhook type: ${type}`);
      return NextResponse.json({ success: true });
    }
    
  } catch (error: any) {
    console.error(`❌ [${webhookId}] Webhook processing error:`, error);
    console.error(`❌ [${webhookId}] Stack:`, error.stack);
    
    // Return 200 to prevent retries for permanent errors
    // Return 500 for temporary errors that should be retried
    const shouldRetry = error.code === 'ECONNREFUSED' || error.name === 'MongoNetworkError';
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: shouldRetry ? 500 : 200 }
    );
  }
}
