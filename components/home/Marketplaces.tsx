"use client";

import { motion } from "framer-motion";

const marketplaces = [
  {
    name: "Amazon",
    logoColor: "text-slate-900",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    badgeText: "Best Seller",
    badgeColor: "bg-amber-500 text-slate-950",
    svg: (
      <svg className="w-20 h-6 fill-current" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.2 18.2c-.4 1.1-.9 1.7-1.6 1.7-.5 0-.7-.4-.7-.9v-5.2c0-2-1.3-3-3.2-3-1.6 0-3 .9-3.4 2.1-.2.4-.1.7.3.7.3-.1.6-.2.9-.2 1 0 1.5.5 1.5 1.4v.3c-2.9.2-4.8 1.1-4.8 3.1 0 1.7 1.2 2.7 2.9 2.7 1.6 0 2.7-.8 3.1-1.9.1-.3.4-.3.5 0 .5.8 1.4 1.2 2.5 1.2 1.3 0 2.2-.7 2.7-1.9.2-.4-.2-.7-.5-.4zm-5.7.8c-.8 0-1.5-.4-1.5-1.2 0-.8.7-1.2 1.9-1.3.8 0 1.4.1 1.8.3v.9c-.3.8-1.2 1.3-2.2 1.3zm12.5-7.3c-1.3 0-2.3.6-2.8 1.5-.1.3-.3.3-.4 0v-1.1c0-.3-.2-.5-.5-.5h-1.8c-.3 0-.5.2-.5.5v9.1c0 .3.2.5.5.5h1.9c.3 0 .5-.2.5-.5v-4.9c0-1 .7-1.8 1.7-1.8.9 0 1.4.5 1.4 1.5v5.2c0 .3.2.5.5.5h1.9c.3 0 .5-.2.5-.5v-5.7c0-2.1-1.3-3.9-3.8-3.9zm9.2 0c-2.4 0-4.3 1.8-4.3 4.4s1.9 4.4 4.3 4.4 4.3-1.8 4.3-4.4-1.9-4.4-4.3-4.4zm0 6.6c-1.2 0-2.1-.9-2.1-2.2s.9-2.2 2.1-2.2 2.1.9 2.1 2.2-.9 2.2-2.1 2.2zm12.6-6.6c-1.3 0-2.3.6-2.8 1.5-.1.3-.3.3-.4 0v-1.1c0-.3-.2-.5-.5-.5h-1.8c-.3 0-.5.2-.5.5v9.1c0 .3.2.5.5.5h1.9c.3 0 .5-.2.5-.5v-4.9c0-1 .7-1.8 1.7-1.8.9 0 1.4.5 1.4 1.5v5.2c0 .3.2.5.5.5h1.9c.3 0 .5-.2.5-.5v-5.7c0-2.1-1.3-3.9-3.8-3.9zm-27.4 6c-2.9 2.5-7.2 4-11.8 4-4.9 0-9.2-1.7-12-4.5-.4-.4-.1-.8.4-.6 5 2.1 11.2 3.2 17.5 3.2 5.5 0 11.3-1 15.6-2.7.5-.2.7.3.3.6zm.9 1c-.3.3-1 .2-1.4-.2-.4-.3-.4-1-.1-1.3.3-.3.9-.2 1.3.2.4.4.5 1 .2 1.3z" />
      </svg>
    ),
  },
  {
    name: "Flipkart",
    logoColor: "text-blue-600",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    badgeText: "Super Saver",
    badgeColor: "bg-yellow-400 text-blue-950",
    svg: (
      <div className="flex items-center gap-1 select-none">
        <span className="font-black text-xl tracking-tight italic text-blue-600">flipkart</span>
        <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center font-black text-blue-600 text-[10px] shadow-sm transform rotate-6">F</div>
      </div>
    ),
  },
  {
    name: "Tata 1mg",
    logoColor: "text-orange-600",
    bgColor: "bg-orange-500/10 border-orange-500/20",
    badgeText: "Medicines",
    badgeColor: "bg-orange-500 text-white",
    svg: (
      <div className="flex items-center gap-1 select-none">
        <span className="font-extrabold text-lg text-slate-800 tracking-tight">TATA</span>
        <span className="font-black text-lg text-orange-600">1mg</span>
      </div>
    ),
  },
  {
    name: "Nykaa",
    logoColor: "text-rose-500",
    bgColor: "bg-rose-500/10 border-rose-500/20",
    badgeText: "Wellness",
    badgeColor: "bg-rose-500 text-white",
    svg: (
      <span className="font-black text-2xl tracking-tighter text-rose-500 italic uppercase select-none">Nykaa</span>
    ),
  },
];

export default function Marketplaces() {
  return (
    <section className="py-12 bg-white relative overflow-hidden border-t border-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Also Available On
          </h2>
          <div className="w-12 h-1 bg-emerald-600 mx-auto mt-2.5 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {marketplaces.map((market, idx) => (
            <motion.div
              key={market.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={`relative border rounded-2xl p-5 flex flex-col items-center justify-center h-24 ${market.bgColor} hover:shadow-md hover:scale-102 transition-all duration-300 group`}
            >
              {/* Floating Badge */}
              <span className={`absolute top-2 right-2 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${market.badgeColor} shadow-sm opacity-90 group-hover:scale-105 transition-transform`}>
                {market.badgeText}
              </span>
              
              {/* Logo wrapper */}
              <div className={`${market.logoColor} opacity-85 group-hover:opacity-100 transition-opacity`}>
                {market.svg}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
