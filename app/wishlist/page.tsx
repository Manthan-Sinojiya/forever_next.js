"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";
import { HeartOff, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function WishlistPage() {
  const mounted = useIsMounted();
  const wishlist = useCartStore((state) => state.wishlist || []);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-[#F8FAFC] min-h-screen">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3">
                My Wishlist
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-sm">
                {wishlist.length > 0
                  ? `You have ${wishlist.length} item${wishlist.length > 1 ? "s" : ""} saved. Keep track of products you love.`
                  : "Keep track of products you love."}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Wishlist Content */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {wishlist.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-12 md:p-20 text-center max-w-2xl mx-auto shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <HeartOff className="w-10 h-10 text-emerald-300" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-slate-800 mb-3">Your wishlist is empty</h2>
                <p className="text-slate-500 mb-8 font-medium">
                  Save items you love by clicking the heart icon on any product.
                </p>
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((item, index) => (
                  <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <ProductCard
                      product={item}
                      variant="wishlist"
                      onWishlistToggle={() => toggleWishlist(item)}
                      onAddToCart={() => {
                        addToCart(item);
                        toggleWishlist(item);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
