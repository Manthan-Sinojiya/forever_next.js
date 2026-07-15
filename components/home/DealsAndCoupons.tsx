"use client";

import { useState, useEffect } from "react";
import { Zap, Tag, Copy, Check, Clock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  discountType: string;
  minPurchase: number;
  description: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
}

export default function DealsAndCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dealProduct, setDealProduct] = useState<Product | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });
  const addToCart = useCartStore((state) => state.addToCart);

  // Static fallback deal product info
  const staticDealProduct: Product = {
    _id: "deal-1",
    name: "Pure Ashwagandha Extract 500mg",
    price: 399,
    originalPrice: 999,
    imageUrl: "https://picsum.photos/seed/ashwa/800/800",
    category: "Food Supplements",
    rating: 5,
  };

  useEffect(() => {
    // Fetch coupons from backend
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          // Limit to top 2 coupons for display in the card
          setCoupons(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.log("Failed to load coupons:", err));

    // Fetch today's deal product from database
    fetch("/api/products?todayDeal=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setDealProduct(res.data[0]);
        }
      })
      .catch((err) => console.log("Failed to load today's deal product:", err));

    // Countdown logic
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeProduct = dealProduct || staticDealProduct;
  const originalPrice = activeProduct.originalPrice || Math.round(activeProduct.price * 1.35);
  const savingsPercent = originalPrice > activeProduct.price
    ? Math.round(((originalPrice - activeProduct.price) / originalPrice) * 100)
    : 0;

  const handleBuyDeal = () => {
    addToCart({
      _id: activeProduct._id,
      name: activeProduct.name,
      price: activeProduct.price,
      imageUrl: activeProduct.imageUrl,
      category: activeProduct.category,
      inStock: true,
      featured: false,
      rating: activeProduct.rating,
      description: "Today's lightning deal.",
    });
  };

  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Today's Deal */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            {/* Tag/Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 animate-bounce" /> Today&apos;s Lightning Deal
              </span>
              <span className="text-xs text-muted flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-red-500" /> Ends in:{" "}
                <span className="text-red-500 font-bold font-mono">
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </span>
            </div>

            {/* Product Details Grid */}
            <div className="grid sm:grid-cols-5 gap-4 items-center flex-1">
              <div className="sm:col-span-2 relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Image
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {savingsPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Save {savingsPercent}%
                  </div>
                )}
              </div>
              <div className="sm:col-span-3 space-y-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{activeProduct.category}</span>
                <h3 className="font-heading font-extrabold text-lg text-slate-800 leading-snug">{activeProduct.name}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">₹{activeProduct.price}</span>
                  {originalPrice > activeProduct.price && (
                    <span className="text-sm text-slate-400 line-through">₹{originalPrice}</span>
                  )}
                </div>
                
                {/* Stock progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>72% claimed</span>
                    <span>18 items left</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={handleBuyDeal}
                className="w-full bg-slate-900 hover:bg-emerald-600 hover:shadow-emerald-600/10 text-white py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" /> Add Deal to Cart
              </button>
            </div>
          </div>

          {/* Card 2: Coupons */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Exclusive Store Coupons
              </span>
              <span className="text-xs text-emerald-600 font-bold">Pan India Validity</span>
            </div>

            {/* Coupons List */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {coupons.length === 0 ? (
                // Fallback coupon UI if API loads/fails
                <div className="py-2 space-y-2">
                  {[
                    { code: "AYUR10", desc: "10% OFF on all Ayurvedic Supplements! Min. ₹499" },
                    { code: "HEALTH50", desc: "Flat ₹50 OFF on first purchase! Min. ₹299" }
                  ].map((c) => (
                    <div key={c.code} className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/40 border border-dashed border-emerald-200">
                      <div>
                        <div className="font-extrabold text-slate-800 text-sm">{c.code}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{c.desc}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(c.code)}
                        className="p-2 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-colors"
                      >
                        {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                coupons.map((coupon) => (
                  <div key={coupon._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/40 border border-dashed border-emerald-250 border-emerald-200 hover:border-emerald-300 transition-colors">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-800 tracking-wider text-sm bg-white px-2 py-0.5 rounded border border-emerald-100">{coupon.code}</span>
                        <span className="text-xs font-bold text-emerald-700">
                          {coupon.discountType === "percentage" ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-1">{coupon.description}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="flex-shrink-0 p-2.5 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-600 transition-all active:scale-90"
                      title="Copy Coupon Code"
                    >
                      {copiedCode === coupon.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 text-center text-xs text-slate-400 font-semibold">
              Copy coupon code and apply at checkout for discounts!
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
