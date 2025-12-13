/**
 * Email Service - Centralized Resend email utility
 * Production-ready with proper error handling and logging
 */

import { Resend } from "resend";

// Singleton pattern for Resend client
let resendInstance: Resend | null = null;

function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

interface SendEmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
  details?: any;
}

/**
 * Send email using Resend
 * @param options Email options
 * @returns Result with success status and email ID or error
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    // Validate environment
    const emailFrom = options.from || process.env.EMAIL_FROM;
    if (!emailFrom) {
      console.error("❌ EMAIL_FROM not configured");
      return {
        success: false,
        error: "EMAIL_FROM environment variable is not set",
      };
    }

    // Validate recipient
    if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
      console.error("❌ No recipient specified");
      return {
        success: false,
        error: "No recipient email address provided",
      };
    }

    // Validate content
    if (!options.subject || !options.html) {
      console.error("❌ Missing subject or HTML content");
      return {
        success: false,
        error: "Email subject and HTML content are required",
      };
    }

    console.log("📧 Sending email:", {
      to: options.to,
      from: emailFrom,
      subject: options.subject,
      timestamp: new Date().toISOString(),
    });

    // Get Resend client and send email
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      tags: options.tags,
    });

    // Check for errors in response
    if (result.error) {
      console.error("❌ Resend API error:", result.error);
      return {
        success: false,
        error: result.error.message || "Failed to send email",
        details: result.error,
      };
    }

    console.log("✅ Email sent successfully:", {
      emailId: result.data?.id,
      to: options.to,
    });

    return {
      success: true,
      emailId: result.data?.id,
    };
  } catch (error: any) {
    console.error("❌ Exception while sending email:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
      details: error,
    };
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderData: {
    customerName: string;
    orderId: string;
    totalAmount: number;
    orderItems: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    address: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  }
): Promise<SendEmailResult> {
  const { generateOrderConfirmationEmail } = await import("./email-templates");

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmation - ${orderData.orderId}`,
    html: generateOrderConfirmationEmail(orderData),
    replyTo: "support@framekart.co.in",
    tags: [
      { name: "category", value: "order-confirmation" },
      { name: "order_id", value: orderData.orderId },
    ],
  });
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(
  orderData: {
    customerName: string;
    customerEmail: string;
    orderId: string;
    totalAmount: number;
    orderItems: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    address: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  }
): Promise<SendEmailResult> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("⚠️ ADMIN_EMAIL not configured, skipping admin notification");
    return {
      success: false,
      error: "ADMIN_EMAIL not configured",
    };
  }

  const { generateAdminOrderNotificationEmail } = await import(
    "./email-templates"
  );

  return sendEmail({
    to: adminEmail,
    subject: `🛒 New Order Received - ${orderData.orderId}`,
    html: generateAdminOrderNotificationEmail(orderData),
    tags: [
      { name: "category", value: "admin-notification" },
      { name: "order_id", value: orderData.orderId },
    ],
  });
}

/**
 * Verify Resend configuration
 */
export function verifyEmailConfig(): {
  configured: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!process.env.RESEND_API_KEY) {
    issues.push("RESEND_API_KEY is not set");
  }

  if (!process.env.EMAIL_FROM) {
    issues.push("EMAIL_FROM is not set");
  } else {
    // Validate EMAIL_FROM format
    const emailFrom = process.env.EMAIL_FROM;
    if (!emailFrom.includes("@")) {
      issues.push("EMAIL_FROM does not contain a valid email address");
    }
    // Check if it's using verified domain
    if (!emailFrom.includes("framekart.co.in")) {
      issues.push(
        "EMAIL_FROM should use verified domain (framekart.co.in)"
      );
    }
  }

  if (!process.env.ADMIN_EMAIL) {
    issues.push("ADMIN_EMAIL is not set (optional but recommended)");
  }

  return {
    configured: issues.length === 0,
    issues,
  };
}
