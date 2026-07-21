import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  originalPrice?: number;
  category?: string;
}

export type ProductInput = Omit<CartItem, 'quantity'> & { quantity?: number };

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CartState {
  cart: CartItem[];
  wishlist: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  addToCart: (product: ProductInput) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleWishlist: (product: ProductInput) => void;
  isInWishlist: (productId: string) => boolean;
  setWishlist: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      toasts: [],
      addToast: (message, type = 'success') => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        setTimeout(() => {
          get().removeToast(id);
        }, 3000);
        return { toasts: [...state.toasts, { id, message, type }] };
      }),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find(item => item._id === product._id);
        const newCart = existingItem
          ? state.cart.map(item =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...state.cart, { ...product, quantity: product.quantity ?? 1 }];

        setTimeout(() => {
          get().addToast(`"${product.name}" added to cart!`, 'success');
        }, 50);

        return {
          cart: newCart,
          isCartOpen: true
        };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item._id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      toggleWishlist: (product) => set((state) => {
        const exists = state.wishlist.some(item => item._id === product._id);

        if (typeof window !== "undefined") {
          const email = localStorage.getItem("userEmail");
          if (email) {
            fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, productId: product._id }),
            }).catch(err => console.error("Wishlist sync error:", err));
          }
        }

        if (exists) {
          setTimeout(() => {
            get().addToast(`Removed "${product.name}" from wishlist.`, 'info');
          }, 50);
          return { wishlist: state.wishlist.filter(item => item._id !== product._id) };
        }

        setTimeout(() => {
          get().addToast(`Added "${product.name}" to wishlist!`, 'success');
        }, 50);
        return { wishlist: [...state.wishlist, { ...product, quantity: 1 }] };
      }),
      isInWishlist: (productId) => get().wishlist.some(item => item._id === productId),
      setWishlist: (items) => set({ wishlist: items }),
    }),
    {
      name: 'forever-healthcare-store',
      partialize: (state) => ({ cart: state.cart, wishlist: state.wishlist }),
    }
  )
);
