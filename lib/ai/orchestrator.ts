import { callGroq, groqModel } from "./provider";
import { toolDeclarations, executeTool } from "./registry";
import { getConversation, appendMessage, setConversationState } from "./conversation";

const SYSTEM_PROMPT = `You are FrameKart's official AI shopping and customer-support assistant on WhatsApp.
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
  // 1. Get Conversation
  const conversation = await getConversation(phone, waId);
  console.log(`[WhatsApp Conversation]\nconversation loaded/created`);

  if (conversation.conversationState === "HUMAN_HANDOFF") {
    // We are in human handoff mode, do not auto-reply.
    console.log(`[FrameKartWhatsAppAgent] Conversation with ${phone} is in HUMAN_HANDOFF. Skipping AI.`);
    return null;
  }

  // 2. Append User Message to DB
  await appendMessage(phone, { role: "user", content: text });

  // 3. Build History for Groq
  // Filter history to last 10 messages for token efficiency
  const recentHistory = conversation.messages.slice(-10);
  
  // Convert custom conversation format to Groq/OpenAI format
  const groqHistory: any[] = [
    { role: "system", content: SYSTEM_PROMPT }
  ];

  for (const m of recentHistory) {
    if (m.role === "tool") {
       groqHistory.push({ role: "user", content: `[Tool Result for ${m.name}]: ${m.content}` });
    } else if (m.role === "model") {
       groqHistory.push({ role: "assistant", content: m.content });
    } else {
       groqHistory.push({ role: "user", content: m.content });
    }
  }

  try {
    console.log(`[FrameKart AI]\nstarting orchestration`);
    console.log(`[FrameKart AI]\nprovider: Groq`);
    console.log(`[FrameKart AI]\nmodel: ${groqModel}`);

    let responseData = await callGroq(groqHistory, toolDeclarations);
    
    // Handle potential tool calls
    let messageResponse = responseData.choices[0].message;
    
    while (messageResponse.tool_calls && messageResponse.tool_calls.length > 0) {
      const call = messageResponse.tool_calls[0];
      const toolName = call.function.name;
      const toolArgsString = call.function.arguments;
      let toolArgs = {};
      
      try {
        toolArgs = JSON.parse(toolArgsString);
      } catch (e) {
        // failed to parse
      }

      console.log(`[FrameKart AI]\ntool call: ${toolName}`);
      
      // Execute tool
      const toolResult = await executeTool(toolName, toolArgs);
      
      console.log(`[FrameKart AI]\ntool completed`);

      // Store tool response in DB for context
      await appendMessage(phone, { role: "tool", name: toolName, content: JSON.stringify(toolResult) });

      if (toolResult.status === "HUMAN_HANDOFF") {
        await setConversationState(phone, "HUMAN_HANDOFF", "SUPPORT");
      }

      // Add to current conversation array for the follow-up AI call
      groqHistory.push(messageResponse); // Assistant's request to call the tool
      groqHistory.push({ 
        role: "tool", 
        tool_call_id: call.id, 
        name: toolName, 
        content: JSON.stringify(toolResult) 
      });

      // Call Groq again with the tool result
      responseData = await callGroq(groqHistory, toolDeclarations);
      messageResponse = responseData.choices[0].message;
    }

    const finalReply = messageResponse.content || "I'm sorry, I couldn't understand that.";
    console.log(`[FrameKart AI]\nresponse generated`);

    // Append AI Response to DB
    await appendMessage(phone, { role: "model", content: finalReply });

    return finalReply;

  } catch (error: any) {
    console.log(`[FrameKart AI] Groq request failed\nstatus: ${error?.status || ''}\nerrorCode: ${error?.status || ''}\nerrorMessage: ${error?.message || error}`);
    return "Sorry, I'm having a temporary issue processing your request. Please try again in a moment.";
  }
}
