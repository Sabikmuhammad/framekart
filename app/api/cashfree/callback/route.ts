import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Get the host dynamically from request headers
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const { searchParams } = new URL(req.url);
    
    // Log all parameters for debugging
    console.log('🔵 Cashfree Callback Received');
    console.log('All params:', Object.fromEntries(searchParams.entries()));
    
    // Our MongoDB order ID (we named it db_order_id to avoid conflict)
    const orderId = searchParams.get("db_order_id");
    
    // Tracking token for guest checkout
    const token = searchParams.get("token");
    
    // Cashfree's order ID (they send it as order_id)
    let cashfreeOrderId = searchParams.get("order_id");
    
    // Fallback to other possible parameter names
    if (!cashfreeOrderId) {
      cashfreeOrderId = searchParams.get("cf_order_id") || searchParams.get("orderId");
    }

    console.log('📦 Our DB Order ID:', orderId);
    console.log('💳 Cashfree Order ID:', cashfreeOrderId);

    if (!orderId) {
      console.error('❌ Missing db_order_id parameter (our MongoDB order ID)');
      console.error('This means the return_url was not set correctly');
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=missing_order_id`
      );
    }

    if (!cashfreeOrderId) {
      console.error('❌ Missing cashfree order_id parameter');
      // Try to fetch order from database and use its cashfreeOrderId
      await dbConnect();
      const order = await Order.findById(orderId);
      
      if (order && order.cashfreeOrderId) {
        cashfreeOrderId = order.cashfreeOrderId;
        console.log('✅ Found cashfreeOrderId from database:', cashfreeOrderId);
      } else {
        console.error('❌ Could not find cashfreeOrderId');
        return NextResponse.redirect(
          `${baseUrl}/checkout?error=payment_failed`
        );
      }
    }

    // Choose correct credentials based on environment
    const environment = process.env.CASHFREE_ENV || "sandbox";
    const isProd = environment === "production";
    const clientId = isProd 
      ? process.env.CASHFREE_CLIENT_ID 
      : (process.env.CASHFREE_TEST_CLIENT_ID || process.env.CASHFREE_CLIENT_ID);
    const clientSecret = isProd 
      ? process.env.CASHFREE_CLIENT_SECRET 
      : (process.env.CASHFREE_TEST_CLIENT_SECRET || process.env.CASHFREE_CLIENT_SECRET);

    const apiUrl = isProd
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(`${apiUrl}/${cashfreeOrderId}/payments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId!,
        "x-client-secret": clientSecret!,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();
    console.log('📊 Cashfree API Response:', JSON.stringify(data, null, 2));

    if (response.ok && data && data.length > 0) {
      const payment = data[0];
      console.log('💰 Payment Status:', payment.payment_status);
      
      if (payment.payment_status === "SUCCESS") {
        console.log('✅ Payment SUCCESS - Updating order...');
        // Update order in database
        await dbConnect();
        
        // Check if order is already processed
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
          console.error('❌ Order not found:', orderId);
          return NextResponse.redirect(`${baseUrl}/checkout?error=missing_order_id`);
        }
        
        if (existingOrder.paymentStatus === "completed") {
          console.log('⚠️ Order already processed, redirecting to success');
          let successUrl = `${baseUrl}/checkout/success?orderId=${orderId}`;
          if (token) successUrl += `&token=${token}`;
          return NextResponse.redirect(successUrl);
        }
        
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: "completed",
            paymentId: payment.cf_payment_id,
            cashfreeOrderId: cashfreeOrderId,
            status: "Processing",
          },
          { new: true }
        );
        
        console.log('✅ Order updated successfully:', updatedOrder?._id);

        // Send order confirmation email
        try {
          console.log('📧 Sending confirmation email...');
          const { sendOrderConfirmationEmail } = await import('@/lib/email');
          await sendOrderConfirmationEmail(updatedOrder);
          console.log('✅ Email sent successfully');
        } catch (emailError) {
          // Log error but don't block the success flow
          console.error('❌ Failed to send confirmation email:', emailError);
        }
        
        // Redirect to success page
        let successUrl = `${baseUrl}/checkout/success?orderId=${orderId}`;
        if (token) successUrl += `&token=${token}`;
        console.log('🎉 Redirecting to success page:', successUrl);
        return NextResponse.redirect(successUrl);
      } else {
        console.log('❌ Payment status not SUCCESS:', payment.payment_status);
      }
    } else {
      console.log('❌ No payment data received or invalid response');
    }

    // Payment failed or pending
    console.log('❌ Payment failed or pending - redirecting to checkout with error');
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=payment_failed`
    );
  } catch (error: any) {
    console.error("❌❌❌ Cashfree callback error:", error);
    console.error("Error stack:", error.stack);
    
    // Get baseUrl for error redirect
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    console.log('🔄 Redirecting to checkout with verification_failed error');
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=verification_failed`
    );
  }
}
