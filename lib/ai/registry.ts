import { Type } from "@google/genai";
import * as ToolImpls from "./tools";

export const toolDeclarations = [
  {
    name: "searchProducts",
    description: "Search the FrameKart product catalog based on user requirements.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: "Category of the product (e.g., frames, custom, birthday)",
        },
        color: {
          type: Type.STRING,
          description: "Color of the frame (e.g., black, white, gold, wooden)",
        },
        maxPrice: {
          type: Type.NUMBER,
          description: "Maximum price in INR",
        },
        query: {
          type: Type.STRING,
          description: "General search query if no specific category or color is provided",
        },
      },
    },
  },
  {
    name: "getOrderStatus",
    description: "Check the status of a specific customer order. Require the order number from the user before calling this.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        orderNumber: {
          type: Type.STRING,
          description: "The FrameKart order number (e.g. ORD-12345)",
        },
      },
      required: ["orderNumber"],
    },
  },
  {
    name: "getCustomFrameInformation",
    description: "Get information on how to create a custom frame with an uploaded photo, sizing, and pricing.",
  },
  {
    name: "humanHandoff",
    description: "Call this tool if the user explicitly asks to speak to a human, customer support, or if you cannot help them.",
  },
];

export async function executeTool(name: string, args: any): Promise<any> {
  console.log(`[AI Tool] Executing ${name}`, args);
  switch (name) {
    case "searchProducts":
      return await ToolImpls.searchProducts(args);
    case "getOrderStatus":
      return await ToolImpls.getOrderStatus(args);
    case "getCustomFrameInformation":
      return await ToolImpls.getCustomFrameInformation();
    case "humanHandoff":
      return await ToolImpls.humanHandoff();
    default:
      return { error: `Tool ${name} not found or not implemented.` };
  }
}
