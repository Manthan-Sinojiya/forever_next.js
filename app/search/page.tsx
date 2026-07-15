import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search for premium healthcare products at Forever Healthcare.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Next.js 15 requires awaiting searchParams
  const params = await searchParams;
  const query = params.q || "";

  await dbConnect();
  
  // Fetch all products to allow full sidebar categories, pricing sliders, and custom live search refinement
  const rawProducts = await Product.find({}).lean();
  const products = JSON.parse(JSON.stringify(rawProducts));

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full min-h-screen bg-slate-50">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-bold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Catalog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-3">
              Search <span className="gradient-text">Results</span>
            </h1>
            <p className="text-muted text-lg max-w-xl">
              Showing results matching <span className="font-bold text-emerald-605 text-emerald-600">&quot;{query}&quot;</span>
            </p>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="pb-16 pt-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductsGridClient initialProducts={products} presetQuery={query} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
