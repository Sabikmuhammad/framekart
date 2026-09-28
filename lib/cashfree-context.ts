export function generateCheckoutContext(orderNumber: string, items: any[]): string {
  if (!orderNumber) {
    orderNumber = "ORDER";
  }

  let summary = "";
  
  if (!items || items.length === 0) {
    summary = "Frame Order";
  } else if (items.length === 1) {
    // Single item
    const item = items[0];
    const qty = item.quantity || 1;
    const name = item.title || item.name || "Frame";
    summary = qty > 1 ? `${qty} ${name}` : name;
  } else {
    // Multiple items
    const totalQty = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    
    // Check if they are all the same 'type' of thing intuitively, or just say X items
    // Let's try to list them if short enough, else fallback
    const names = items.map((item: any) => {
      const qty = item.quantity || 1;
      const name = item.title || item.name || "Frame";
      return qty > 1 ? `${qty} ${name}s` : name;
    });

    const combined = names.join(" + ");
    if (combined.length <= 50) {
      summary = combined;
    } else {
      summary = `${totalQty} Frames`;
    }
  }

  // Remove control characters and multiple spaces
  summary = summary.replace(/[\x00-\x1F\x7F-\x9F]/g, "").replace(/\s+/g, " ").trim();
  
  let context = `FrameKart Order #${orderNumber} · ${summary}`;
  
  // If it exceeds 100 characters, truncate the summary or fallback
  if (context.length > 100) {
    const totalQty = items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 1;
    const fallbackSummary = `${totalQty} Frame${totalQty > 1 ? 's' : ''}`;
    context = `FrameKart Order #${orderNumber} · ${fallbackSummary}`;
    
    // Hard fallback just in case orderNumber is ridiculously long
    if (context.length > 100) {
      context = context.substring(0, 97) + "...";
    }
  }

  return context;
}
