export function applyPersonalization(html: string, values: Record<string, string>) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    return values[key] ?? match;
  });
}
