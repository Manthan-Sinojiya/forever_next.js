"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  SlidersHorizontal,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import { useCartStore } from "@/lib/store";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
}

interface ProductsGridClientProps {
  initialProducts: Product[];
  presetCategory?: string;
  presetQuery?: string;
}

export default function ProductsGridClient({
  initialProducts,
  presetCategory,
  presetQuery,
}: ProductsGridClientProps) {
  const [mounted, setMounted] = useState(false);
  const [searchVal, setSearchVal] = useState(presetQuery || "");
  const [selectedCategory, setSelectedCategory] = useState(presetCategory || "All");
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state when props change (especially preset category/query)
  useEffect(() => {
    if (presetCategory) setSelectedCategory(presetCategory);
  }, [presetCategory]);

  useEffect(() => {
    if (presetQuery) setSearchVal(presetQuery);
  }, [presetQuery]);

  // Determine max price from products
  const maxProductPrice = useMemo(() => {
    if (initialProducts.length === 0) return 2000;
    return Math.ceil(Math.max(...initialProducts.map((p) => p.price)));
  }, [initialProducts]);

  const [maxPriceFilter, setMaxPriceFilter] = useState(maxProductPrice);

  // Update maxPriceFilter if products list changes or max price shifts
  useEffect(() => {
    setMaxPriceFilter(maxProductPrice);
  }, [maxProductPrice]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cart / Wishlist state from Zustand
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist || []);

  const getCartQty = (productId: string) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  const handleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Unique categories list dynamically extracted from products
  const categories = useMemo(() => {
    const list = new Set(initialProducts.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [initialProducts]);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialProducts.length };
    initialProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search filter
        if (searchVal.trim()) {
          const s = searchVal.toLowerCase();
          const nameMatch = product.name.toLowerCase().includes(s);
          const descMatch = (product.description || "").toLowerCase().includes(s);
          const catMatch = product.category.toLowerCase().includes(s);
          if (!nameMatch && !descMatch && !catMatch) return false;
        }

        // Category filter
        if (selectedCategory !== "All") {
          if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Price filter
        if (product.price > maxPriceFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0; // default/unsorted
      });
  }, [initialProducts, searchVal, selectedCategory, maxPriceFilter, sortBy]);

  // Get original price for visual discount
  const getOriginalPrice = (price: number, id: string) => {
    const pct = 25 + ((price * 7) % 15); // deterministic based on price (25% to 40% markup)
    return Math.round(price * (1 + pct / 100));
  };

  const handleResetFilters = () => {
    setSearchVal("");
    setSelectedCategory(presetCategory || "All");
    setMaxPriceFilter(maxProductPrice);
    setSortBy("default");
  };

  if (!mounted) {
    return (
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="h-6 w-24 skeleton" />
              <div className="space-y-3">
                <div className="h-3 w-16 skeleton" />
                <div className="h-9 w-full skeleton" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 skeleton" />
                <div className="space-y-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 w-full skeleton" />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-20 skeleton" />
                <div className="h-2 w-full skeleton" />
              </div>
            </div>
          </aside>

          {/* Main Grid Skeleton */}
          <section className="flex-1">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="h-4 w-32 skeleton" />
              <div className="h-8 w-40 skeleton" />
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col">
                  <div className="w-full aspect-square rounded-2xl mb-4 skeleton" />
                  <div className="h-3.5 w-16 skeleton mb-3" />
                  <div className="h-4 w-4/5 skeleton mb-2" />
                  <div className="h-4 w-2/3 skeleton mb-4" />
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="h-6 w-16 skeleton" />
                    <div className="h-9 w-24 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ── DESKTOP FILTER SIDEBAR ── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-32 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Filters
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Live Search */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-650 text-slate-500 uppercase tracking-wider">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Type to filter..."
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-600/30 text-xs font-medium outline-none transition-all"
                />
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                {searchVal && (
                  <button
                    onClick={() => setSearchVal("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Categories
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? "bg-emerald-200/50 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Price Limit
                </label>
                <span className="text-xs font-extrabold text-emerald-600">₹{maxPriceFilter}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxProductPrice}
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-650 accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>₹0</span>
                <span>₹{maxProductPrice}</span>
              </div>
            </div>

          </div>
        </aside>

        {/* ── PRODUCTS AREA ── */}
        <section className="flex-1">
          
          {/* Top Bar / Sort Controls */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <span className="text-sm font-bold text-slate-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </span>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-transparent rounded-xl px-3 py-2 text-xs font-semibold text-slate-755 text-slate-750 text-slate-700 outline-none focus:bg-white focus:border-emerald-600/30 transition-all cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Grid list */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold font-heading text-slate-800 mb-2">
                No products match filters
              </h2>
              <p className="text-muted text-sm mb-6 max-w-md mx-auto">
                Try loosening your category checks, adjusting your price limit, or clearing the search text to find what you need.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-emerald-655 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => {
                  const cartQty = getCartQty(product._id);
                  const inCart = cartQty > 0;
                  const isWish = isInWishlist(product._id);
                  const origPrice = getOriginalPrice(product.price, product._id);
                  const discount = Math.round(((origPrice - product.price) / origPrice) * 100);

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex flex-col relative"
                    >
                      <Link href={`/products/${product._id}`} className="flex flex-col flex-1 cursor-pointer">
                        {/* Image container */}
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50 border border-slate-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-emerald-650 text-emerald-600 shadow-sm border border-slate-100 truncate max-w-[130px]">
                            {product.category}
                          </div>

                          {discount > 0 && (
                            <div className="absolute bottom-2.5 left-2.5 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                              -{discount}%
                            </div>
                          )}

                          {/* Wishlist toggle */}
                          <button
                            onClick={(e) => handleWishlist(e, product)}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                              isWish
                                ? "bg-red-500 text-white"
                                : "bg-white/95 backdrop-blur-sm text-slate-400 hover:text-red-500"
                            }`}
                            aria-label="Toggle Wishlist"
                          >
                            <Heart className="w-4 h-4" fill={isWish ? "currentColor" : "none"} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="px-1 flex-1 flex flex-col">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating || 5)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-[10px] font-bold text-slate-500 ml-1">
                              ({product.rating || 5}.0)
                            </span>
                          </div>

                          {/* Product Title */}
                          <h3 className="text-sm font-bold font-heading text-slate-800 mb-2 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>

                          {/* Price Area */}
                          <div className="flex items-baseline gap-1.5 mt-auto mb-4">
                            <span className="text-lg font-black text-slate-855 text-slate-900 font-heading">
                              ₹{product.price.toFixed(0)}
                            </span>
                            {origPrice > product.price && (
                              <span className="text-xs text-slate-400 line-through font-medium">
                                ₹{origPrice.toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Cart buttons */}
                      <div className="mt-auto">
                        {!inCart ? (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full py-2.5 bg-emerald-60 hover:bg-emerald-600 bg-emerald-50 hover:text-white text-emerald-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-emerald-100"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex items-center justify-between gap-1">
                            <button
                              onClick={() => updateQuantity(product._id, cartQty - 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 font-bold transition-all active:scale-95 border border-red-100"
                              aria-label="Decrease quantity"
                            >
                              {cartQty <= 1 ? (
                                <Minus className="w-3.5 h-3.5" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <div className="flex-1 text-center">
                              <span className="text-xs font-extrabold text-slate-800">{cartQty}</span>
                              <p className="text-[8px] text-slate-405 text-slate-400 leading-none">in cart</p>
                            </div>

                            <button
                              onClick={() => updateQuantity(product._id, cartQty + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold transition-all active:scale-95 border border-emerald-100"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

        </section>
      </div>

      {/* ── MOBILE FILTER DRAWER/MODAL ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 p-6 shadow-2xl flex flex-col gap-6 lg:hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="font-heading font-bold text-slate-800 text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-600/30 text-xs font-medium outline-none transition-all"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2.5 flex-1 overflow-hidden flex flex-col">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Categories
                </label>
                <div className="space-y-1 overflow-y-auto pr-1 flex-1">
                  {categories.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 shrink-0">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Price Limit
                  </label>
                  <span className="text-xs font-extrabold text-emerald-650 text-emerald-600">₹{maxPriceFilter}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxProductPrice}
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0 pt-4 border-t border-slate-100">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
