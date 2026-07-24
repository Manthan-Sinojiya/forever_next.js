"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, HeartPulse, Activity, Sparkles, Heart, Flame } from "lucide-react";

const categories = [
  {
    title: "Food Supplements",
    slug: "food-supplements",
    icon: <Leaf className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50 text-emerald-600 border-emerald-100",
    shadow: "shadow-emerald-100/50",
  },
  {
    title: "Healthcare Equipments",
    slug: "healthcare-equipments",
    icon: <Activity className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-500",
    bgLight: "bg-blue-50 text-blue-600 border-blue-100",
    shadow: "shadow-blue-100/50",
  },
  {
    title: "Men Health",
    slug: "men-health",
    icon: <HeartPulse className="w-6 h-6" />,
    color: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50 text-rose-600 border-rose-100",
    shadow: "shadow-rose-100/50",
  },
  {
    title: "Personal Care",
    slug: "personal-care",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50 text-amber-600 border-amber-100",
    shadow: "shadow-amber-100/50",
  },
  {
    title: "Orthopedic Care",
    slug: "orthopedic-care",
    icon: <Flame className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50 text-violet-600 border-violet-100",
    shadow: "shadow-violet-100/50",
  },
  {
    title: "First Aid",
    slug: "first-aid",
    icon: <Heart className="w-6 h-6" />,
    color: "from-red-500 to-rose-600",
    bgLight: "bg-red-50 text-red-600 border-red-100",
    shadow: "shadow-red-100/50",
  },
];

export default function CategoryCircles() {
  return (
    <section className="py-8 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-emerald-600 rounded-full" />
          <h2 className="text-base font-extrabold font-heading text-slate-800 tracking-tight">
            Shop By Category
          </h2>
        </div>

        {/* Circles list */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 justify-center">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center"
              >
                {/* Circle Container */}
                <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full border flex items-center justify-center ${category.bgLight} ${category.shadow} group-hover:scale-105 group-hover:shadow-md transition-all duration-300 relative`}>
                  {/* Decorative outer ring */}
                  <div className="absolute inset-[-4px] rounded-full border border-transparent group-hover:border-emerald-600/30 group-hover:scale-105 transition-all duration-300" />
                  
                  {/* Inner Icon */}
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </div>
                </div>

                {/* Text Label */}
                <span className="mt-3 text-xs sm:text-sm font-extrabold font-heading text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2 text-center max-w-[110px]">
                  {category.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
