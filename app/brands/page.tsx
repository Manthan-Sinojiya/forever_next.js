"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Search, ExternalLink, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  productCount?: number;
  featured?: boolean;
  website?: string;
  categories?: string[];
}

const FALLBACK_BRANDS: Brand[] = [
  { _id: "1", name: "Forever Healthcare", description: "Premium Ayurveda & wellness brand", logo: "/logo/logo.png", productCount: 45, featured: true, categories: ["Ayurveda", "Nutrition", "Personal Care"] },
  { _id: "2", name: "Himalaya", description: "Trusted herbal healthcare for 90+ years", productCount: 38, featured: true, categories: ["Ayurveda", "Skin Care", "Hair Care"] },
  { _id: "3", name: "Dabur", description: "India's largest Ayurvedic company", productCount: 62, featured: true, categories: ["Ayurveda", "Healthcare", "Nutrition"] },
  { _id: "4", name: "Patanjali", description: "Natural & organic wellness products", productCount: 55, featured: false, categories: ["Ayurveda", "Nutrition", "Personal Care"] },
  { _id: "5", name: "Dr. Morepen", description: "Quality healthcare equipment", productCount: 29, featured: false, categories: ["Healthcare Equipment", "Diagnostics"] },
  { _id: "6", name: "Baidyanath", description: "Classical Ayurveda since 1917", productCount: 41, featured: true, categories: ["Ayurveda", "Immunity"] },
  { _id: "7", name: "Sandu Brothers", description: "Authentic Ayurvedic formulations", productCount: 22, featured: false, categories: ["Ayurveda"] },
  { _id: "8", name: "Kapiva", description: "Modern Ayurveda for everyday wellness", productCount: 35, featured: true, categories: ["Ayurveda", "Nutrition"] },
];

const BRAND_COLORS = [
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-orange-400 to-red-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-600",
  "from-amber-400 to-orange-500",
  "from-lime-400 to-emerald-500",
];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS);
  const [search, setSearch] = useState("");
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((j) => { if (j.success && j.data?.length) setBrands(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  const featured = filtered.filter((b) => b.featured);
  const rest = filtered.filter((b) => !b.featured);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-14">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">Our Trusted Brands</h1>
              <p className="text-white/80 max-w-xl mx-auto text-sm">
                Discover products from India&apos;s most trusted healthcare & Ayurveda brands
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Search */}
          <div className="max-w-lg mx-auto mb-10 relative">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..." 
              className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 text-sm font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>

          {/* Featured Brands */}
          {featured.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-2xl font-bold font-heading text-slate-800">Featured Brands</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featured.map((brand, i) => (
                  <motion.div key={brand._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <Link href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                      className="block bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                      {/* Logo/Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${BRAND_COLORS[i % BRAND_COLORS.length]} flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                        {brand.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <span className="text-white font-bold text-xl">{brand.name[0]}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-center mb-1 group-hover:text-emerald-700 transition-colors">{brand.name}</h3>
                      <p className="text-slate-500 text-xs text-center mb-3 line-clamp-2">{brand.description}</p>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">
                          <Package className="w-3 h-3" />{brand.productCount || 0} Products
                        </span>
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full">Featured</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* All Brands */}
          {rest.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-heading text-slate-800 mb-6">All Brands</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rest.map((brand, i) => (
                  <motion.div key={brand._id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                    <Link href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                      className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${BRAND_COLORS[(i + 4) % BRAND_COLORS.length]} flex items-center justify-center mb-2`}>
                        <span className="text-white font-bold text-lg">{brand.name[0]}</span>
                      </div>
                      <p className="font-bold text-slate-700 text-xs leading-tight group-hover:text-emerald-700 transition-colors">{brand.name}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{brand.productCount || 0} items</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-700 mb-1">No brands found</p>
              <p className="text-slate-400 text-sm">Try a different search term</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 bg-gradient-to-r from-[#1E5AA8]/5 to-[#43B97F]/5 rounded-3xl p-8 text-center border border-emerald-100/50">
            <h2 className="font-bold text-slate-800 text-xl mb-2">Want to be listed?</h2>
            <p className="text-slate-500 text-sm mb-4">Partner with Forever Healthcare to reach millions of health-conscious customers.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold hover:opacity-90 transition-all text-sm">
              <ExternalLink className="w-4 h-4" />Become a Partner
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
