import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: ".env.local" });

const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const templateName = process.env.WHATSAPP_WELCOME_TEMPLATE_NAME || "welcome_framekart";
const templateLanguage = process.env.WHATSAPP_WELCOME_TEMPLATE_LANGUAGE || "en";
const apiVersion = process.env.WHATSAPP_API_VERSION || "v19.0";

async function test() {
  console.log("Checking credentials:");
  console.log("Phone Number ID:", !!phoneNumberId);
  console.log("Access Token:", !!accessToken);
  console.log("Template Name:", templateName);
  console.log("Template Language:", templateLanguage);

  const payload = {
    messaging_product: "whatsapp",
    to: "919999999999",
    type: "template",
    template: {
      name: templateName,
      language: { code: templateLanguage },
      components: [
        {
          type: "header",
          parameters: [
            { type: "image", image: { link: "https://framekart.co.in/images/og-image.jpg" } }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: "Test User" }
          ]
        },
        {
          type: "button",
          sub_type: "url",
          index: "0",
          parameters: [
            { type: "text", text: "https://framekart.co.in" }
          ]
        }
      ]
    }
  };

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
  } else {
    console.log("Success:", data);
  }
}

test();
