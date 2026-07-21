import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopClient from "./ShopClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Healthcare & Ayurveda Products | Forever Healthcare",
  description: "Browse 1000+ premium Ayurveda, nutrition, healthcare equipment and personal care products. Filter by category, price, rating and more.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string; brand?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const presetCategory = params.category || "";
  const presetQuery = params.q || params.brand || "";

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-[#F8FAFC] min-h-screen">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#1E5AA8] to-[#43B97F] text-white py-12 md:py-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3">
              {presetCategory ? presetCategory : "Shop All Products"}
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-sm">
              Discover our premium range of authentic Ayurvedic and healthcare products designed for your holistic well-being.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Suspense fallback={
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm">
                  <div className="aspect-square rounded-2xl mb-4 animate-pulse bg-slate-100" />
                  <div className="h-3 w-20 animate-pulse bg-slate-100 mb-2 rounded" />
                  <div className="h-4 w-full animate-pulse bg-slate-100 mb-2 rounded" />
                  <div className="h-9 w-full animate-pulse bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          }>
            <ShopClient presetCategory={presetCategory} presetQuery={presetQuery} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
