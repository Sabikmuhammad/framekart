import { create } from "zustand";

export interface FlyItem {
  id: string;
  imageSrc: string;
  startRect: DOMRect;
  targetRect: DOMRect;
}

interface FlyCartStore {
  items: FlyItem[];
  addFlyItem: (imageSrc: string, startRect: DOMRect) => void;
  removeItem: (id: string) => void;
}

export const useFlyCartStore = create<FlyCartStore>((set) => ({
  items: [],
  addFlyItem: (imageSrc, startRect) => set((state) => {
    // Only allow max 3 simultaneous fly animations to prevent spam
    if (state.items.length >= 3) return state;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // We expect the cart icon to have a specific ID or data-attribute
    const targetElement = document.querySelector(isMobile ? '[data-cart-target="mobile"]' : '[data-cart-target="desktop"]');
    
    if (!targetElement) return state; // If no cart icon found, skip visual animation safely
    
    const targetRect = targetElement.getBoundingClientRect();
    
    return {
      items: [...state.items, {
        id: Math.random().toString(36).substring(2, 9),
        imageSrc,
        startRect,
        targetRect
      }]
    };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));
