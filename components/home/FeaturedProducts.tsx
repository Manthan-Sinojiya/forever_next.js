"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Heart, ArrowRight, Zap, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";

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
    name: "Pure Ashwagandha Extract 500mg",
    category: "Food Supplements",
    price: 20,
    imageUrl: "/products/ashwagandha.png",
    rating: 5,
  },
  {
    _id: "static-2",
    name: "Vitamin C & Zinc Immunity Boosters",
    category: "Food Supplements",
    price: 15,
    imageUrl: "/products/vitamin-c-zinc.png",
    rating: 4.8,
  },
  {
    _id: "static-3",
    name: "Digital Blood Pressure Monitor",
    category: "Healthcare Equipments",
    price: 46,
    imageUrl: "/products/bp-monitor.png",
    rating: 4.8,
  },
  {
    _id: "static-4",
    name: "Fingertip Pulse Oximeter",
    category: "Healthcare Equipments",
    price: 19,
    imageUrl: "/products/pulse-oximeter.png",
    rating: 4.9,
  },
  {
    _id: "static-5",
    name: "Men's Vitality Booster Capsules",
    category: "Men Health",
    price: 30,
    imageUrl: "/products/vitality-capsules.png",
    rating: 4.5,
  },
  {
    _id: "static-6",
    name: "Digital Blood Glucose Meter Kit",
    category: "Healthcare Equipments",
    price: 35,
    imageUrl: "/products/glucose-meter.png",
    rating: 4.7,
  },
  {
    _id: "static-7",
    name: "Orthopedic Knee Support Brace",
    category: "Orthopedic Care",
    price: 22,
    imageUrl: "/products/knee-support.png",
    rating: 4.6,
  },
  {
    _id: "static-8",
    name: "Infrared Forehead Thermometer",
    category: "Healthcare Equipments",
    price: 28,
    imageUrl: "/products/thermometer.png",
    rating: 4.9,
  },
  {
    _id: "static-9",
    name: "Premium First Aid Kit",
    category: "First Aid",
    price: 18,
    imageUrl: "/products/first-aid.png",
    rating: 4.8,
  },
];

// Stable fake original price per product (not random each render)
const ORIG_PRICES: Record<string, number> = {
  "static-1": 26,
  "static-2": 21,
  "static-3": 60,
  "static-4": 25,
  "static-5": 44,
  "static-6": 55,
  "static-7": 32,
  "static-8": 40,
  "static-9": 25,
};

function getOriginalPrice(price: number, id: string) {
  if (ORIG_PRICES[id]) return ORIG_PRICES[id];
  const pct = 30 + ((price * 7) % 20); // deterministic based on price
  return Math.round(price * (1 + pct / 100));
}

export default function FeaturedProducts() {
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
    setLoading(true);
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(STATIC_PRODUCTS);
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log("Failed to fetch products:", err);
        setProducts(STATIC_PRODUCTS);
        setLoading(false);
      });
  }, []);

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
    <section className="section-padding bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-gradient-to-b from-primary to-medical rounded-full" />
            <h2 className="text-xl font-bold font-heading text-foreground">
              Featured <span className="text-primary">Medical Products</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Scroll Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-650 transition-all border border-transparent hover:border-slate-100"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-650 transition-all border border-transparent hover:border-slate-100"
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
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth"
          >
            {products.map((product, index) => {
              const origPrice = product.originalPrice || getOriginalPrice(product.price, product._id);
              const discount = origPrice > product.price ? Math.round(((origPrice - product.price) / origPrice) * 100) : 0;
              const cartQty = getCartQty(product._id);
              const inCart = cartQty > 0;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="snap-start shrink-0 w-[200px] sm:w-[240px] md:w-[260px] lg:w-[270px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col"
                >
                  {/* Image area */}
                  <div className="relative aspect-[4/3] bg-light-gray overflow-hidden">
                    <Link href={`/products/${product._id}`} className="absolute inset-0 z-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </Link>

                    {/* Discount badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-danger text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                        -{discount}%
                      </div>
                    )}

                    {/* Wishlist button */}
                    <button
                      onClick={() => handleWishlist(product)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm z-10 ${
                        wishlisted[product._id]
                          ? "bg-danger text-white"
                          : "bg-white/90 backdrop-blur text-muted hover:text-danger"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-3.5 h-3.5" fill={wishlisted[product._id] ? "currentColor" : "none"} />
                    </button>

                    {/* Express badge */}
                    <div className="absolute bottom-2 left-2 bg-[#1E5AA8] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 z-10">
                      <Zap className="w-2.5 h-2.5" /> Express
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col">
                    {/* Category */}
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1 truncate">
                      {product.category}
                    </p>

                    {/* Name */}
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-xs font-bold text-foreground mb-2 line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${i < Math.floor(product.rating || 4) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted">({product.rating || 4}.0)</span>
                    </div>

                    {/* Price row */}
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="text-base font-extrabold text-foreground">₹{product.price.toFixed(0)}</span>
                      {origPrice > product.price && (
                        <span className="text-xs text-muted line-through">₹{origPrice.toFixed(0)}</span>
                      )}
                    </div>

                    {/* Add to cart / Quantity stepper */}
                    <div className="mt-auto">
                      {!inCart ? (
                        /* Initial Add to Cart button */
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 bg-primary/10 hover:bg-primary text-primary hover:text-white"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      ) : (
                        /* +/- Quantity stepper */
                        <div className="flex items-center justify-between gap-1">
                          <button
                            onClick={() => handleDecrease(product)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 font-bold transition-all active:scale-95 border border-red-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex-1 text-center">
                            <span className="text-sm font-extrabold text-foreground">{cartQty}</span>
                            <p className="text-[9px] text-muted leading-none">in cart</p>
                          </div>

                          <button
                            onClick={() => handleIncrease(product)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold transition-all active:scale-95 border border-emerald-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
