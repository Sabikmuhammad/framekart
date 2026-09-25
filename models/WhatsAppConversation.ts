import mongoose, { Schema, model, models } from "mongoose";

export interface IWhatsAppMessage {
  role: "user" | "model" | "tool";
  content: string;
  name?: string; // e.g. tool name
  timestamp: Date;
}

export interface IWhatsAppConversation {
  phone: string;
  waId: string;
  conversationState: "ACTIVE" | "HUMAN_HANDOFF";
  currentIntent?: string;
  messages: IWhatsAppMessage[];
  lastMessageAt: Date;
  lastInboundMessageAt?: Date;
  lastOutboundMessageAt?: Date;
  context?: any;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppMessageSchema = new Schema<IWhatsAppMessage>(
  {
    role: { type: String, enum: ["user", "model", "tool"], required: true },
    content: { type: String, required: true },
    name: { type: String }, // optional, for tool calls/responses
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WhatsAppConversationSchema = new Schema<IWhatsAppConversation>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    waId: {
      type: String,
      required: true,
    },
    conversationState: {
      type: String,
      enum: ["ACTIVE", "HUMAN_HANDOFF"],
      default: "ACTIVE",
    },
    currentIntent: String,
    messages: {
      type: [WhatsAppMessageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    lastInboundMessageAt: Date,
    lastOutboundMessageAt: Date,
    context: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Expire conversations that have been inactive for 24 hours (86400 seconds)
WhatsAppConversationSchema.index({ lastMessageAt: 1 }, { expireAfterSeconds: 86400 });

const WhatsAppConversation = models.WhatsAppConversation || model<IWhatsAppConversation>("WhatsAppConversation", WhatsAppConversationSchema);

export default WhatsAppConversation;
