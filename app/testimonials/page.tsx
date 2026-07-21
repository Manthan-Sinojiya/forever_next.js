"use client";

import { motion } from "framer-motion";
import { Star, Quote, ThumbsUp, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  review: string;
  product: string;
  date: string;
  verified: boolean;
  helpful: number;
}

const TESTIMONIALS: Testimonial[] = [
  { id: "1", name: "Priya Sharma", location: "Mumbai, Maharashtra", avatar: "P", rating: 5, title: "Ashwagandha changed my life!", review: "I had been struggling with chronic stress and poor sleep for years. After just 3 weeks of using Forever Healthcare's Ashwagandha extract, I noticed a massive improvement in my energy levels and sleep quality. The capsules are easy to swallow and have no bitter aftertaste. Highly recommend!", product: "Ashwagandha 500mg", date: "Jul 12, 2025", verified: true, helpful: 42 },
  { id: "2", name: "Rajesh Kumar", location: "Delhi, NCR", avatar: "R", rating: 5, title: "BP Monitor is incredibly accurate", review: "I've been using the digital BP monitor for 6 months now. It's extremely accurate — I compared it with my doctor's reading and the difference was negligible. The large display, memory storage for 60 readings, and the compact design make it perfect for daily home monitoring.", product: "Digital BP Monitor Pro", date: "Jul 5, 2025", verified: true, helpful: 38 },
  { id: "3", name: "Anjali Mehta", location: "Pune, Maharashtra", avatar: "A", rating: 5, title: "Best immunity combo pack!", review: "Ordered the immunity booster combo with Vitamin C, Zinc, and Elderberry. Within a month, I haven't had a single cold despite my family being sick. The packaging was great and delivery was super fast. Forever Healthcare is my go-to for all health supplements now.", product: "Immunity Booster Combo", date: "Jun 28, 2025", verified: true, helpful: 55 },
  { id: "4", name: "Suresh Patel", location: "Ahmedabad, Gujarat", avatar: "S", rating: 5, title: "Glucometer is a game changer for diabetics", review: "As a Type 2 diabetic, I rely on accurate glucose readings. This glucometer is fast (5 seconds), painless, and the strips are affordable. The memory holds 500 readings, which I can share with my doctor. Exceptional value for money. Strongly recommended for all diabetics.", product: "Digital Blood Glucose Meter", date: "Jun 20, 2025", verified: true, helpful: 61 },
  { id: "5", name: "Nisha Agarwal", location: "Bangalore, Karnataka", avatar: "N", rating: 4, title: "Turmeric capsules are genuine quality", review: "I've tried many turmeric supplements but these stand out for their purity. 95% curcumin content is rare to find at this price. I take two capsules daily with black pepper for better absorption. My joint pain has significantly reduced over 8 weeks. Great product!", product: "Organic Turmeric Curcumin", date: "Jul 1, 2025", verified: true, helpful: 29 },
  { id: "6", name: "Vikram Singh", location: "Jaipur, Rajasthan", avatar: "V", rating: 5, title: "Pulse oximeter — essential home device!", review: "Post-COVID, I monitor my oxygen levels daily. This pulse oximeter gives results in seconds, is battery-efficient, and the display is bright and easy to read even in sunlight. Bought it as a precaution but now the entire family uses it. Excellent quality at an honest price.", product: "Fingertip Pulse Oximeter", date: "Jul 8, 2025", verified: true, helpful: 47 },
];

const STATS = [
  { value: "15L+", label: "Happy Customers" },
  { value: "4.8★", label: "Average Rating" },
  { value: "98%", label: "Recommend Us" },
  { value: "50K+", label: "Reviews" },
];

export default function TestimonialsPage() {
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
            {TESTIMONIALS.map((t, i) => (
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
