import { aiClient, geminiModel, toGenAiRole } from "./provider";
import { toolDeclarations, executeTool } from "./registry";
import { getConversation, appendMessage, setConversationState } from "./conversation";

const SYSTEM_PROMPT = `You are FrameKart's official AI shopping assistant on WhatsApp.
Tone: Premium, friendly, concise, professional, helpful, natural. Handle spelling mistakes gracefully.
You understand Indian customers, INR prices (use ₹ symbol), and common WhatsApp shorthand (e.g., "hi", "price?", "thx").

RULES:
1. Keep replies very short and concise for WhatsApp readability. Do not send large walls of text.
2. NEVER invent prices, discounts, stock, delivery dates, orders, product URLs, or store info. ALWAYS use tools to search products or check order status.
3. If you don't know something or a tool fails, say: "I don't have that information right now. Let me know if you want to speak with our support team."
4. Do not expose internal technical errors.
5. If the user asks for a custom frame, guide them to: https://framekart.co.in/custom-frame
6. When sending product details, include the title, price, and URL.
7. If the user explicitly asks for human help or support, use the humanHandoff tool.
`;

export async function handleIncomingWhatsAppMessage(phone: string, waId: string, text: string): Promise<string | null> {
  if (!aiClient) {
    console.error("[FrameKartWhatsAppAgent] No AI client configured.");
    return null;
  }

  // 1. Get Conversation
  const conversation = await getConversation(phone, waId);
  console.log(`[WhatsApp Conversation] conversation loaded/created`);

  if (conversation.conversationState === "HUMAN_HANDOFF") {
    // We are in human handoff mode, do not auto-reply.
    // If the user says "restart" or something, maybe we can reset it, but for now ignore.
    console.log(`[FrameKartWhatsAppAgent] Conversation with ${phone} is in HUMAN_HANDOFF. Skipping AI.`);
    return null;
  }

  // 2. Append User Message to DB
  await appendMessage(phone, { role: "user", content: text });

  // 3. Build History for GenAI
  // Filter history to last 10 messages for token efficiency
  const recentHistory = conversation.messages.slice(-10);
  
  // Create chat session
  const chat = aiClient.chats.create({
    model: geminiModel,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: toolDeclarations as any }],
      temperature: 0.2, // Low temp for more factual/deterministic responses
    }
  });

  const genAiHistory = recentHistory.map(m => {
    if (m.role === "tool") {
       return { role: "user", parts: [{ text: `[Tool Result for ${m.name}]: ${m.content}` }] };
    }
    return {
      role: toGenAiRole(m.role),
      parts: [{ text: m.content }]
    };
  });

  try {
    console.log(`[FrameKart AI] model: ${geminiModel}`);

    const chatSession = aiClient.chats.create({
      model: geminiModel,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: toolDeclarations as any }],
        temperature: 0.2,
      },
      history: genAiHistory as any
    });

    let response = await chatSession.sendMessage({ message: text } as any);
    
    // Handle potential tool calls
    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const toolName = call.name;
      const toolArgs = call.args;

      if (!toolName) break;
      
      console.log(`[FrameKart AI] intent detected, tool: ${toolName}`);
      console.log(`[FrameKart AI] tool args:`, toolArgs);

      // Execute tool
      const toolResult = await executeTool(toolName, toolArgs);
      
      console.log(`[FrameKart AI] tool completed`);

      // Store tool response in DB for context
      await appendMessage(phone, { role: "tool", name: toolName, content: JSON.stringify(toolResult) });

      if (toolResult.status === "HUMAN_HANDOFF") {
        await setConversationState(phone, "HUMAN_HANDOFF", "SUPPORT");
      }

      // Send result back to AI
      response = await chatSession.sendMessage({ message: [{
        functionResponse: {
          name: toolName,
          response: toolResult
        }
      }] } as any);
    }

    const finalReply = response.text || "I'm sorry, I couldn't understand that.";
    console.log(`[FrameKart AI] response generated`);

    // Append AI Response to DB
    await appendMessage(phone, { role: "model", content: finalReply });

    return finalReply;

  } catch (error: any) {
    console.log(`[FrameKart AI] FAILED\nerrorCode: ${error?.status || ''}\nerrorMessage: ${error?.message || error}`);
    return "Sorry, I'm having trouble processing that right now. Please try again in a moment.";
  }
}
