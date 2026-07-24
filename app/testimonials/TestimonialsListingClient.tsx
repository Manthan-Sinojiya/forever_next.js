"use client";

import { motion } from "framer-motion";
import { Star, Quote, ThumbsUp, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const STATS = [
  { value: "15L+", label: "Happy Customers" },
  { value: "4.8★", label: "Average Rating" },
  { value: "98%", label: "Recommend Us" },
  { value: "50K+", label: "Reviews" },
];

export default function TestimonialsListingClient({ initialTestimonials }: { initialTestimonials: any[] }) {
  // If db is empty, fallback to 1 static so it doesn't look broken
  const displayTestimonials = initialTestimonials.length > 0 ? initialTestimonials.map(t => ({
    id: t._id,
    name: t.customerName,
    location: t.designation || "India",
    avatar: t.customerName ? t.customerName.charAt(0).toUpperCase() : "U",
    rating: t.rating || 5,
    title: t.review.substring(0, 30) + '...',
    review: t.review,
    product: "Healthcare Product",
    date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    verified: true,
    helpful: Math.floor(Math.random() * 50) + 10
  })) : [
    { id: "1", name: "Sarah Jenkins", location: "Mumbai", avatar: "S", rating: 5, title: "Great!", review: "Forever Healthcare has completely changed how I manage my family's wellness.", product: "Ayurveda", date: "Jul 12, 2026", verified: true, helpful: 42 }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-7 h-7 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-3">Customer Stories</h1>
            <p className="text-white/80 max-w-xl mx-auto text-sm">
              Real results from 15 lakh+ customers who trust Forever Healthcare for their wellness journey
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {STATS.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <p className="text-3xl font-black font-heading text-slate-800">{stat.value}</p>
                  <p className="text-slate-500 text-sm font-semibold mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Rating Overview */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="text-center">
                <p className="text-7xl font-black text-slate-800 leading-none">4.8</p>
                <div className="flex justify-center my-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-500 text-sm font-semibold">50,000+ reviews</p>
              </div>
              <div className="flex-1 space-y-2.5 w-full">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = [72, 18, 6, 2, 2][5 - stars];
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 w-5">{stars}★</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-amber-400 rounded-full"
                          initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: (5 - stars) * 0.1 }} viewport={{ once: true }} />
                      </div>
                      <span className="text-xs text-slate-500 font-bold w-8">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {displayTestimonials.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-emerald-100 fill-emerald-100 mb-3" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>

                <h3 className="font-bold text-slate-800 mb-2">&ldquo;{t.title}&rdquo;</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{t.review}</p>

                {/* Product tag */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">
                    Purchased: {t.product}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        {t.name}
                        {t.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />}
                      </p>
                      <p className="text-xs text-slate-400">{t.location} · {t.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
                      <ThumbsUp className="w-3.5 h-3.5" />{t.helpful}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">Join 15 Lakh+ Happy Customers</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm">
              Experience premium healthcare products backed by Ayurveda and modern science.
            </p>
            <Link href="/shop"
              className="inline-flex items-center gap-2 bg-white text-[#1E5AA8] px-8 py-3.5 rounded-full font-bold hover:bg-white/90 transition-all shadow-lg">
              <Star className="w-4 h-4" />Shop Now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
