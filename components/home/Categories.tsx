"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, HeartPulse, Activity, Sparkles, ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Food Supplements",
    description: "Vitamins, minerals & nutritional support for everyday vitality",
    icon: <Leaf className="w-7 h-7" />,
    color: "from-emerald-500 to-green-400",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    count: "120+ Products",
  },
  {
    title: "Healthcare Equipments",
    description: "Smart medical devices & health monitoring equipment",
    icon: <Activity className="w-7 h-7" />,
    color: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    count: "80+ Products",
  },
  {
    title: "Men Health",
    description: "Vitality, energy & wellness products for men",
    icon: <HeartPulse className="w-7 h-7" />,
    color: "from-rose-500 to-pink-400",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
    count: "95+ Products",
  },
  {
    title: "Personal Care",
    description: "Premium hygiene, grooming & beauty essentials",
    icon: <Sparkles className="w-7 h-7" />,
    color: "from-violet-500 to-purple-400",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
    count: "150+ Products",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Categories() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/10 text-primary text-sm font-semibold mb-5"
          >
            <Sparkles className="w-4 h-4 text-medical" />
            Explore Categories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-foreground mb-4"
          >
            Recharge. Refresh. <span className="gradient-text">Restart.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-xl mx-auto"
          >
            Browse our curated categories to find exactly what your body needs.
          </motion.p>
        </div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link
                href={`/categories/${category.title.toLowerCase().replace(/ /g, "-")}`}
                className="group block"
              >
                <div className="relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm card-hover overflow-hidden h-full">
                  {/* Hover gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${category.bgLight} ${category.textColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold font-heading text-foreground mb-2 flex items-center gap-2">
                    {category.title}
                    <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {category.description}
                  </p>

                  {/* Count badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${category.bgLight} ${category.textColor}`}
                  >
                    {category.count}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
