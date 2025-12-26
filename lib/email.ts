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
      <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="80">
              ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 2px solid #f3f4f6;" />` : ''}
            </td>
            <td style="padding-left: 16px;">
              <p style="margin: 0; font-weight: 600; color: #111827; font-size: 15px;">${item.title}</p>
              <p style="margin: 6px 0 0; font-size: 13px; color: #6b7280;">Quantity: ${item.quantity}</p>
              <p style="margin: 8px 0 0; font-size: 16px; font-weight: 700; color: #059669;">₹${item.price.toLocaleString('en-IN')}</p>
            </td>
          </tr>
        </table>
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
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .padding { padding: 20px !important; }
      .mobile-hide { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🎨 FrameKart</h1>
              <p style="margin: 8px 0 0; font-size: 15px; color: rgba(255,255,255,0.95); letter-spacing: 1px;">PREMIUM PHOTO FRAMES</p>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);">
                <table width="100%" height="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" valign="middle">
                      <span style="font-size: 40px; color: #ffffff;">✓</span>
                    </td>
                  </tr>
                </table>
              </div>
              <h2 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Order Confirmed!</h2>
              <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">Thank you for choosing FrameKart 🙏<br/>Your order is being processed with care</p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; border: 2px solid #fbbf24;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; font-size: 13px; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order ID</p>
                          <p style="margin: 6px 0 0; font-size: 20px; font-weight: 700; color: #92400e;">#${orderId}</p>
                        </td>
                        <td style="padding-bottom: 16px; text-align: right;">
                          <p style="margin: 0; font-size: 13px; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Order Date</p>
                          <p style="margin: 6px 0 0; font-size: 16px; font-weight: 600; color: #92400e;">${orderDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 16px; border-top: 2px dashed #f59e0b;">
                          <p style="margin: 0; font-size: 13px; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Total Amount</p>
                          <p style="margin: 8px 0 0; font-size: 32px; font-weight: 800; color: #92400e;">₹${order.totalAmount.toLocaleString('en-IN')}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #111827;">📦 Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #111827;">🏠 Delivery Address</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-radius: 12px; padding: 24px; border: 2px solid #818cf8;">
                <tr>
                  <td>
                    <p style="margin: 0; font-weight: 700; color: #312e81; font-size: 16px;">${order.address.fullName}</p>
                    <p style="margin: 12px 0 0; font-size: 14px; color: #4338ca; line-height: 1.8;">
                      ${order.address.addressLine1}<br/>
                      ${order.address.addressLine2 ? `${order.address.addressLine2}<br/>` : ''}
                      ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
                      📞 ${order.address.phone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Timeline & Next Steps -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px;">
              <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #111827;">⏰ What's Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; border-left: 6px solid #10b981;">
                <tr>
                  <td>
                    <p style="margin: 0 0 12px; font-size: 15px; color: #065f46; line-height: 1.6;">
                      <strong style="color: #047857;">✓ Order Confirmed</strong> - We've received your order<br/>
                      <strong style="color: #047857;">⏳ Processing</strong> - We're preparing your frames (1-2 days)<br/>
                      <strong style="color: #047857;">🚚 Shipping</strong> - Your order will be shipped soon<br/>
                      <strong style="color: #047857;">📬 Delivery</strong> - Expected in <strong>5-7 business days</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px; text-align: center;">
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://framekart.co.in/orders/${order._id}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
                      🔍 Track Your Order
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Media -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px; text-align: center;">
              <table cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 12px; padding: 24px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px; font-size: 16px; font-weight: 700; color: #831843;">📸 Follow Us on Instagram!</p>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #9f1239;">Get inspired by latest designs & exclusive offers</p>
                    <a href="https://www.instagram.com/framekart.co.in" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                      Follow @framekart.co.in
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td class="padding" style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #334155;">Need Help?</p>
                    <p style="margin: 0; font-size: 14px; color: #64748b;">
                      <a href="https://framekart.co.in/contact" style="color: #667eea; text-decoration: none; font-weight: 600;">Contact Support</a> | 
                      <a href="https://framekart.co.in" style="color: #667eea; text-decoration: none; font-weight: 600;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1f2937; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #d1d5db; font-weight: 600;">
                © ${new Date().getFullYear()} FrameKart. All rights reserved.
              </p>
              <p style="margin: 0 0 12px; font-size: 12px; color: #9ca3af;">
                Premium Photo Frames | Made with ❤️ in India
              </p>
              <p style="margin: 0; font-size: 11px; color: #6b7280;">
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
