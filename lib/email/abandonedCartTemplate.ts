import { ICartProduct } from "@/models/CartSession";

export function generateAbandonedCartEmailHtml(
  products: ICartProduct[],
  total: number,
  checkoutUrl: string
) {
  const productCards = products
    .map(
      (product) => `
        <tr>
          <td style="padding: 0 0 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
              <tr>
                <td width="104" style="padding: 16px;">
                  ${
                    product.image
                      ? `<img src="${product.image}" alt="${product.name}" style="display: block; width: 88px; height: 88px; object-fit: cover; border-radius: 12px; background-color: #f3f4f6;" />`
                      : `<div style="width: 88px; height: 88px; border-radius: 12px; background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);"></div>`
                  }
                </td>
                <td style="padding: 16px 16px 16px 0; vertical-align: top;">
                  <p style="margin: 0 0 8px; font-size: 17px; line-height: 24px; font-weight: 700; color: #111827;">${product.name}</p>
                  <p style="margin: 0 0 6px; font-size: 14px; color: #4b5563;">Quantity: ${product.quantity}</p>
                  <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1d4ed8;">₹${product.price.toLocaleString("en-IN")}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background-color: #eff6ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        @media only screen and (max-width: 600px) {
          .wrapper { width: 100% !important; }
          .content { padding: 24px 16px !important; }
          .headline { font-size: 28px !important; line-height: 34px !important; }
          .cta { display: block !important; width: 100% !important; box-sizing: border-box; }
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 12px; background: linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%);">
        <tr>
          <td align="center">
            <table class="wrapper" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(37, 99, 235, 0.12);">
              <tr>
                <td style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 28px 24px; text-align: center;">
                  <p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 2px; color: #bfdbfe; text-transform: uppercase;">FrameKart</p>
                  <h1 class="headline" style="margin: 10px 0 8px; font-size: 34px; line-height: 40px; font-weight: 800; color: #ffffff;">Your cart is still waiting</h1>
                  <p style="margin: 0; font-size: 15px; line-height: 24px; color: #dbeafe;">The frames you picked are still available. Finish your order before they are gone.</p>
                </td>
              </tr>
              <tr>
                <td class="content" style="padding: 28px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 18px 20px; border-radius: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #64748b;">Cart total</p>
                        <p style="margin: 0; font-size: 30px; line-height: 36px; font-weight: 800; color: #0f172a;">₹${total.toLocaleString("en-IN")}</p>
                      </td>
                    </tr>
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    ${productCards}
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center">
                        <a
                          href="${checkoutUrl}"
                          class="cta"
                          style="display: inline-block; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 14px 28px; border-radius: 9999px;"
                        >
                          Complete Your Order
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; text-align: center; font-size: 14px; line-height: 22px; color: #64748b;">
                    Premium frames, clean finishing, and doorstep delivery from FrameKart.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 24px 24px; text-align: center;">
                  <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
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
