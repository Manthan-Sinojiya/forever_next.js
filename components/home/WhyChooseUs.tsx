"use client";

import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const reasons = [
  {
    emoji: "🏅",
    title: "Quality Assurance",
    subtitle: "ISO Certified",
    subtitleColor: "text-[#FF6B35]",
    description: "All products sourced from trusted, certified manufacturers only.",
    bg: "bg-orange-50",
  },
  {
    emoji: "🛒",
    title: "Wide Range",
    subtitle: "500+ Products",
    subtitleColor: "text-[#1E5AA8]",
    description: "From Ayurvedic medicines to health supplements, we have it all.",
    bg: "bg-blue-50",
  },
  {
    emoji: "👥",
    title: "Customer First",
    subtitle: "15K+ Happy Customers",
    subtitleColor: "text-[#43B97F]",
    description: "Our customers are our top priority. We strive to exceed expectations.",
    bg: "bg-emerald-50",
  },
];

const quickActions = [
  { emoji: "🏪", title: "Sell on Forever", sub: "Become a seller today", href: "/contact" },
  { emoji: "📦", title: "Track Your Order", sub: "Real-time order status", href: "/dashboard" },
  { emoji: "📋", title: "Dashboard", sub: "Upload & order online", href: "/dashboard" },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50">
            <h2 className="text-lg font-bold font-heading text-foreground">Why Choose Us?</h2>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-400 opacity-60"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground ml-1">4.8/5</span>
              <span className="text-sm text-muted">· 1M+ reviews</span>
            </div>
          </div>

          {/* Three reason columns */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-6 py-5 group hover:bg-gray-50/60 transition-colors"
              >
                {/* Icon + title + subtitle row */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-12 h-12 ${reason.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {reason.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground leading-tight">{reason.title}</h3>
                    <p className={`text-sm font-bold ${reason.subtitleColor}`}>{reason.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-light-gray rounded-xl flex items-center justify-center text-xl group-hover:bg-primary/10 transition-colors">
                    {action.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{action.title}</p>
                    <p className="text-xs text-primary font-medium">{action.sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
