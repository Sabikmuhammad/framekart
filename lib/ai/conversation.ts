import dbConnect from "@/lib/db";
import WhatsAppConversation, { IWhatsAppMessage, IWhatsAppConversation } from "@/models/WhatsAppConversation";

export async function getConversation(phone: string, waId: string): Promise<IWhatsAppConversation> {
  await dbConnect();

  let conversation = await WhatsAppConversation.findOne({ phone });

  if (!conversation) {
    conversation = await WhatsAppConversation.create({
      phone,
      waId,
      messages: [],
    });
  }

  return conversation;
}

export async function appendMessage(
  phone: string,
  message: { role: "user" | "model" | "tool"; content: string; name?: string }
) {
  await dbConnect();
  
  const isUser = message.role === "user";

  const update: any = {
    $push: { messages: message },
    $set: { lastMessageAt: new Date() },
  };

  if (isUser) {
    update.$set.lastInboundMessageAt = new Date();
  } else {
    update.$set.lastOutboundMessageAt = new Date();
  }

  await WhatsAppConversation.updateOne({ phone }, update);
}

export async function setConversationState(phone: string, state: "ACTIVE" | "HUMAN_HANDOFF", intent?: string) {
  await dbConnect();

  const update: any = {
    $set: { conversationState: state },
  };
  
  if (intent) {
    update.$set.currentIntent = intent;
  }

  await WhatsAppConversation.updateOne({ phone }, update);
}
