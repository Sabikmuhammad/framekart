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
            const deterministicReply = "Hi! 👋 Welcome to FrameKart.\n\nWe turn your favourite moments into timeless frames.\n\nWhat would you like to explore?";
            console.log(`[FrameKart AI] deterministic response triggered`);
            
            console.log(`[WhatsApp Outgoing]\nsending response`);
            const { sendInteractiveButtons } = await import("@/lib/whatsapp/interactive");
            const sendResult = await sendInteractiveButtons(
              senderPhone,
              deterministicReply,
              [
                { id: "SHOP_FRAMES", title: "Shop Frames" },
                { id: "CUSTOM_FRAME", title: "Custom Frame" },
                { id: "TRACK_ORDER", title: "Track Order" },
              ]
            );

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
                const sendResult = await sendWhatsAppText(senderPhone, aiReply.text);
                if (sendResult.success) {
                  console.log(`[WhatsApp Outgoing]\nSuccess\nmessageId: ${sendResult.messageId}`);
                } else {
                  console.log(`[WhatsApp Outgoing]\nFAILED\nerrorCode: ${sendResult.errorCode}\nerrorMessage: ${sendResult.error}`);
                }
                
                if (aiReply.interactiveResults && aiReply.interactiveResults.length > 0) {
                   const { sendProductList } = await import("@/lib/whatsapp/interactive");
                   await sendProductList(senderPhone, "Tap below to view details or add to cart:", aiReply.interactiveResults);
                }
              }
            } catch (err) {
              console.error("[WhatsApp Webhook] AI handling failed:", err);
            }
          }
        } else if (message.type === "interactive") {
          const interactiveData = message.interactive;
          let selectedId = "";
          let selectedTitle = "";
          
          if (interactiveData.type === "button_reply") {
             selectedId = interactiveData.button_reply.id;
             selectedTitle = interactiveData.button_reply.title;
          } else if (interactiveData.type === "list_reply") {
             selectedId = interactiveData.list_reply.id;
             selectedTitle = interactiveData.list_reply.title;
          }

          console.log(`\n[WhatsApp Incoming Interactive]\nID: ${selectedId}\nTitle: ${selectedTitle}\n`);

          const { sendWhatsAppText } = await import("@/lib/whatsapp/sendText");
          const { sendInteractiveButtons, sendInteractiveList } = await import("@/lib/whatsapp/interactive");

          if (selectedId === "SHOP_FRAMES") {
             await sendInteractiveList(
                senderPhone,
                "Absolutely. What kind of frame are you looking for?",
                "Select Category",
                [{
                  title: "Categories",
                  rows: [
                    { id: "CAT|photo frames", title: "Photo Frames" },
                    { id: "CAT|wall frames", title: "Wall Frames" },
                    { id: "CAT|birthday frames", title: "Birthday Frames" },
                    { id: "CAT|calligraphy frames", title: "Calligraphy Frames" }
                  ]
                }]
             );
          } else if (selectedId === "CUSTOM_FRAME") {
             await sendWhatsAppText(senderPhone, "Create a frame using your own favourite photo.\n\nClick here to create a custom frame:\nhttps://framekart.co.in/custom-frame");
          } else if (selectedId === "TRACK_ORDER") {
             await sendWhatsAppText(senderPhone, "Please reply with your order number to track your order.");
          } else if (selectedId.startsWith("CAT|")) {
             const category = selectedId.split("|")[1];
             const { handleIncomingWhatsAppMessage } = await import("@/lib/ai/orchestrator");
             const aiReply = await handleIncomingWhatsAppMessage(senderPhone, messageId, `Show me ${category}`);
             if (aiReply) {
               await sendWhatsAppText(senderPhone, aiReply.text);
               if (aiReply.interactiveResults && aiReply.interactiveResults.length > 0) {
                 const { sendProductList } = await import("@/lib/whatsapp/interactive");
                 await sendProductList(senderPhone, "Tap below to view details or add to cart:", aiReply.interactiveResults);
               }
             }
          } else if (selectedId.startsWith("DETAILS|")) {
             const slug = selectedId.split("|")[1];
             const { handleIncomingWhatsAppMessage } = await import("@/lib/ai/orchestrator");
             const aiReply = await handleIncomingWhatsAppMessage(senderPhone, messageId, `Tell me more about the product with slug ${slug}`);
             if (aiReply) {
               await sendWhatsAppText(senderPhone, aiReply.text);
             }
          } else if (selectedId.startsWith("ADD_CART|")) {
             const slug = selectedId.split("|")[1];
             const { addToCart } = await import("@/lib/ai/tools");
             const result = await addToCart({ productSlug: slug, quantity: 1, sessionId: senderPhone });
             
             if (result.success) {
               await sendInteractiveButtons(
                 senderPhone,
                 result.message + `\nTotal: ₹${result.cartTotal}`,
                 [
                   { id: "VIEW_CART", title: "View Cart" },
                   { id: "SHOP_FRAMES", title: "Continue Shopping" }
                 ]
               );
             } else {
               await sendWhatsAppText(senderPhone, result.error || "Failed to add to cart.");
             }
          } else if (selectedId === "VIEW_CART") {
             await sendWhatsAppText(senderPhone, "You can view your cart and checkout here:\nhttps://framekart.co.in/cart");
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
