"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, X, Plus, Star, ShoppingCart, CheckCircle2, XCircle, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  description: string;
}

const COMPARE_FIELDS = [
  { label: "Price", key: "price" },
  { label: "Category", key: "category" },
  { label: "Rating", key: "rating" },
  { label: "Availability", key: "inStock" },
  { label: "Description", key: "description" },
];

export default function ComparePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((j) => { if (j.success) setAllProducts(j.data); })
      .catch(console.error);
  }, []);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) return;
    if (compareList.some((p) => p._id === product._id)) return;
    setCompareList([...compareList, product]);
    setShowSearch(false);
    setSearch("");
  };

  const removeFromCompare = (id: string) => setCompareList(compareList.filter((p) => p._id !== id));

  const filteredSearch = allProducts
    .filter((p) => !compareList.some((c) => c._id === p._id))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 8);

  const renderValue = (product: Product, key: string) => {
    switch (key) {
      case "price":
        return (
          <div>
            <span className="font-bold text-slate-800 text-lg">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-slate-400 line-through text-xs ml-2">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-600">{product.rating || "4.5"}</span>
          </div>
        );
      case "inStock":
        return product.inStock ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />In Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-red-500 font-bold text-sm">
            <XCircle className="w-4 h-4" />Out of Stock
          </span>
        );
      case "description":
        return <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{product.description || "Premium quality product from Forever Healthcare."}</p>;
      default:
        return <span className="text-slate-700 text-sm font-medium">{(product as unknown as Record<string, string>)[key]}</span>;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <Scale className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Compare Products</h1>
            <p className="text-white/80 text-sm">Add up to 4 products to compare side by side</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Add Product Button */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="text-sm font-bold text-slate-600">{compareList.length} of 4 products selected</p>
            <div className="relative">
              <button onClick={() => setShowSearch(!showSearch)} disabled={compareList.length >= 4}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-md">
                <Plus className="w-4 h-4" />Add Product
              </button>
              {showSearch && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
                  <div className="relative mb-3">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..." autoFocus
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-emerald-500/40" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredSearch.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-4">No products found</p>
                    ) : filteredSearch.map((p) => (
                      <button key={p._id} onClick={() => addToCompare(p)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl text-left transition-all">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-xs line-clamp-1">{p.name}</p>
                          <p className="text-emerald-600 font-bold text-xs">₹{p.price.toLocaleString("en-IN")}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {compareList.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
              <Scale className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="font-bold text-slate-800 text-xl mb-2">No Products Selected</h2>
              <p className="text-slate-500 text-sm mb-6">Add products to start comparing their features side by side.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold hover:opacity-90 transition-all">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Product Header Cards */}
                <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
                  <div />
                  {compareList.map((product) => (
                    <motion.div key={product._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm text-center relative">
                      <button onClick={() => removeFromCompare(product._id)}
                        className="absolute top-3 right-3 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-slate-50 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/products/ashwagandha.png"; }} />
                      </div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-3">{product.name}</h3>
                      <button onClick={() => addToCart(product)}
                        className="w-full py-2 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5" />Add to Cart
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Rows */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {COMPARE_FIELDS.map((field, idx) => (
                    <div key={field.key}
                      className={`grid items-start gap-4 p-5 ${idx !== COMPARE_FIELDS.length - 1 ? "border-b border-gray-100" : ""} ${idx % 2 === 0 ? "" : "bg-slate-50/50"}`}
                      style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
                      <div className="font-bold text-slate-600 text-sm pt-1">{field.label}</div>
                      {compareList.map((product) => (
                        <div key={product._id}>{renderValue(product, field.key)}</div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Add to Cart row */}
                <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
                  <div />
                  {compareList.map((product) => (
                    <button key={product._id} onClick={() => addToCart(product)}
                      className="py-3 bg-gradient-to-r from-[#0D623F] to-emerald-600 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />Buy Now
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
