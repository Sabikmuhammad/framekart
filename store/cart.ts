import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getSavedCartEmail,
  normalizeCartEmail,
  saveCartEmail,
  syncCartSession,
} from "@/lib/cart/client";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  frame_size: string;
  frame_material: string;
  isCustom?: boolean;
  customFrame?: {
    uploadedImageUrl: string;
    frameStyle: "Black" | "White" | "Wooden";
    frameSize: "A4" | "12x18" | "18x24" | "24x36";
    customerNotes?: string;
    occasion?: "custom" | "birthday" | "wedding";
    occasionMetadata?: {
      name?: string; age?: string; date?: string; message?: string;
      brideName?: string; groomName?: string; weddingDate?: string; quote?: string;
    };
  };
  isTemplate?: boolean;
  templateFrame?: {
    occasion: "birthday" | "wedding";
    templateImage: string;
    uploadedPhoto?: string;
    frameSize: "A4";
    frameStyle: "Black" | "White" | "Wooden";
    metadata: {
      name?: string; age?: string; date?: string; message?: string;
      brideName?: string; groomName?: string; weddingDate?: string; quote?: string;
    };
  };
}

interface CartStore {
  items: CartItem[];
  customerEmail: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerEmail: (email: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

function buildCartProducts(items: CartItem[]) {
  return items.map((item) => ({
    productId: item._id,
    name: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.imageUrl,
  }));
}

function syncSnapshot(items: CartItem[], total: number, email: string) {
  void syncCartSession({
    email,
    products: buildCartProducts(items),
    total,
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerEmail: getSavedCartEmail(),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i._id === item._id);
          const newItems: CartItem[] = existing
            ? state.items.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...state.items, { ...item, quantity: 1 }];

          const cartTotal = newItems.reduce((t, i) => t + i.price * i.quantity, 0);
          syncSnapshot(newItems, cartTotal, state.customerEmail);
          return { items: newItems };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i._id !== id);
          const cartTotal = newItems.reduce((t, i) => t + i.price * i.quantity, 0);
          syncSnapshot(newItems, cartTotal, state.customerEmail);
          return { items: newItems };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) => i._id === id ? { ...i, quantity } : i);
          const cartTotal = newItems.reduce((t, i) => t + i.price * i.quantity, 0);
          syncSnapshot(newItems, cartTotal, state.customerEmail);
          return { items: newItems };
        }),

      clearCart: () => {
        const email = get().customerEmail;
        syncSnapshot([], 0, email);
        set({ items: [] });
      },

      setCustomerEmail: (email) => {
        const normalizedEmail = normalizeCartEmail(email);
        saveCartEmail(normalizedEmail);
        const items = get().items;
        const total = get().getTotalPrice();
        syncSnapshot(items, total, normalizedEmail);
        set({ customerEmail: normalizedEmail });
      },

      getTotalPrice: () =>
        get().items.reduce((t, i) => t + i.price * i.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
