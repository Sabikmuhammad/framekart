export interface WhatsAppApiResponse {
  success: boolean;
  messageId?: string;
  error?: any;
  errorCode?: string | number;
}

export interface SendWhatsAppWelcomeOptions {
  phoneNumber: string;
  name: string;
}

/**
 * Sends a welcome message to captured visitors.
 */
export async function sendVisitorWelcomeMessage({
  phoneNumber,
  name,
}: SendWhatsAppWelcomeOptions): Promise<WhatsAppApiResponse> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_WELCOME_TEMPLATE_NAME || "framekart_welcome";
  const templateLanguage = process.env.WHATSAPP_WELCOME_TEMPLATE_LANGUAGE || "en";
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v19.0";

  if (!accessToken || !phoneNumberId) {
    console.warn("Skipping WhatsApp welcome: missing credentials");
    return { success: false, error: "Missing credentials" };
  }

  // Normalize phone number: remove all non-digits
  let to = phoneNumber.replace(/\D/g, "");
  // Default to +91 if only 10 digits were provided
  if (to.length === 10) {
    to = "91" + to;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: templateLanguage,
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://framekart.co.in/images/branding/Frame-2.png"
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: name || "Customer",
            },
          ],
        },
      ],
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
      console.error("[WhatsApp Welcome] Failed", {
        status: response.status,
        errorCode: data?.error?.code,
        errorMessage: data?.error?.message,
      });
      return { success: false, error: data?.error?.message || "API Error", errorCode: data?.error?.code };
    }

    console.log("[WhatsApp Welcome] Success", {
      messageId: data.messages?.[0]?.id,
    });
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error: any) {
    console.error("[WhatsApp Welcome] Failed", {
      errorMessage: error.message,
    });
    return { success: false, error: error.message };
  }
}
