"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="min-h-[75vh] bg-[#F8FAFC] flex items-center">
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error Icon */}
            <div className="relative mb-8 inline-block">
              <span
                className="text-[140px] font-black font-heading leading-none select-none"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #F97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                500
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold font-heading text-slate-800 mb-3">
              Something Went Wrong
            </h1>
            <p className="text-slate-500 mb-8 leading-relaxed max-w-md mx-auto">
              An unexpected error occurred. Our team has been notified.
              <br />
              Please try again or return to the homepage.
            </p>

            {process.env.NODE_ENV === "development" && error?.message && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-slate-700 rounded-full font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
