"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Prevent background scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-50 no-print"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col no-print border-l border-slate-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-slate-800 text-lg">My Cart</h2>
                  <p className="text-xs text-slate-400 font-semibold">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 text-slate-300">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <h3 className="font-heading font-bold text-slate-700 text-base mb-1">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-[240px] font-medium leading-relaxed mb-6">
                    Add Ayurvedic herbs, supplements, or medical diagnostic devices to get started.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/products");
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 active:scale-95 cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-slate-150 shadow-sm hover:shadow-md transition-all group relative bg-white"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      <Image
                        src={item.imageUrl || "/logo/logo.png"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        {/* Quantity adjustment */}
                        <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-450 hover:text-slate-800 transition-all cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= 3}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-455 hover:text-slate-800 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-black text-emerald-600 text-sm">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[9px] text-slate-400 font-semibold leading-none mt-0.5">
                              ₹{item.price.toFixed(0)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkouts */}
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50 space-y-4 shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="font-bold text-sm text-slate-800">Total Price</span>
                    <span className="font-black text-lg text-emerald-600">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">GST and discounts will be calculated at checkout page.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/cart");
                    }}
                    className="w-full py-3 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      // Route directly to checkout inside full-screen cart
                      router.push("/cart?checkout=true");
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    Checkout
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
