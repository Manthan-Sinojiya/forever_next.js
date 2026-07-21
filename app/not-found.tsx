"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const QUICK_LINKS = [
  { href: "/shop", icon: ShoppingBag, label: "Browse Products" },
  { href: "/categories", icon: Search, label: "All Categories" },
  { href: "/offers", icon: Search, label: "Today's Offers" },
  { href: "/contact", icon: Home, label: "Contact Us" },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#F8FAFC] flex items-center">
        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            {/* Animated 404 */}
            <div className="relative mb-8">
              <span className="text-[160px] font-black font-heading leading-none select-none"
                style={{ background: "linear-gradient(135deg, #1E5AA8, #43B97F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <span className="text-4xl">🌿</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-800 mb-3">
              Page Not Found
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
              Let&apos;s get you back on track.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-md">
                <Home className="w-4 h-4" />Go Home
              </Link>
              <button onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                <ArrowLeft className="w-4 h-4" />Go Back
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-xs font-bold text-slate-600 hover:text-emerald-700">
                  <link.icon className="w-5 h-5 text-emerald-500" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
