import React, { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopClient from "./ShopClient";
import PageBanner from "@/components/ui/PageBanner";
import { getActiveBannerByPosition } from "@/actions/admin/banners";
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

  const bannerRes = await getActiveBannerByPosition("products-overview");
  const banner = bannerRes?.data;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col w-full bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <PageBanner
            banner={banner}
            defaultTitle={presetCategory ? presetCategory : "Shop All Products"}
            defaultSubtitle="Discover our premium range of authentic Ayurvedic and healthcare products designed for your holistic well-being."
            badge="Products Store"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
