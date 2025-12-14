import { Resend } from 'resend';
import { IOrder } from '@/models/Order';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailData) {
  try {
    const data = await resend.emails.send({
      from: 'FrameKart <orders@framekart.co.in>',
      to: [to],
      subject,
      html,
    });

    return { success: true, data };
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Email sending error:', error);
    }
    return { success: false, error: error.message };
  }
}

export function getOrderConfirmationEmail(order: any) {
  const orderId = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ''}
          <div>
            <p style="margin: 0; font-weight: 500; color: #111827;">${item.title}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #111827;">
        ₹${item.price.toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - FrameKart</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">FrameKart</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Premium Photo Frames</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; color: #ffffff;">✓</span>
              </div>
              <h2 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #111827;">Order Confirmed!</h2>
              <p style="margin: 0; font-size: 16px; color: #6b7280;">Thank you for your purchase</p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Order ID</p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #111827;">#${orderId}</p>
                  </td>
                  <td style="padding-bottom: 12px; text-align: right;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Date</p>
                    <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #111827;">${orderDate}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 12px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Order Total</p>
                    <p style="margin: 4px 0 0; font-size: 24px; font-weight: 700; color: #111827;">₹${order.totalAmount.toLocaleString('en-IN')}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #111827;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #111827;">Delivery Address</h3>
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <p style="margin: 0; font-weight: 600; color: #111827;">${order.address.fullName}</p>
                <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                  ${order.address.addressLine1}<br/>
                  ${order.address.addressLine2 ? `${order.address.addressLine2}<br/>` : ''}
                  ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
                  Phone: ${order.address.phone}
                </p>
              </div>
            </td>
          </tr>

          <!-- Delivery Timeline -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 16px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  <strong>📦 Estimated Delivery:</strong> Your order will be delivered within <strong>5-7 business days</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Track Order Button -->
          <tr>
            <td style="padding: 0 40px 32px; text-align: center;">
              <a href="https://framekart.co.in/orders/${order._id}" style="display: inline-block; padding: 14px 32px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Track Your Order
              </a>
            </td>
          </tr>

          <!-- Support Section -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Need help with your order?</p>
              <p style="margin: 0; font-size: 14px;">
                <a href="https://framekart.co.in/contact" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                © ${new Date().getFullYear()} FrameKart. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                This email was sent to ${order.customerEmail}
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

export async function sendOrderConfirmationEmail(order: any) {
  try {
    const emailHtml = getOrderConfirmationEmail(order);
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const result = await sendEmail({
      to: order.customerEmail,
      subject: `Order Confirmation #${orderId} - FrameKart`,
      html: emailHtml,
    });

    return result;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send order confirmation email:', error);
    }
    return { success: false, error: error.message };
  }
}
