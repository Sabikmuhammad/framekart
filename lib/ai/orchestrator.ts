import { callGroq, groqModel } from "./provider";
import { toolDeclarations, executeTool } from "./registry";
import { getConversation, appendMessage, setConversationState } from "./conversation";

const SYSTEM_PROMPT = `You are FrameKart's official AI shopping and customer-support assistant on WhatsApp.
Tone: Premium, friendly, concise, professional, helpful, natural. Handle spelling mistakes gracefully.
You understand Indian customers, INR prices (use ₹ symbol), and common WhatsApp shorthand (e.g., "hi", "price?", "thx").

RULES:
1. Keep replies very short and concise for WhatsApp readability. Do not send large walls of text.
2. NEVER invent prices, discounts, stock, delivery dates, orders, product URLs, or store info. ALWAYS use tools to search products or check order status.
3. NEVER GENERATE MARKDOWN PRODUCT TABLES (e.g. | Product | Price |) or numbered lists of products in your text response. The presentation layer will display the products natively as interactive cards. Do not expose raw URLs in your text.
4. If you don't know something or a tool fails, say: "I don't have that information right now. Let me know if you want to speak with our support team."
5. Do not expose internal technical errors.
6. Maintain conversation context. If the user says "the second one", it refers to the second product you recently searched and displayed.
7. If the user asks to add something to their cart, use the addToCart tool.
8. If the user explicitly asks for human help or support, use the humanHandoff tool.
9. Avoid repetitive generic responses. Understand the customer's intent and continue naturally.
`;

export async function handleIncomingWhatsAppMessage(phone: string, waId: string, text: string): Promise<{ responseType: string, text?: string, products?: any[] } | null> {
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
    let latestSearchResults = null;
    
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
      
      console.log(`[FrameKart AI] tool called: ${toolName}`);
      
      // Execute tool
      const toolResult = await executeTool(toolName, toolArgs, { phone });
      
      console.log(`[FrameKart AI] tool completed: ${toolName}`);

      // Store tool response in DB for context
      await appendMessage(phone, { role: "tool", name: toolName, content: JSON.stringify(toolResult) });

      if (toolResult.status === "HUMAN_HANDOFF") {
        await setConversationState(phone, "HUMAN_HANDOFF", "SUPPORT");
      }

      if (toolName === "searchProducts" && toolResult.results && toolResult.results.length > 0) {
        console.log(`[FrameKart AI] product count: ${toolResult.results.length}`);
        console.log(`[FrameKart AI] presentation mode: products`);
        // Immediately return products instead of asking Groq to generate a text summary
        // This prevents Groq from generating Markdown tables or bulleted lists.
        return { responseType: "products", products: toolResult.results, text: "Here are some frames matching your request:" };
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
    console.log(`[FrameKart AI] response generated`);
    console.log(`[FrameKart AI] presentation mode: text`);

    // Append AI Response to DB
    await appendMessage(phone, { role: "model", content: finalReply });

    return { responseType: "text", text: finalReply };

  } catch (error: any) {
    console.log(`[FrameKart AI] Groq request failed\nstatus: ${error?.status || ''}\nerrorCode: ${error?.status || ''}\nerrorMessage: ${error?.message || error}`);
    return { responseType: "text", text: "Sorry, I'm having a temporary issue processing your request. Please try again in a moment." };
  }
}
