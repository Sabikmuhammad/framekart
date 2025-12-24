import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  frame_size: string;
  frame_material: string;
  // Custom frame fields
  isCustom?: boolean;
  customFrame?: {
    uploadedImageUrl: string;
    frameStyle: "Black" | "White" | "Wooden";
    frameSize: "A4" | "12x18" | "18x24" | "24x36";
    customerNotes?: string;
    occasion?: "custom" | "birthday" | "wedding";
    occasionMetadata?: {
      // Birthday fields
      name?: string;
      age?: string;
      date?: string;
      message?: string;
      // Wedding fields
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
      quote?: string;
    };
  };
  // Template frame fields (NEW)
  isTemplate?: boolean;
  templateFrame?: {
    occasion: "birthday" | "wedding";
    templateImage: string;
    uploadedPhoto?: string;
    frameSize: "A4";
    frameStyle: "Black" | "White" | "Wooden";
    metadata: {
      name?: string;
      age?: string;
      date?: string;
      message?: string;
      brideName?: string;
      groomName?: string;
      weddingDate?: string;
      quote?: string;
    };
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i._id === item._id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item._id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => {
        console.log('🧹 clearCart() called - clearing items');
        set({ items: [] });
        console.log('✅ Cart state set to empty array');
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
