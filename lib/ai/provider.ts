import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const geminiModel = "gemini-2.5-flash";

// Helper to convert our DB message role to GenAI role
export function toGenAiRole(role: string): "user" | "model" {
  if (role === "tool") return "user"; // In Gemini, tool responses can sometimes be modeled as user responses or function responses depending on SDK version, but GenAI SDK often handles it in specific ways. Wait, standard Gemini expects role: "user" | "model". Tool responses have role: "user" (or "function"). Let's stick to the exact types.
  return role as "user" | "model";
}
