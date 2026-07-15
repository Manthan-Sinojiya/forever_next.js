"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] flex items-center justify-center min-h-[80vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-medical/5 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.015]" />

        <div className="text-center px-4 relative z-10 max-w-xl">
          <div className="relative z-10 pt-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100">
              <svg viewBox="0 0 60 60" className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="30" cy="30" r="26" />
                <path d="M30 18v14M30 38v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="text-8xl font-black font-heading gradient-text mb-4 select-none">404</div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted text-lg mb-8 max-w-sm mx-auto">
              Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
                <Home className="w-4 h-4" />
                Back to Homepage
              </Link>
              <Link href="/products" className="bg-white border border-gray-200 text-foreground px-6 py-3.5 rounded-full font-semibold text-sm hover:shadow-md transition-all inline-flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
