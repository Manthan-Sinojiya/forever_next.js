"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
}

const STATIC_DEALS: Product[] = [
  {
    _id: "deal-1",
    name: "Pure Ashwagandha Extract 500mg",
    price: 399,
    originalPrice: 999,
    imageUrl: "/products/ashwagandha.png",
    category: "Food Supplements",
    rating: 5,
  },
  {
    _id: "deal-2",
    name: "Vitamin C & Zinc Immunity Boosters",
    price: 199,
    originalPrice: 499,
    imageUrl: "/products/vitamin-c-zinc.png",
    category: "Food Supplements",
    rating: 4.8,
  },
  {
    _id: "deal-3",
    name: "Digital Blood Pressure Monitor",
    price: 999,
    originalPrice: 2499,
    imageUrl: "/products/bp-monitor.png",
    category: "Healthcare Equipments",
    rating: 4.8,
  },
  {
    _id: "deal-4",
    name: "Fingertip Pulse Oximeter",
    price: 499,
    originalPrice: 1299,
    imageUrl: "/products/pulse-oximeter.png",
    category: "Healthcare Equipments",
    rating: 4.9,
  },
  {
    _id: "deal-5",
    name: "Premium First Aid Kit",
    price: 299,
    originalPrice: 799,
    imageUrl: "/products/first-aid.png",
    category: "First Aid",
    rating: 4.8,
  },
];

// Helper to determine claimed percentages and items left in a stable way
function getClaimedStats(price: number, id: string) {
  const hash = (price * 7) % 35;
  const claimed = 50 + hash; // 50% - 85%
  const left = Math.max(5, Math.round((price * 3) % 25));
  return { claimed, left };
}

export default function DealsAndCoupons() {
  const [deals, setDeals] = useState<Product[]>(STATIC_DEALS);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });
  
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  useEffect(() => {
    let cancelled = false;
    async function loadDeals() {
      try {
        const res = await fetch("/api/products?todayDeal=true");
        const json = await res.json();
        if (cancelled) return;
        if (json.success && json.data && json.data.length > 0) {
          setDeals(json.data);
        } else {
          setDeals(STATIC_DEALS);
        }
      } catch {
        if (!cancelled) setDeals(STATIC_DEALS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    setLoading(true);
    loadDeals();

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
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 286; // approx card width + gap
      const scrollTo = direction === "left" ? scrollLeft - cardWidth * 2 : scrollLeft + cardWidth * 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const getCartQty = (productId: string) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      originalPrice: product.originalPrice,
    });
  };

  const handleIncrease = (product: Product) => {
    const qty = getCartQty(product._id);
    updateQuantity(product._id, qty + 1);
  };

  const handleDecrease = (product: Product) => {
    const qty = getCartQty(product._id);
    if (qty <= 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, qty - 1);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm w-full">
      <div className="w-full aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 skeleton w-16 rounded" />
        <div className="h-4 skeleton w-4/5 rounded" />
        <div className="h-3 skeleton w-3/5 rounded" />
        <div className="h-8 skeleton w-full rounded-xl pt-2" />
      </div>
    </div>
  );

  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-3xl -ml-48 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl -mr-48 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-red-50 border border-red-100 text-red-650 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500" /> Limited Time Sales
              </span>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse" /> Ends in:
                <div className="flex items-center gap-1">
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono font-black border border-red-100">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-red-550">:</span>
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono font-black border border-red-100">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-red-550">:</span>
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-mono font-black border border-red-100">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-slate-800 leading-tight mt-2">
              Today&apos;s <span className="gradient-text font-black">Lightning Deals</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* View All Button */}
            <Link
              href="/shop"
              className="text-xs text-red-650 hover:text-red-700 font-extrabold flex items-center gap-1 transition-all hover:underline mr-1"
            >
              View All Deals <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Scroll Buttons */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-100"
                aria-label="Previous deals"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-100"
                aria-label="Next deals"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Container */}
        {loading ? (
          <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="snap-start shrink-0 w-[200px] sm:w-[240px] md:w-[260px] lg:w-[270px]">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory pb-6 scroll-smooth"
          >
            {deals.map((product) => {
              const cartQty = getCartQty(product._id);
              const { claimed, left } = getClaimedStats(product.price, product._id);

              return (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[200px] sm:w-[240px] md:w-[260px] lg:w-[270px]"
                >
                  <ProductCard
                    product={product}
                    cartQty={cartQty}
                    variant="deal"
                    claimedPercent={claimed}
                    itemsLeft={left}
                    onAddToCart={() => handleAddToCart(product)}
                    onIncreaseQty={() => handleIncrease(product)}
                    onDecreaseQty={() => handleDecrease(product)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
