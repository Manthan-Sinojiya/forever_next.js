"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import { Trash2, HeartOff, ShoppingCart, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const wishlist = useCartStore((state) => state.wishlist || []);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const addToCart = useCartStore((state) => state.addToCart);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-6 lg:pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 text-primary text-sm font-semibold mb-5">
              <Heart className="w-4 h-4 text-danger fill-danger" />
              Saved Items
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
              My <span className="gradient-text">Wishlist</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              {wishlist.length > 0
                ? `You have ${wishlist.length} item${wishlist.length > 1 ? "s" : ""} saved to your wishlist`
                : "Keep track of products you love."}
            </p>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="pb-12 lg:pb-16 pt-6 lg:pt-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {wishlist.length === 0 ? (
              <div className="bg-light-gray rounded-3xl p-16 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <HeartOff className="w-8 h-8 text-muted" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-foreground mb-2">Your wishlist is empty</h2>
                <p className="text-muted mb-8">
                  Save items you love by clicking the heart icon on any product.
                </p>
                <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-sm">
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {wishlist.map((item) => (
                  <div key={item._id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm card-hover group flex flex-col">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-light-gray mb-4">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur text-danger rounded-xl flex items-center justify-center shadow-sm hover:bg-danger hover:text-white transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col px-1">
                      <h3 className="font-bold text-sm font-heading text-foreground line-clamp-2 mb-2 leading-snug">{item.name}</h3>
                      <div className="text-primary font-bold mb-4 text-xl font-heading">₹{item.price.toFixed(2)}</div>
                      
                      <button 
                        onClick={() => {
                          addToCart(item);
                          toggleWishlist(item); // Remove from wishlist after adding to cart
                        }}
                        className="mt-auto w-full bg-light-gray hover:bg-gradient-to-r hover:from-primary hover:to-primary-light text-primary hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Move to Cart
                      </button>
                    </div>
                  </div>
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
