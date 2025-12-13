import { Resend } from 'resend';

// Lazy initialize Resend client
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface OrderConfirmationEmailProps {
  customerEmail: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  orderItems?: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderId,
  totalAmount,
  orderItems = [],
}: OrderConfirmationEmailProps) {
  try {
    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM || 'FrameKart <support@framekart.co.in>',
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: generateOrderConfirmationHTML({
        customerName,
        orderId,
        totalAmount,
        orderItems,
      }),
    });

    if (error) {
      console.error('Failed to send order confirmation email:', error);
      return { success: false, error };
    }

    console.log('Order confirmation email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Generate HTML content for order confirmation email
 */
function generateOrderConfirmationHTML({
  customerName,
  orderId,
  totalAmount,
  orderItems = [],
}: Omit<OrderConfirmationEmailProps, 'customerEmail'>) {
  const itemsHTML = orderItems.length > 0
    ? `
      <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">Order Items:</h3>
        ${orderItems.map(item => `
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <div>
              <div style="font-weight: 500; color: #1f2937;">${item.title}</div>
              <div style="font-size: 14px; color: #6b7280;">Quantity: ${item.quantity}</div>
            </div>
            <div style="font-weight: 600; color: #1f2937;">₹${item.price.toLocaleString('en-IN')}</div>
          </div>
        `).join('')}
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="width: 60px; height: 60px; margin: 0 auto 15px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#667eea" opacity="0.3"/>
                      <path d="M2 17L12 22L22 17" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">FrameKart</h1>
                  <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Premium Quality Frames</p>
                </td>
              </tr>
              
              <!-- Success Icon -->
              <tr>
                <td style="padding: 40px 30px 20px; text-align: center;">
                  <div style="width: 80px; height: 80px; margin: 0 auto; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 30px 30px; text-align: center;">
                  <h2 style="margin: 0 0 10px; color: #1f2937; font-size: 24px; font-weight: 700;">Order Confirmed!</h2>
                  <p style="margin: 0 0 25px; color: #6b7280; font-size: 16px; line-height: 1.5;">
                    Hi ${customerName}, thank you for your order! We're preparing your items with care.
                  </p>
                  
                  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
                    <div style="margin-bottom: 12px;">
                      <span style="color: #6b7280; font-size: 14px;">Order ID:</span>
                      <div style="color: #1f2937; font-size: 18px; font-weight: 600; margin-top: 4px;">${orderId}</div>
                    </div>
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: 12px;">
                      <span style="color: #6b7280; font-size: 14px;">Total Amount:</span>
                      <div style="color: #667eea; font-size: 28px; font-weight: 700; margin-top: 4px;">₹${totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  
                  ${itemsHTML}
                  
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
                <td style="background: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align: center; padding-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 600;">Need Help?</p>
                          <a href="mailto:support@framekart.co.in" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">support@framekart.co.in</a>
                        </div>
                        <div>
                          <a href="tel:+917259788138" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">+91 7259788138</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                          Legal Business Name: DASARABETTU ABDUL RAHIMAN
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          &copy; ${new Date().getFullYear()} FrameKart. All rights reserved.
                        </p>
                        <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                          Mangaluru, Karnataka, India
                        </p>
                      </td>
                    </tr>
                  </table>
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
