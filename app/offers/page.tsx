"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Tag, Gift, Copy, CheckCircle2, Star, Flame, ShoppingCart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import Link from "next/link";

// Countdown Timer
function CountdownTimer({ endsAt }: { endsAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  const calc = useCallback(() => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setTimeLeft({ h, m, s });
  }, [endsAt]);

  useEffect(() => {
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [calc]);

  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5">
      {["h", "m", "s"].map((unit, i) => (
        <span key={unit} className="flex items-center gap-1">
          <span className="bg-white text-slate-800 font-bold text-sm px-2 py-1 rounded-lg min-w-[32px] text-center tabular-nums shadow-sm">
            {fmt(i === 0 ? timeLeft.h : i === 1 ? timeLeft.m : timeLeft.s)}
          </span>
          {i < 2 && <span className="text-white/60 font-bold text-sm">:</span>}
        </span>
      ))}
    </div>
  );
}

const COUPONS = [
  { code: "HEALTH20", discount: "20% OFF", description: "On all Ayurveda products", minOrder: "₹499", validity: "31 Jul 2025", color: "from-emerald-500 to-teal-600" },
  { code: "FIRST15", discount: "15% OFF", description: "On your first order", minOrder: "₹299", validity: "31 Dec 2025", color: "from-blue-500 to-indigo-600" },
  { code: "SAVE50", discount: "₹50 OFF", description: "On orders above ₹999", minOrder: "₹999", validity: "20 Jul 2025", color: "from-orange-500 to-red-600" },
  { code: "FREE100", discount: "₹100 OFF", description: "Free shipping + ₹100 off", minOrder: "₹1499", validity: "25 Jul 2025", color: "from-purple-500 to-pink-600" },
];

const FLASH_DEALS = [
  { id: "1", name: "Ashwagandha 500mg (60 Caps)", originalPrice: 799, price: 499, image: "/products/ashwagandha.png", claimed: 72, total: 100, category: "Ayurveda", rating: 4.8 },
  { id: "2", name: "Digital BP Monitor", originalPrice: 2499, price: 1299, image: "/products/bp-monitor.png", claimed: 45, total: 60, category: "Healthcare Equipment", rating: 4.7 },
  { id: "3", name: "Vitamin C + Zinc 60 Tabs", originalPrice: 399, price: 219, image: "/products/vitamin-c-zinc.png", claimed: 88, total: 100, category: "Nutrition", rating: 4.9 },
  { id: "4", name: "Pulse Oximeter Pro", originalPrice: 1599, price: 899, image: "/products/pulse-oximeter.png", claimed: 33, total: 50, category: "Healthcare Equipment", rating: 4.6 },
];

