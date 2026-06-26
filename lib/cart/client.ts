const CART_SESSION_STORAGE_KEY = "framekart_cart_session_id";
const CART_EMAIL_STORAGE_KEY = "framekart_cart_email";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CartSyncProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function getCartSessionId() {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(CART_SESSION_STORAGE_KEY);
  if (existing) return existing;

  const sessionId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `cart_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(CART_SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export function getSavedCartEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(CART_EMAIL_STORAGE_KEY) || "";
}

export function saveCartEmail(email: string) {
  if (typeof window === "undefined") return;

  const normalizedEmail = normalizeCartEmail(email);
  if (!normalizedEmail) {
    window.localStorage.removeItem(CART_EMAIL_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CART_EMAIL_STORAGE_KEY, normalizedEmail);
}

export function normalizeCartEmail(email?: string) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  if (!normalizedEmail) return "";
  return EMAIL_REGEX.test(normalizedEmail) ? normalizedEmail : "";
}

export async function syncCartSession(payload: {
  email?: string;
  products: CartSyncProduct[];
  total: number;
}) {
  if (typeof window === "undefined") return;

  const sessionId = getCartSessionId();
  const email = normalizeCartEmail(payload.email || getSavedCartEmail());

  if (email) {
    saveCartEmail(email);
  }

  await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      email: email || undefined,
      products: payload.products,
      total: payload.total,
    }),
    keepalive: true,
  }).catch(() => {
    // Abandoned-cart sync is best-effort; order creation is the critical path.
  });
}
