import { WhatsAppApiResponse } from "./client";

function getBaseConfig(phoneNumber: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v19.0";

  if (!accessToken || !phoneNumberId) {
    return { error: "Missing credentials" };
  }

  let to = phoneNumber.replace(/\D/g, "");
  if (to.length === 10) {
    to = "91" + to;
  }

  return { accessToken, phoneNumberId, apiVersion, to };
}

export async function sendInteractiveButtons(
  phoneNumber: string,
  bodyText: string,
  buttons: { id: string; title: string }[],
  headerText?: string,
  footerText?: string
): Promise<WhatsAppApiResponse> {
  const config = getBaseConfig(phoneNumber);
  if (config.error) {
    console.warn("Skipping WhatsApp interactive: missing credentials");
    return { success: false, error: config.error };
  }
  const { accessToken, phoneNumberId, apiVersion, to } = config;

  const payload: any = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.map((btn) => ({
          type: "reply",
          reply: {
            id: btn.id,
            title: btn.title,
          },
        })).slice(0, 3), // max 3 buttons supported by Meta
      },
    },
  };

  if (headerText) {
    payload.interactive.header = { type: "text", text: headerText };
  }
  if (footerText) {
    payload.interactive.footer = { text: footerText };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data?.error?.message || "API Error", errorCode: data?.error?.code };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendInteractiveList(
  phoneNumber: string,
  bodyText: string,
  buttonText: string,
  sections: { title?: string; rows: { id: string; title: string; description?: string }[] }[],
  headerText?: string,
  footerText?: string
): Promise<WhatsAppApiResponse> {
  const config = getBaseConfig(phoneNumber);
  if (config.error) {
    return { success: false, error: config.error };
  }
  const { accessToken, phoneNumberId, apiVersion, to } = config;

  const payload: any = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: headerText ? { type: "text", text: headerText } : undefined,
      body: { text: bodyText },
      footer: footerText ? { text: footerText } : undefined,
      action: {
        button: buttonText.substring(0, 20), // Max 20 chars
        sections: sections.map((sec) => ({
          title: sec.title,
          rows: sec.rows.map((row) => ({
            id: row.id,
            title: row.title.substring(0, 24), // Max 24 chars
            description: row.description ? row.description.substring(0, 72) : undefined,
          })),
        })),
      },
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data?.error?.message || "API Error", errorCode: data?.error?.code };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendProductList(
  phoneNumber: string,
  bodyText: string,
  products: any[]
): Promise<WhatsAppApiResponse> {
  let fullBody = bodyText + "\n\n";
  const rows = [];
  
  for (let i = 0; i < products.length; i++) {
     const p = products[i];
     fullBody += `${i + 1}. ${p.name} — ₹${p.price}\n`;
     
     // Extract slug from URL if possible, or assume it's passed as slug
     const slug = p.url ? p.url.split("/").pop() : p.slug;
     
     // Max 24 chars for title
     rows.push({
        id: `DETAILS|${slug}`,
        title: `Details for #${i + 1}`,
        description: p.name
     });
     rows.push({
        id: `ADD_CART|${slug}`,
        title: `Add #${i + 1} to Cart`,
        description: `₹${p.price}`
     });
  }

  // Max 10 rows per section in Meta API, so if products > 5, we might need multiple sections or limit to 5.
  // The tool searchProducts already limits to 5.

  return sendInteractiveList(
     phoneNumber,
     fullBody.trim(),
     "View Options",
     [
       {
         title: "Products",
         rows: rows.slice(0, 10)
       }
     ]
  );
}

export async function sendProductCarousel(
  phoneNumber: string,
  bodyText: string,
  products: any[]
): Promise<WhatsAppApiResponse> {
  console.log(`[WA DEBUG] sendProductCarousel CALLED`);
  console.log(`[WA DEBUG] product count: ${products.length}`);

  const config = getBaseConfig(phoneNumber);
  if (config.error) {
    return { success: false, error: config.error };
  }
  const { accessToken, phoneNumberId, apiVersion, to } = config;

  const payload: any = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "carousel",
      carousel: {
        cards: products.map((p) => {
          const slug = p.url ? p.url.split("/").pop() : p.slug;
          return {
            header: {
              type: "image",
              image: {
                link: p.image || "https://framekart.co.in/images/branding/Frame-2.png" // Ensure valid image
              }
            },
            body: {
              text: `${p.name}\n₹${p.price}\n\nTap below to view or add to cart.`
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: `DETAILS|${slug}`,
                    title: "View Product"
                  }
                },
                {
                  type: "reply",
                  reply: {
                    id: `ADD_CART|${slug}`,
                    title: "Add to Cart"
                  }
                }
              ]
            }
          };
        }).slice(0, 10) // Max 10 cards usually
      }
    }
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[WA DEBUG] CAROUSEL FAILED", JSON.stringify(data?.error));
      console.log(`[WA DEBUG] META PRODUCT RESPONSE:\nstatus: ${response.status}\nerror.code: ${data?.error?.code}\nerror.message: ${data?.error?.message}\nerror.details: ${data?.error?.error_data?.details || ''}`);
      console.log(`[WA DEBUG] FALLING BACK TO INTERACTIVE LIST`);
      return await sendProductList(phoneNumber, bodyText, products);
    }

    console.log(`[WA DEBUG] META PRODUCT RESPONSE: SUCCESS`);
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    console.error("[WA DEBUG] CAROUSEL FAILED", error.message);
    console.log(`[WA DEBUG] FALLING BACK TO INTERACTIVE LIST`);
    return await sendProductList(phoneNumber, bodyText, products);
  }
}

