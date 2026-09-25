export const groqModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
export const groqApiKey = process.env.GROQ_API_KEY || "";

export async function callGroq(messages: any[], tools: any[] = []) {
  if (!groqApiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const payload: any = {
    model: groqModel,
    messages: messages,
    temperature: 0.2,
  };

  if (tools.length > 0) {
    payload.tools = tools.map((t) => ({
      type: "function",
      function: t,
    }));
    payload.tool_choice = "auto";
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorObj = { status: response.status, message: errorText };
    throw errorObj;
  }

  return response.json();
}