const COMBOS = [
  { id: "c1", name: "Immunity Booster Combo", description: "Vitamin C + Ashwagandha + Turmeric Curcumin", originalPrice: 1497, price: 999, image: "/products/vitamin-c-zinc.png", badge: "BESTSELLER" },
  { id: "c2", name: "Diabetes Care Pack", description: "Glucometer + Test Strips + Karela Jamun Juice", originalPrice: 2299, price: 1499, image: "/products/glucose-meter.png", badge: "COMBO DEAL" },
  { id: "c3", name: "Heart Health Bundle", description: "BP Monitor + Arjuna Extract + Omega-3", originalPrice: 3199, price: 1999, image: "/products/bp-monitor.png", badge: "SAVE ₹1200" },
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const addToCart = useCartStore((s) => s.addToCart);
  const addToast = useCartStore((s) => s.addToast);

  const flashEndTime = new Date(Date.now() + 6 * 3600 * 1000);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    addToast(`Coupon code "${code}" copied!`, "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1E5AA8] via-[#2d6bc4] to-[#43B97F] text-white py-14 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() }} />
            ))}
          </div>
          <div className="container mx-auto px-4 text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                <Flame className="w-4 h-4 text-orange-300" /> Limited Time Offers
              </span>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">Today&apos;s Best Deals</h1>
              <p className="text-white/80 max-w-xl mx-auto">Exclusive discounts on premium healthcare & Ayurveda products</p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 space-y-14">
          {/* Flash Deals */}
          <section>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold font-heading text-slate-800">Flash Deals</h2>
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <p className="text-slate-500 text-sm">Hurry! Limited stock at these prices.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-600">Ends in:</span>
                <CountdownTimer endsAt={flashEndTime} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FLASH_DEALS.map((deal, i) => {
                const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
                return (
                  <motion.div key={deal.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden group">
                    <div className="relative aspect-square m-2 rounded-2xl overflow-hidden bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
                      <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 text-orange-400" />{deal.claimed}/{deal.total} sold
                      </span>
                    </div>
                    <div className="px-4 pb-4 pt-2 text-center">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{deal.category}</p>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-2 line-clamp-2">{deal.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                        <span className="text-xs text-slate-500">({deal.rating})</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="font-bold text-slate-800">₹{deal.price.toLocaleString("en-IN")}</span>
                        <span className="text-slate-400 line-through text-xs">₹{deal.originalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>{deal.claimed}% claimed</span>
                          <span className="text-red-500">{deal.total - Math.round(deal.total * deal.claimed / 100)} left</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                            initial={{ width: 0 }} whileInView={{ width: `${deal.claimed}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }} viewport={{ once: true }} />
                        </div>
                      </div>
                      <button onClick={() => {
                        addToCart({ _id: deal.id, name: deal.name, price: deal.price, imageUrl: deal.image, quantity: 1 });
                      }}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm">
                        <ShoppingCart className="w-3.5 h-3.5" />Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Combo Deals */}
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-5 h-5 text-purple-500" />
                <h2 className="text-2xl font-bold font-heading text-slate-800">Combo Deals</h2>
              </div>
              <p className="text-slate-500 text-sm">Curated health bundles at unbeatable prices.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {COMBOS.map((combo, i) => {
                const discount = Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100);
                return (
                  <motion.div key={combo.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden">
                    <div className="relative">
                      <div className="h-40 bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={combo.image} alt={combo.name} className="h-32 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                      </div>
                      <span className="absolute top-3 left-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{combo.badge}</span>
                      <span className="absolute top-3 right-3 bg-[#0D623F] text-white text-[10px] font-bold px-2 py-1 rounded-full">{discount}% OFF</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 mb-1">{combo.name}</h3>
                      <p className="text-slate-500 text-xs mb-3">{combo.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold text-slate-800 text-lg">₹{combo.price.toLocaleString("en-IN")}</span>
                        <span className="text-slate-400 line-through text-sm">₹{combo.originalPrice.toLocaleString("en-IN")}</span>
                        <span className="ml-auto text-emerald-600 font-bold text-sm">Save ₹{(combo.originalPrice - combo.price).toLocaleString("en-IN")}</span>
                      </div>
                      <button onClick={() => addToCart({ _id: combo.id, name: combo.name, price: combo.price, imageUrl: combo.image, quantity: 1 })}
                        className="w-full py-2.5 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full text-sm font-bold hover:opacity-90 transition-all">
                        Add Combo to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Coupons */}
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-5 h-5 text-blue-500" />
                <h2 className="text-2xl font-bold font-heading text-slate-800">Discount Coupons</h2>
              </div>
              <p className="text-slate-500 text-sm">Apply these at checkout for instant savings.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {COUPONS.map((coupon, i) => (
                <motion.div key={coupon.code} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className={`bg-gradient-to-br ${coupon.color} rounded-3xl p-5 text-white relative overflow-hidden`}>
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
                  <div className="absolute -right-4 top-8 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="relative">
                    <span className="text-2xl font-bold block mb-1">{coupon.discount}</span>
                    <p className="text-white/90 text-xs mb-3">{coupon.description}</p>
                    <p className="text-white/70 text-[10px] mb-1">Min. order: {coupon.minOrder}</p>
                    <p className="text-white/70 text-[10px] mb-4">Valid till: {coupon.validity}</p>
                    <button onClick={() => copyCode(coupon.code)}
                      className="w-full flex items-center justify-between bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 transition-all">
                      <span className="font-bold text-sm tracking-wider">{coupon.code}</span>
                      {copiedCode === coupon.code ? (
                        <CheckCircle2 className="w-4 h-4 text-green-300" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/80" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">More Deals Await</h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">Explore our full product catalog with 1000+ healthcare & Ayurveda products</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-[#1E5AA8] px-8 py-3.5 rounded-full font-bold hover:bg-white/90 transition-all shadow-lg">
                <ShoppingCart className="w-4 h-4" />
                Shop All Products
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
