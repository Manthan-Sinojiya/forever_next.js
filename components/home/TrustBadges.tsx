"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, ShieldCheck, Globe } from "lucide-react";

const trustPoints = [
  {
    title: "Cruelty Free",
    desc: "100% ethically sourced ingredients, never tested on animals.",
    icon: <Heart className="w-6 h-6" fill="currentColor" />,
    color: "from-rose-500/20 to-pink-500/5 text-rose-600 border-rose-100",
  },
  {
    title: "Eco Friendly",
    desc: "Sustainable manufacturing practices with minimal environmental impact.",
    icon: <Globe className="w-6 h-6" />,
    color: "from-blue-500/20 to-cyan-500/5 text-blue-600 border-blue-100",
  },
  {
    title: "Natural Ingredients",
    desc: "Formulated using purest herbs, roots, and botanicals from nature.",
    icon: <Leaf className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/5 text-emerald-600 border-emerald-100",
  },
  {
    title: "No Harsh Chemicals",
    desc: "Free from parabens, sulfates, toxins, and artificial fillers.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "from-amber-500/20 to-orange-500/5 text-amber-600 border-amber-100",
  },
];

export default function TrustBadges({ title, description }: { title?: string, description?: string }) {
  return (
    <section className="py-16 bg-[#F8FAFC] relative overflow-hidden border-t border-b border-slate-50">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-650 text-emerald-600 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-slate-800 leading-tight mt-4">
            {title ? (
              <span dangerouslySetInnerHTML={{ __html: title.replace(/Forever/g, '<span class="gradient-text font-black">Forever</span>').replace(/Health/g, '<span class="text-emerald-600">Health</span>') }} />
            ) : (
              <>Choose <span className="gradient-text font-black">Forever</span>, Choose <span className="text-emerald-600">Health</span>!</>
            )}
          </h2>
          <p className="text-sm text-slate-450 mt-2 font-semibold">
            {description || "We are dedicated to producing products of the highest safety and effectiveness."}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`bg-white rounded-3xl border p-6 hover:shadow-xl hover:shadow-slate-100/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center`}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-black text-slate-800 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
