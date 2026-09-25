import { NextResponse } from "next/server";
import { verifyWhatsAppSignature } from "@/lib/whatsapp/webhook";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("X-Hub-Signature-256");
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (!appSecret) {
      console.error("Missing WHATSAPP_APP_SECRET environment variable.");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const bodyText = await req.text();

    if (!verifyWhatsAppSignature(bodyText, signature, appSecret)) {
      console.error("Invalid WhatsApp webhook signature.");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(bodyText);

    // Process WhatsApp Webhook Event
    if (payload.object) {
      // Connect to DB once if we have actionable changes
      if (payload.entry?.[0]?.changes?.[0]?.value?.statuses) {
        const { default: dbConnect } = await import("@/lib/db");
        const { default: VisitorLead } = await import("@/models/VisitorLead");
        await dbConnect();
        
          for (const status of payload.entry[0].changes[0].value.statuses) {
            let deliveryStatus = "PENDING";
            if (status.status === "sent") deliveryStatus = "SENT";
            if (status.status === "delivered") deliveryStatus = "DELIVERED";
            if (status.status === "read") deliveryStatus = "READ";
            if (status.status === "failed") deliveryStatus = "FAILED";

            const updatePayload: any = { whatsappDeliveryStatus: deliveryStatus };

            if (status.status === "failed") {
              const err = status.errors && status.errors[0] ? status.errors[0] : null;
              
              const errorCode = err?.code || "UNKNOWN_CODE";
              const errorTitle = err?.title || "Unknown Error";
              const errorMessage = err?.message || "";
              const errorDetails = err?.error_data?.details || "";

              // Build a formatted error string for the frontend drawer
              let formattedError = `Code: ${errorCode}\nTitle: ${errorTitle}`;
              if (errorMessage) formattedError += `\nMessage: ${errorMessage}`;
              if (errorDetails) formattedError += `\nDetails: ${errorDetails}`;
              formattedError += `\nRecipient: ${status.recipient_id || "unknown"}`;
              formattedError += `\nTimestamp: ${status.timestamp || "unknown"}`;

              updatePayload.whatsappWelcomeError = formattedError;

              // Log safe diagnostic message
              console.log(`\n[WhatsApp Message Status] FAILED`);
              console.log(`messageId: ${status.id}`);
              console.log(`recipient: ${status.recipient_id || "unknown"}`);
              console.log(`timestamp: ${status.timestamp || "unknown"}`);
              console.log(`errorCode: ${errorCode}`);
              console.log(`errorTitle: ${errorTitle}`);
              console.log(`errorMessage: ${errorMessage}`);
              console.log(`errorDetails: ${errorDetails}\n`);
            } else {
              console.log(`[WhatsApp Message Status] ${status.status.toUpperCase()} for ID: ${status.id}`);
            }

            await VisitorLead.updateOne(
              { whatsappWelcomeMessageId: status.id },
              { $set: updatePayload }
            );
          }
      }

      if (
        payload.entry &&
        payload.entry[0].changes &&
        payload.entry[0].changes[0] &&
        payload.entry[0].changes[0].value.messages &&
        payload.entry[0].changes[0].value.messages[0]
      ) {
        const message = payload.entry[0].changes[0].value.messages[0];
        const messageId = message.id;
        const senderPhone = message.from;
        
        console.log(`\n[WhatsApp Incoming]`);
        console.log(`messageId: ${messageId}`);
        console.log(`sender: ${senderPhone}`);
        console.log(`text: ${message?.text?.body}\n`);

        // Handle text messages
        if (message.type === "text" && message.text && message.text.body) {
          const textContent = message.text.body;

          const { sendWhatsAppText } = await import("@/lib/whatsapp/sendText");

          const normalizedText = textContent.trim().toLowerCase();
          const greetings = ["hi", "hii", "hello", "hey", "heyy", "hi there", "hello framekart"];

          if (greetings.includes(normalizedText)) {
            const deterministicReply = "Hi! Welcome to FrameKart. How can I help you today?";
            console.log(`[FrameKart AI] deterministic response triggered`);
            
            console.log(`[WhatsApp Outgoing]\nsending response`);
            const sendResult = await sendWhatsAppText(senderPhone, deterministicReply);
            if (sendResult.success) {
              console.log(`[WhatsApp Outgoing]\nSuccess\nmessageId: ${sendResult.messageId}`);
            } else {
              console.log(`[WhatsApp Outgoing]\nFAILED\nerrorCode: ${sendResult.errorCode}\nerrorMessage: ${sendResult.error}`);
            }
          } else {
            const { handleIncomingWhatsAppMessage } = await import("@/lib/ai/orchestrator");
            
            // Await AI so Vercel doesn't kill execution
            try {
              const aiReply = await handleIncomingWhatsAppMessage(senderPhone, messageId, textContent);
              if (aiReply) {
                console.log(`[WhatsApp Outgoing]\nsending response`);
                const sendResult = await sendWhatsAppText(senderPhone, aiReply);
                if (sendResult.success) {
                  console.log(`[WhatsApp Outgoing]\nSuccess\nmessageId: ${sendResult.messageId}`);
                } else {
                  console.log(`[WhatsApp Outgoing]\nFAILED\nerrorCode: ${sendResult.errorCode}\nerrorMessage: ${sendResult.error}`);
                }
              }
            } catch (err) {
              console.error("[WhatsApp Webhook] AI handling failed:", err);
            }
          }
        }
      }

      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Bad Request", { status: 400 });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
