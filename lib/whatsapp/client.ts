export interface SendWhatsAppOtpOptions {
  phoneNumber: string;
  otp: string;
}

export interface WhatsAppApiResponse {
  success: boolean;
  messageId?: string;
  error?: any;
}

/**
 * Sends an OTP using the Meta WhatsApp Cloud API.
 */
export async function sendWhatsAppOtp({
  phoneNumber,
  otp,
}: SendWhatsAppOtpOptions): Promise<WhatsAppApiResponse> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error("Missing WhatsApp Meta API credentials.");
    return { success: false, error: "Missing configuration" };
  }

  // Remove the "+" from E.164 for Meta API
  const to = phoneNumber.startsWith("+") ? phoneNumber.slice(1) : phoneNumber;

  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "auth_otp", // Replace with your actual approved template name
      language: {
        code: "en", // Replace with your template's language code (e.g. en_US)
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
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
      console.error("WhatsApp API Error:", JSON.stringify(data));
      return { success: false, error: data.error };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("Failed to call WhatsApp API:", error);
    return { success: false, error: error.message };
  }
}
