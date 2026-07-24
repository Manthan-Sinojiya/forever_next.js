import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse Forever Healthcare's complete range of Ayurvedic supplements, medical equipment, and wellness products. 100% genuine, export-quality products.",
};

export default async function ProductsPage() {
  await dbConnect();
  const rawProducts = await Product.find({}).populate("category").lean();
  
  // Format the products so the category is just a string (the category name), as expected by ProductCard
  const formattedProducts = rawProducts.map((p: any) => ({
    ...p,
    category: p.category ? p.category.name : undefined,
  }));
  
  // Serialize Mongo documents so they are safe to pass to client component
  const products = JSON.parse(JSON.stringify(formattedProducts));

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full min-h-screen bg-slate-50">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-[#EAF8F2] via-[#EEF4FB] to-[#F8FAFC] pt-12 lg:pt-16 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#1E5AA8_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-3">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="text-muted text-lg max-w-xl">
              Browse our complete range of Ayurvedic supplements and healthcare equipment.
            </p>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="pb-16 pt-8 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductsGridClient initialProducts={products} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
