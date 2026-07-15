"use client";

import { motion, useInView } from "framer-motion";
import { Users, Package, Award, TrendingUp } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / 120;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  {
    icon: <Users className="w-5 h-5" />,
    value: 15000,
    suffix: "+",
    label: "Happy Customers",
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: <Package className="w-5 h-5" />,
    value: 25000,
    suffix: "+",
    label: "Orders Delivered",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: <Award className="w-5 h-5" />,
    value: 15,
    suffix: "+",
    label: "Years Experience",
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    value: 500,
    suffix: "+",
    label: "Products Available",
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

export default function Stats() {
  return (
    <section className="py-12 bg-gradient-to-r from-[#EAF8F2] via-[#F4FBF7] to-[#EAF8F2] relative overflow-hidden border-y border-emerald-100/50">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(30,90,168,0.02),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3.5 border ${stat.color} shadow-sm`}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold font-heading text-slate-800 mb-1">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
