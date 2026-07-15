import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${categoryName} Products`,
    description: `Browse our premium selection of ${categoryName.toLowerCase()} products at Forever Healthcare.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  await dbConnect();

  const formattedCategory = resolvedParams.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Fetch all products to allow full sidebar categories and seamless filtering
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
              Category: <span className="gradient-text">{formattedCategory}</span>
            </h1>
            <p className="text-muted text-lg max-w-xl">
              Browse our premium selection of {formattedCategory.toLowerCase()} to support your health journey.
            </p>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="pb-16 pt-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductsGridClient initialProducts={products} presetCategory={formattedCategory} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
