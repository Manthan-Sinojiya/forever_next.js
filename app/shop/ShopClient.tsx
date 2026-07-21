"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, Search, ArrowUpDown, LayoutGrid,
  List, ChevronLeft, ChevronRight, Filter, Star, RefreshCw
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { useCartStore } from "@/lib/store";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
}

const ITEMS_PER_PAGE = 12;

const CATEGORY_ICONS: Record<string, string> = {
  "Nutrition": "🌿",
  "Healthcare Equipment": "🏥",
  "Personal Care": "✨",
  "Ayurveda": "🌱",
  "Immunity": "🛡️",
  "Diabetes Care": "💉",
  "Heart Care": "❤️",
  "Skin Care": "🌸",
  "Hair Care": "💆",
  "Weight Management": "⚖️",
};

export default function ShopClient({ presetCategory = "", presetQuery = "" }: { presetCategory?: string; presetQuery?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(presetQuery);
  const [selectedCategory, setSelectedCategory] = useState(presetCategory || "All");
  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const wishlist = useCartStore((s) => s.wishlist || []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?all=true");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setProducts(json.data);
            const prices = json.data.map((p: Product) => p.price);
            if (prices.length) setMaxPrice(Math.ceil(Math.max(...prices)));
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (presetCategory) setSelectedCategory(presetCategory);
  }, [presetCategory]);

  useEffect(() => {
    if (presetQuery) setSearchVal(presetQuery);
  }, [presetQuery]);

  const categories = useMemo(() => {
    const list = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchVal.trim()) {
          const s = searchVal.toLowerCase();
          if (!p.name.toLowerCase().includes(s) && !p.description?.toLowerCase().includes(s) && !p.category.toLowerCase().includes(s)) return false;
        }
        if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        if (p.price < minPrice || p.price > maxPrice) return false;
        if (minRating > 0 && (p.rating || 4.5) < minRating) return false;
        if (inStockOnly && !p.inStock) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "discount") {
          const aDisc = a.originalPrice ? a.originalPrice - a.price : 0;
          const bDisc = b.originalPrice ? b.originalPrice - b.price : 0;
          return bDisc - aDisc;
        }
        if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return 0;
      });
  }, [products, searchVal, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleReset = useCallback(() => {
    setSearchVal("");
    setSelectedCategory(presetCategory || "All");
    setSortBy("default");
    setMinPrice(0);
    setMinRating(0);
    setInStockOnly(false);
    setPage(1);
  }, [presetCategory]);

  const getCartQty = (id: string) => cart.find((i) => i._id === id)?.quantity || 0;
  const isWished = (id: string) => wishlist.some((i) => i._id === id);

  const activeFiltersCount = [
    searchVal.trim() ? 1 : 0,
    selectedCategory !== "All" ? 1 : 0,
    minPrice > 0 ? 1 : 0,
    minRating > 0 ? 1 : 0,
    inStockOnly ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const FilterSidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`space-y-6 ${mobile ? "" : "sticky top-32"}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="font-heading font-bold text-slate-800 text-base flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFiltersCount}</span>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <button onClick={handleReset} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Search</label>
        <div className="relative">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => { setSearchVal(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-emerald-600/30 text-xs font-medium outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          {searchVal && (
            <button onClick={() => setSearchVal("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
        <div className={`space-y-1 ${mobile ? "max-h-48" : "max-h-64"} overflow-y-auto pr-1 scrollbar-hide`}>
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="flex items-center gap-1.5">
                  {cat !== "All" && <span>{CATEGORY_ICONS[cat] || "🌿"}</span>}
                  <span className="truncate">{cat}</span>
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Price Range</label>
          <span className="text-xs font-extrabold text-emerald-600">₹{minPrice} – ₹{maxPrice}</span>
        </div>
        <input type="range" min="0" max="5000" step="50" value={maxPrice}
          onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
          <span>₹0</span><span>₹5000+</span>
        </div>
      </div>

      {/* Min Rating */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Min Rating</label>
        <div className="flex gap-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => { setMinRating(r); setPage(1); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${minRating === r ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
              {r === 0 ? "All" : (
                <span className="flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{r}+
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
        <label className="text-xs font-semibold text-slate-700">In Stock Only</label>
        <button
          onClick={() => { setInStockOnly(!inStockOnly); setPage(1); }}
          className={`w-10 h-5 rounded-full transition-all relative ${inStockOnly ? "bg-emerald-500" : "bg-slate-200"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inStockOnly ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-8 skeleton rounded-xl" />)}
          </div>
        </aside>
        <section className="flex-1">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm">
                <div className="aspect-square rounded-2xl mb-4 skeleton" />
                <div className="h-3 w-20 skeleton mb-2" />
                <div className="h-4 w-full skeleton mb-2" />
                <div className="h-4 w-2/3 skeleton mb-4" />
                <div className="h-9 w-full skeleton rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            {FilterSidebar({})}
          </div>
        </aside>

        {/* Products Area */}
        <section className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <button onClick={() => setShowMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filters {activeFiltersCount > 0 && <span className="bg-emerald-600 text-white text-[9px] px-1 rounded-full">{activeFiltersCount}</span>}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer">
                  <option value="default">Default</option>
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="name-asc">A → Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchVal && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                  &ldquo;{searchVal}&rdquo;
                  <button onClick={() => setSearchVal("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                  In Stock
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
                  ⭐ {minRating}+
                  <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid/List */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold font-heading text-slate-800 mb-2">No products found</h2>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query.</p>
              <button onClick={handleReset} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
                Clear All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <motion.div layout className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    cartQty={getCartQty(product._id)}
                    isWishlisted={isWished(product._id)}
                    onWishlistToggle={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                    onAddToCart={() => addToCart(product)}
                    onIncreaseQty={() => updateQuantity(product._id, getCartQty(product._id) + 1)}
                    onDecreaseQty={() => updateQuantity(product._id, getCartQty(product._id) - 1)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {paginatedProducts.map((product) => {
                const qty = getCartQty(product._id);
                const discount = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                return (
                  <motion.div key={product._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-slate-50 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      {discount > 0 && (
                        <span className="absolute top-1 left-1 bg-[#C25115] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{discount}% OFF</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-slate-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-slate-400 line-through text-xs">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-3 py-1.5">
                          <button onClick={() => updateQuantity(product._id, qty - 1)} className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm">−</button>
                          <span className="text-sm font-bold text-emerald-700 min-w-[16px] text-center">{qty}</span>
                          <button onClick={() => updateQuantity(product._id, qty + 1)} className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(product)}
                          className="bg-[#0D623F] hover:bg-emerald-800 text-white px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap">
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${p === page ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "border border-gray-200 text-slate-600 hover:bg-slate-50"}`}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 p-6 shadow-2xl flex flex-col gap-6 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-slate-800">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {FilterSidebar({ mobile: true })}
              <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
                <button onClick={handleReset} className="py-3 bg-slate-100 rounded-xl text-slate-700 font-bold text-sm">Reset</button>
                <button onClick={() => setShowMobileFilters(false)} className="py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm">Apply</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
