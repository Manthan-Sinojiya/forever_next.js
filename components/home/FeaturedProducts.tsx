"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import ProductCard from "@/components/products/ProductCard";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating: number;
}

// Static fallback medical products shown when API has no data or loads
const STATIC_PRODUCTS: Product[] = [
  {
    _id: "static-1",
    name: "Forever Pure Ashwagandha 500mg | Stress & Vitality",
    category: "Food Supplements",
    price: 499,
    imageUrl: "/products/ashwagandha.png",
    rating: 5,
  },
  {
    _id: "static-2",
    name: "Forever Fit Liver | Natural Liver Detox Supplement",
    category: "Food Supplements",
    price: 599,
    imageUrl: "/products/vitality-capsules.png",
    rating: 4.8,
  },
  {
    _id: "static-3",
    name: "Forever Let It Melt | Herbal Weight Management",
    category: "Food Supplements",
    price: 599,
    imageUrl: "/products/vitality-capsules-alt.png",
    rating: 4.9,
  },
  {
    _id: "static-4",
    name: "Forever Vita 365 | Multivitamin & Probiotics",
    category: "Food Supplements",
    price: 549,
    imageUrl: "/products/vitamin-c-zinc.png",
    rating: 4.8,
  },
  {
    _id: "static-5",
    name: "Forever Shilajit Gold & Silver Resin | 100% Pure",
    category: "Food Supplements",
    price: 999,
    imageUrl: "/products/personal-care-alt.png",
    rating: 4.9,
  },
  {
    _id: "static-6",
    name: "Forever Let It Glow | Collagen Boosting Powder",
    category: "Personal Care",
    price: 799,
    imageUrl: "/products/personal-care.png",
    rating: 4.7,
  },
  {
    _id: "static-7",
    name: "Digital Blood Pressure Monitor | Smart Tech",
    category: "Healthcare Equipments",
    price: 1499,
    imageUrl: "/products/bp-monitor.png",
    rating: 4.8,
  },
  {
    _id: "static-8",
    name: "Fingertip Pulse Oximeter | Instant Reading",
    category: "Healthcare Equipments",
    price: 699,
    imageUrl: "/products/pulse-oximeter.png",
    rating: 4.9,
  },
  {
    _id: "static-9",
    name: "Digital Blood Glucose Meter Kit | Painless",
    category: "Healthcare Equipments",
    price: 999,
    imageUrl: "/products/glucose-meter.png",
    rating: 4.7,
  },
];

// Stable fake original price per product (not random each render)
const ORIG_PRICES: Record<string, number> = {
  "static-1": 799,
  "static-2": 899,
  "static-3": 1199,
  "static-4": 799,
  "static-5": 1999,
  "static-6": 1199,
  "static-7": 2499,
  "static-8": 1199,
  "static-9": 1599,
};

function getOriginalPrice(price: number, id: string) {
  if (ORIG_PRICES[id]) return ORIG_PRICES[id];
  const pct = 30 + ((price * 7) % 20); // deterministic based on price
  return Math.round(price * (1 + pct / 100));
}

export default function FeaturedProducts({ title = "Best Selling Products", limit, description, subtitle }: { title?: string, limit?: number, description?: string, subtitle?: string }) {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState<{ [key: string]: boolean }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  // Fetch products from database
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products?featured=true${limit ? `&limit=${limit}` : ""}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.success && json.data && json.data.length > 0) {
          let parsed = json.data.map((p: any) => ({
            ...p,
            originalPrice: p.mrp || p.originalPrice || getOriginalPrice(p.price || p.mrp, p._id),
            imageUrl: p.thumbnail || (p.images && p.images.length > 0 ? p.images[0].url : "/logo/logo.png"),
            rating: p.rating || 5,
            category: typeof p.category === 'object' ? (p.category?.name || "General") : (p.category || "General")
          }));
          if (limit && parsed.length > limit) {
            parsed = parsed.slice(0, limit);
          }
          setProducts(parsed);
        } else {
          setProducts(STATIC_PRODUCTS);
        }
      } catch {
        if (!cancelled) setProducts(STATIC_PRODUCTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    setLoading(true);
    load();
    return () => { cancelled = true; };
  }, [limit]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = 286; // approx card width + gap
      const scrollTo = direction === "left" ? scrollLeft - cardWidth * 2 : scrollLeft + cardWidth * 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Get current cart quantity for a product
  const getCartQty = (productId: string) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleIncrease = (product: Product) => {
    const qty = getCartQty(product._id);
    if (qty === 0) {
      addToCart(product);
    } else {
      updateQuantity(product._id, qty + 1);
    }
  };

  const handleDecrease = (product: Product) => {
    const qty = getCartQty(product._id);
    if (qty <= 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, qty - 1);
    }
  };

  const handleWishlist = (product: Product) => {
    useCartStore.getState().toggleWishlist(product);
    setWishlisted((prev) => ({ ...prev, [product._id]: !prev[product._id] }));
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm w-full">
      <div className="w-full aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2">
        <div className="h-3 skeleton w-16 rounded" />
        <div className="h-4 skeleton w-4/5 rounded" />
        <div className="h-4 skeleton w-3/5 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 skeleton flex-1 rounded-lg" />
          <div className="h-8 w-8 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col gap-1.5">
            {subtitle ? (
              <div className="flex flex-wrap items-center gap-2">
                {subtitle.split(',').map((tag, idx) => (
                  <span key={idx} className={`border px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${idx % 2 === 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  India's Trusted Wellness & Nutrition Brand
                </span>
                <span className="bg-blue-50 border border-blue-100 text-blue-600 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Trusted By 15 Lakh+ Consumers
                </span>
              </div>
            )}
            <h2 className="text-3xl font-extrabold font-heading text-slate-800 leading-tight">
              {title.split(' ').map((word, i, arr) =>
                i === arr.length - 1 ? <span key={i} className="gradient-text">{word}</span> : <span key={i}>{word} </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {description || "Science-Backed. Ayurveda-Inspired. Wellness Evolved — Naturally."}
            </p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            {/* Scroll Buttons */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 cursor-pointer"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100 cursor-pointer"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-primary hover:text-medical transition-colors flex items-center gap-1 group"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Container */}
        {loading ? (
          <div className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory pb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="snap-start shrink-0 w-[calc(100vw-3rem)] max-w-full sm:w-[270px] md:w-[280px] lg:w-[286px]">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory pb-6 scroll-smooth"
          >
            {products.map((product) => {
              const cartQty = getCartQty(product._id);
              // Ensure we pass the originalPrice properly
              const fullProduct = {
                ...product,
                originalPrice: product.originalPrice || getOriginalPrice(product.price, product._id)
              };

              return (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[calc(100vw-3rem)] max-w-full sm:w-[270px] md:w-[280px] lg:w-[286px]"
                >
                  <ProductCard
                    product={fullProduct}
                    cartQty={cartQty}
                    isWishlisted={!!wishlisted[product._id]}
                    onWishlistToggle={(e) => {
                      e.preventDefault();
                      handleWishlist(product);
                    }}
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
