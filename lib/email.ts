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
      <td style="padding: 20px 0; border-bottom: 1px solid #F1F5F9;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${item.imageUrl ? `
            <td width="72" valign="top">
              <img src="${item.imageUrl}" alt="${item.title}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 12px; border: 1px solid #E2E8F0; display: block;" />
            </td>
            ` : ''}
            <td style="padding-left: ${item.imageUrl ? '16px' : '0px'};" valign="middle">
              <p style="margin: 0; font-weight: 600; color: #0F172A; font-size: 15px; line-height: 1.4;">${item.title}</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #64748B;">Quantity: ${item.quantity}</p>
            </td>
            <td align="right" valign="middle" style="padding-left: 16px;">
              <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0F172A;">₹${item.price.toLocaleString('en-IN')}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const firstName = order.address.fullName ? order.address.fullName.split(' ')[0] : 'Customer';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed - FrameKart</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    
    @media only screen and (max-width: 600px) {
      .container { 
        width: 100% !important; 
        max-width: 100% !important;
        border-radius: 16px !important;
      }
      .content-padding { 
        padding: 32px 20px !important; 
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      .mobile-spacing {
        margin-bottom: 16px !important;
      }
      .mobile-padding-reset {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 40px 10px;">
    <tr>
      <td align="center" valign="top">
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.03), 0 20px 40px -10px rgba(0, 0, 0, 0.02); overflow: hidden;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td class="content-padding" style="padding: 40px 48px 24px; text-align: center; border-bottom: 1px solid #F1F5F9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 20px; font-weight: 800; color: #0F172A; letter-spacing: 4px; text-transform: uppercase;">FRAME<span style="color: #3B82F6;">KART</span></span>
                    <div style="font-size: 10px; font-weight: 600; color: #94A3B8; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">PREMIUM PHOTO FRAMES</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO SECTION -->
          <tr>
            <td class="content-padding" style="padding: 40px 48px 32px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 24px;">
                <tr>
                  <td align="center" valign="middle" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); width: 64px; height: 64px; border-radius: 50%;">
                    <span style="font-size: 28px; color: #3B82F6; line-height: 64px; font-weight: bold;">✓</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">Order Confirmed!</h1>
              <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6; max-width: 440px; margin: 0 auto;">
                Thank you for choosing FrameKart, ${firstName} 🙏<br/>
                Your order has been received and is being processed with care.
              </p>
            </td>
          </tr>

          <!-- ORDER SUMMARY CARD -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border-radius: 16px; border: 1px solid #F1F5F9; padding: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Order ID -->
                        <td class="mobile-stack mobile-spacing" valign="top" style="padding-right: 16px;">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Order ID</div>
                          <div style="font-size: 15px; font-weight: 600; color: #0F172A; font-family: monospace;">#${orderId}</div>
                        </td>
                        <!-- Order Date -->
                        <td class="mobile-stack mobile-spacing" valign="top" style="padding-right: 16px;">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Order Date</div>
                          <div style="font-size: 15px; font-weight: 600; color: #0F172A;">${orderDate}</div>
                        </td>
                        <!-- Total Amount -->
                        <td class="mobile-stack" valign="top">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Total Amount</div>
                          <div style="font-size: 20px; font-weight: 800; color: #3B82F6;">₹${order.totalAmount.toLocaleString('en-IN')}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ORDER ITEMS -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <h3 style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- DELIVERY ADDRESS & NEXT STEPS -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Shipping Address Card -->
                  <td class="mobile-stack mobile-spacing mobile-padding-reset" width="48%" valign="top" style="padding-right: 12px;">
                    <h4 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">Delivery Address</h4>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; min-height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.01); box-sizing: border-box;">
                      <tr>
                        <td valign="top">
                          <div style="font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 8px;">${order.address.fullName}</div>
                          <div style="font-size: 13px; color: #475569; line-height: 1.6;">
                            ${order.address.addressLine1}<br/>
                            ${order.address.addressLine2 ? `${order.address.addressLine2}<br/>` : ''}
                            ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
                            <span style="display: inline-block; margin-top: 10px; font-weight: 600; color: #64748B;">📞 ${order.address.phone}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Timeline / Next Steps Card -->
                  <td class="mobile-stack mobile-padding-reset" width="48%" valign="top" style="padding-left: 12px;">
                    <h4 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">What's Next?</h4>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; min-height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.01); box-sizing: border-box;">
                      <tr>
                        <td valign="top">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <!-- Step 1 -->
                            <tr>
                              <td width="16" valign="top" style="padding-bottom: 12px;">
                                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #3B82F6; margin-top: 5px;"></div>
                              </td>
                              <td style="font-size: 13px; color: #0F172A; font-weight: 600; padding-bottom: 12px;">
                                Processing
                                <span style="font-size: 11px; color: #64748B; font-weight: normal; display: block; margin-top: 2px;">Preparing frames (1-2 days)</span>
                              </td>
                            </tr>
                            <!-- Step 2 -->
                            <tr>
                              <td width="16" valign="top" style="padding-bottom: 12px;">
                                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #E2E8F0; margin-top: 5px;"></div>
                              </td>
                              <td style="font-size: 13px; color: #475569; padding-bottom: 12px;">
                                Shipping
                                <span style="font-size: 11px; color: #94A3B8; display: block; margin-top: 2px;">Tracking sent via email</span>
                              </td>
                            </tr>
                            <!-- Step 3 -->
                            <tr>
                              <td width="16" valign="top">
                                <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #E2E8F0; margin-top: 5px;"></div>
                              </td>
                              <td style="font-size: 13px; color: #475569;">
                                Delivery
                                <span style="font-size: 11px; color: #94A3B8; display: block; margin-top: 2px;">5-7 business days</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td class="content-padding" style="padding: 8px 48px 36px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://framekart.co.in/orders/${order._id}" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3); letter-spacing: 0.5px;">
                      Track Your Order
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INSTAGRAM CARD -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);">
                <tr>
                  <td style="padding: 32px 32px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Framekart Style</div>
                    <h3 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.5px;">Showcase your space</h3>
                    <p style="margin: 0 auto 20px; font-size: 13px; color: #94A3B8; line-height: 1.6; max-width: 320px;">
                      Join our Instagram community to share your custom frames, get inspired, and access exclusive content.
                    </p>
                    <a href="https://www.instagram.com/framekartofficial" style="display: inline-block; padding: 10px 24px; background-color: #FFFFFF; color: #0F172A; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); letter-spacing: 0.2px;">
                      Follow @framekartofficial
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SUPPORT & NAVIGATION Links -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #F1F5F9; padding-top: 24px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 6px; font-size: 13px; font-weight: 500; color: #64748B;">Need help with your order?</p>
                    <p style="margin: 0; font-size: 13px; color: #94A3B8;">
                      <a href="https://framekart.co.in/contact" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Contact Support</a>
                      <span style="margin: 0 8px; color: #E2E8F0;">|</span>
                      <a href="https://framekart.co.in" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BRAND FOOTER -->
          <tr>
            <td style="padding: 32px 48px; background-color: #F8FAFC; text-align: center; border-top: 1px solid #F1F5F9;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #94A3B8; font-weight: 500; letter-spacing: 0.5px;">
                © ${new Date().getFullYear()} FrameKart. All rights reserved.
              </p>
              <p style="margin: 0 0 12px; font-size: 11px; color: #94A3B8; letter-spacing: 0.2px;">
                Premium Custom Photo Frames | Crafted with Excellence
              </p>
              <p style="margin: 0; font-size: 11px; color: #CBD5E1;">
                This transaction email was sent to ${order.customerEmail}.
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

export function getOrderStatusUpdateEmail(order: any, newStatus: string) {
  const orderId = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statusMessages: Record<string, { title: string; subtitle: string; icon: string; color: string; gradient: string }> = {
    Processing: {
      title: "Your order is being processed",
      subtitle: "We are custom crafting your frames with premium materials and high precision.",
      icon: "⏳",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
    },
    Printed: {
      title: "Your photos are printed",
      subtitle: "Your photos have been printed using high-definition printers and are ready for framing.",
      icon: "🎨",
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
    },
    Shipped: {
      title: "Your order has been shipped!",
      subtitle: "Your custom frames are on the way. Tracking details are now available.",
      icon: "🚚",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
    },
    Delivered: {
      title: "Your order is delivered!",
      subtitle: "Your FrameKart package has arrived. We hope you love your new custom photo frames!",
      icon: "✓",
      color: "#10B981",
      gradient: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
    }
  };

  const currentStatusInfo = statusMessages[newStatus] || {
    title: `Order updated: ${newStatus}`,
    subtitle: `Your order status has been updated to ${newStatus}.`,
    icon: "📦",
    color: "#3B82F6",
    gradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
  };

  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #F1F5F9;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            ${item.imageUrl ? `
            <td width="56" valign="top">
              <img src="${item.imageUrl}" alt="${item.title}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 8px; border: 1px solid #E2E8F0; display: block;" />
            </td>
            ` : ''}
            <td style="padding-left: ${item.imageUrl ? '12px' : '0px'};" valign="middle">
              <p style="margin: 0; font-weight: 600; color: #0F172A; font-size: 14px; line-height: 1.4;">${item.title}</p>
              <p style="margin: 3px 0 0; font-size: 12px; color: #64748B;">Qty: ${item.quantity}</p>
            </td>
            <td align="right" valign="middle" style="padding-left: 12px;">
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #0F172A;">₹${item.price.toLocaleString('en-IN')}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const firstName = order.address.fullName ? order.address.fullName.split(' ')[0] : 'Customer';

  const statuses = ['Processing', 'Printed', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(newStatus);

  const steps = [
    { key: 'Processing', label: 'Order Processing', sub: 'Preparing and crafting your frames' },
    { key: 'Printed', label: 'Printed & Prepared', sub: 'Photos printed and frames assembled' },
    { key: 'Shipped', label: 'Dispatched & Shipped', sub: 'On the way to your delivery address' },
    { key: 'Delivered', label: 'Delivered', sub: 'Successfully received' }
  ];

  const timelineHtml = steps.map((step, index) => {
    let dotColor = '#E2E8F0';
    let labelColor = '#64748B';
    let subColor = '#94A3B8';
    let fontWeight = 'normal';
    
    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex;
    
    if (isCompleted || isActive) {
      dotColor = newStatus === 'Delivered' ? '#10B981' : '#3B82F6';
      labelColor = '#0F172A';
      subColor = '#475569';
      if (isActive) {
        fontWeight = '600';
      }
    }
    
    const showLine = index < steps.length - 1;
    
    return `
      <tr>
        <td width="20" valign="top" align="center" style="position: relative;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="center" valign="top">
                <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${dotColor}; margin-top: 4px; border: 2px solid #FFFFFF; box-shadow: 0 0 0 2px ${isActive ? dotColor : 'transparent'};"></div>
              </td>
            </tr>
            ${showLine ? `
            <tr>
              <td align="center" valign="top" style="padding-top: 4px; padding-bottom: 4px;">
                <div style="width: 2px; height: 32px; background-color: ${isCompleted ? (newStatus === 'Delivered' ? '#10B981' : '#3B82F6') : '#E2E8F0'};"></div>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
        <td valign="top" style="padding-left: 12px; padding-bottom: ${showLine ? '16px' : '0px'};">
          <div style="font-size: 13px; font-weight: ${fontWeight}; color: ${labelColor};">${step.label}</div>
          <div style="font-size: 11px; color: ${subColor}; margin-top: 1px;">${step.sub}</div>
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - FrameKart</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    
    @media only screen and (max-width: 600px) {
      .container { 
        width: 100% !important; 
        max-width: 100% !important;
        border-radius: 16px !important;
      }
      .content-padding { 
        padding: 32px 20px !important; 
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      .mobile-spacing {
        margin-bottom: 16px !important;
      }
      .mobile-padding-reset {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; padding: 40px 10px;">
    <tr>
      <td align="center" valign="top">
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #E2E8F0; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.03), 0 20px 40px -10px rgba(0, 0, 0, 0.02); overflow: hidden;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td class="content-padding" style="padding: 40px 48px 24px; text-align: center; border-bottom: 1px solid #F1F5F9;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 20px; font-weight: 800; color: #0F172A; letter-spacing: 4px; text-transform: uppercase;">FRAME<span style="color: #3B82F6;">KART</span></span>
                    <div style="font-size: 10px; font-weight: 600; color: #94A3B8; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">PREMIUM PHOTO FRAMES</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO SECTION -->
          <tr>
            <td class="content-padding" style="padding: 40px 48px 32px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 24px;">
                <tr>
                  <td align="center" valign="middle" style="background: ${currentStatusInfo.gradient}; width: 64px; height: 64px; border-radius: 50%;">
                    <span style="font-size: 28px; color: ${currentStatusInfo.color}; line-height: 64px; font-weight: bold;">${currentStatusInfo.icon}</span>
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">${currentStatusInfo.title}</h1>
              <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6; max-width: 440px; margin: 0 auto;">
                Hello ${firstName}, ${currentStatusInfo.subtitle}
              </p>
            </td>
          </tr>

          <!-- ORDER META / SUMMARY -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8FAFC; border-radius: 16px; border: 1px solid #F1F5F9; padding: 24px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Order ID -->
                        <td class="mobile-stack mobile-spacing" valign="top" style="padding-right: 16px;">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Order ID</div>
                          <div style="font-size: 15px; font-weight: 600; color: #0F172A; font-family: monospace;">#${orderId}</div>
                        </td>
                        <!-- Order Date -->
                        <td class="mobile-stack mobile-spacing" valign="top" style="padding-right: 16px;">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Order Date</div>
                          <div style="font-size: 15px; font-weight: 600; color: #0F172A;">${orderDate}</div>
                        </td>
                        <!-- Total Amount -->
                        <td class="mobile-stack" valign="top">
                          <div style="font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Total Amount</div>
                          <div style="font-size: 20px; font-weight: 800; color: #3B82F6;">₹${order.totalAmount.toLocaleString('en-IN')}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TIMELINE & SHIPPING GRID -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Shipping Address Card -->
                  <td class="mobile-stack mobile-spacing mobile-padding-reset" width="48%" valign="top" style="padding-right: 12px;">
                    <h4 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">Delivery Address</h4>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; min-height: 200px; box-shadow: 0 4px 10px rgba(0,0,0,0.01); box-sizing: border-box;">
                      <tr>
                        <td valign="top">
                          <div style="font-size: 14px; font-weight: 600; color: #0F172A; margin-bottom: 8px;">${order.address.fullName}</div>
                          <div style="font-size: 13px; color: #475569; line-height: 1.6;">
                            ${order.address.addressLine1}<br/>
                            ${order.address.addressLine2 ? `${order.address.addressLine2}<br/>` : ''}
                            ${order.address.city}, ${order.address.state} ${order.address.pincode}<br/>
                            <span style="display: inline-block; margin-top: 10px; font-weight: 600; color: #64748B;">📞 ${order.address.phone}</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Timeline Card -->
                  <td class="mobile-stack mobile-padding-reset" width="48%" valign="top" style="padding-left: 12px;">
                    <h4 style="margin: 0 0 12px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px;">Order Tracker</h4>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; min-height: 200px; box-shadow: 0 4px 10px rgba(0,0,0,0.01); box-sizing: border-box;">
                      <tr>
                        <td valign="top">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${timelineHtml}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ORDER ITEMS SUMMARY -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px;">
              <h3 style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td class="content-padding" style="padding: 8px 48px 36px; text-align: center;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://framekart.co.in/orders/${order._id}" style="display: inline-block; padding: 16px 36px; background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3); letter-spacing: 0.5px;">
                      Track Order Status
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SUPPORT & NAVIGATION Links -->
          <tr>
            <td class="content-padding" style="padding: 0 48px 32px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #F1F5F9; padding-top: 24px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 6px; font-size: 13px; font-weight: 500; color: #64748B;">Need assistance with your frames?</p>
                    <p style="margin: 0; font-size: 13px; color: #94A3B8;">
                      <a href="https://framekart.co.in/contact" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Contact Support</a>
                      <span style="margin: 0 8px; color: #E2E8F0;">|</span>
                      <a href="https://framekart.co.in" style="color: #3B82F6; text-decoration: none; font-weight: 600;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BRAND FOOTER -->
          <tr>
            <td style="padding: 32px 48px; background-color: #F8FAFC; text-align: center; border-top: 1px solid #F1F5F9;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #94A3B8; font-weight: 500; letter-spacing: 0.5px;">
                © ${new Date().getFullYear()} FrameKart. All rights reserved.
              </p>
              <p style="margin: 0 0 12px; font-size: 11px; color: #94A3B8; letter-spacing: 0.2px;">
                Premium Custom Photo Frames | Crafted with Excellence
              </p>
              <p style="margin: 0; font-size: 11px; color: #CBD5E1;">
                This transaction email was sent to ${order.customerEmail}.
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

export async function sendOrderStatusUpdateEmail(order: any, newStatus: string) {
  try {
    const emailHtml = getOrderStatusUpdateEmail(order, newStatus);
    const orderId = order._id.toString().slice(-8).toUpperCase();

    const result = await sendEmail({
      to: order.customerEmail || order.email,
      subject: `Order Update #${orderId}: ${newStatus} - FrameKart`,
      html: emailHtml,
    });

    return result;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send order status email:', error);
    }
    return { success: false, error: error.message };
  }
}
