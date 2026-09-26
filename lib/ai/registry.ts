import * as ToolImpls from "./tools";

export const toolDeclarations = [
  {
    name: "searchProducts",
    description: "Search the FrameKart product catalog based on user requirements.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Category of the product (e.g., frames, custom, birthday)",
        },
        color: {
          type: "string",
          description: "Color of the frame (e.g., black, white, gold, wooden)",
        },
        maxPrice: {
          type: "number",
          description: "Maximum price in INR",
        },
        query: {
          type: "string",
          description: "General search query if no specific category or color is provided",
        },
      },
    },
  },
  {
    name: "getOrderStatus",
    description: "Check the status of a specific customer order. Require the order number from the user before calling this.",
    parameters: {
      type: "object",
      properties: {
        orderNumber: {
          type: "string",
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
  {
    name: "addToCart",
    description: "Add a specific product to the customer's cart. You must provide the product slug.",
    parameters: {
      type: "object",
      properties: {
        productSlug: {
          type: "string",
          description: "The slug of the product to add to cart (e.g. golden-minimalist-frame)",
        },
        quantity: {
          type: "number",
          description: "The quantity to add (default to 1 if not specified)",
        }
      },
      required: ["productSlug", "quantity"],
    },
  },
];

export async function executeTool(name: string, args: any, context?: any): Promise<any> {
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
    case "addToCart":
      return await ToolImpls.addToCart({ ...args, sessionId: context?.phone });
    default:
      return { error: `Tool ${name} not found or not implemented.` };
  }
}
