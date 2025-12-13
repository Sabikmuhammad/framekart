interface OrderEmailData {
  customerName: string;
  orderId: string;
  totalAmount: number;
  orderItems?: Array<{
    title: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  address?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface AdminOrderEmailData extends OrderEmailData {
  customerEmail: string;
}

/**
 * Generate HTML email for customer order confirmation
 */
export function generateOrderConfirmationEmail({
  customerName,
  orderId,
  totalAmount,
  orderItems = [],
  address,
}: OrderEmailData): string {
  const itemsHTML =
    orderItems.length > 0
      ? `
      <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">Order Items:</h3>
        ${orderItems
          .map(
            (item) => `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <div>
              <div style="font-weight: 500; color: #1f2937;">${item.title}</div>
              <div style="font-size: 14px; color: #6b7280;">Quantity: ${item.quantity}</div>
            </div>
            <div style="font-weight: 600; color: #1f2937;">₹${item.price.toLocaleString("en-IN")}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `
      : "";

  const addressHTML = address
    ? `
      <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">Delivery Address:</h3>
        <div style="color: #6b7280; line-height: 1.6;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">${address.fullName}</div>
          <div>${address.addressLine1}</div>
          ${address.addressLine2 ? `<div>${address.addressLine2}</div>` : ""}
          <div>${address.city}, ${address.state} - ${address.pincode}</div>
          <div style="margin-top: 8px;">Phone: ${address.phone}</div>
        </div>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px;" cellpadding="0" cellspacing="0">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <div style="width: 60px; height: 60px; margin: 0 auto 15px; background: white; border-radius: 12px; display: inline-block; line-height: 60px;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#667eea" opacity="0.3"/>
                      <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">FrameKart</h1>
                  <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Premium Quality Frames</p>
                </td>
              </tr>
              
              <!-- Success Icon -->
              <tr>
                <td style="background: white; padding: 40px 30px 20px; text-align: center;">
                  <div style="width: 80px; height: 80px; margin: 0 auto; background: #10b981; border-radius: 50%; display: inline-block; line-height: 80px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                      <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="background: white; padding: 0 30px 30px; text-align: center;">
                  <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">Order Confirmed!</h2>
                  <p style="margin: 0 0 25px; color: #6b7280; font-size: 16px; line-height: 1.5;">
                    Hi ${customerName}, thank you for your order! We're preparing your items with care.
                  </p>
                  
                  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
                    <div style="margin-bottom: 12px;">
                      <span style="color: #6b7280; font-size: 14px;">Order ID</span>
                      <div style="color: #1f2937; font-size: 18px; font-weight: 600; margin-top: 4px;">${orderId}</div>
                    </div>
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;">
                      <span style="color: #6b7280; font-size: 14px;">Total Amount</span>
                      <div style="color: #667eea; font-size: 28px; font-weight: 700; margin-top: 4px;">₹${totalAmount.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  
                  ${itemsHTML}
                  ${addressHTML}
                  
                  <div style="margin: 30px 0;">
                    <a href="https://framekart.co.in/orders/${orderId}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View Order Details
                    </a>
                  </div>
                  
                  <p style="margin: 25px 0 0; color: #9ca3af; font-size: 14px; line-height: 1.6;">
                    You will receive a shipping confirmation email once your order is on its way.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                  <div style="text-align: center; padding-bottom: 20px;">
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 600;">Need Help?</p>
                    <a href="mailto:support@framekart.co.in" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">support@framekart.co.in</a>
                    <br>
                    <a href="tel:+917259788138" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500; margin-top: 4px; display: inline-block;">+91 7259788138</a>
                  </div>
                  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                      Legal Business Name: DASARABETTU ABDUL RAHIMAN
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      &copy; ${new Date().getFullYear()} FrameKart. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                      Mangaluru, Karnataka, India
                    </p>
                  </div>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email for admin order notification
 */
export function generateAdminOrderNotificationEmail({
  customerName,
  customerEmail,
  orderId,
  totalAmount,
  orderItems = [],
  address,
}: AdminOrderEmailData): string {
  const itemsHTML =
    orderItems.length > 0
      ? `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Item</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems
            .map(
              (item) => `
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${item.title}</td>
              <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">₹${item.price.toLocaleString("en-IN")}</td>
            </tr>
          `
            )
            .join("")}
          <tr style="background: #f9fafb; font-weight: 600;">
            <td colspan="2" style="padding: 12px; border: 1px solid #e5e7eb;">Total</td>
            <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb; color: #667eea;">₹${totalAmount.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>
    `
      : "";

  const addressHTML = address
    ? `
      <div style="margin: 20px 0; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 14px; font-weight: 600;">Delivery Address:</h3>
        <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
          <strong>${address.fullName}</strong><br>
          ${address.addressLine1}<br>
          ${address.addressLine2 ? `${address.addressLine2}<br>` : ""}
          ${address.city}, ${address.state} - ${address.pincode}<br>
          Phone: <strong>${address.phone}</strong>
        </div>
      </div>
    `
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background: white; border-radius: 12px; overflow: hidden;" cellpadding="0" cellspacing="0">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🎉 New Order Received</h1>
                  <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">FrameKart Admin Notification</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  
                  <!-- Order Info -->
                  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Order ID:</td>
                        <td style="color: #1f2937; font-weight: 600; text-align: right;">${orderId}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Customer:</td>
                        <td style="color: #1f2937; font-weight: 600; text-align: right;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Email:</td>
                        <td style="text-align: right;"><a href="mailto:${customerEmail}" style="color: #667eea; text-decoration: none;">${customerEmail}</a></td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Total Amount:</td>
                        <td style="color: #667eea; font-weight: 700; font-size: 18px; text-align: right;">₹${totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    </table>
                  </div>
                  
                  ${itemsHTML}
                  ${addressHTML}
                  
                  <!-- Action Button -->
                  <div style="margin: 30px 0; text-align: center;">
                    <a href="https://framekart.co.in/admin/orders" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      View in Admin Dashboard
                    </a>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    This is an automated notification from FrameKart
                  </p>
                  <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} FrameKart. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
