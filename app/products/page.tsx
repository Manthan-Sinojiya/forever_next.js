import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductsGridClient from "@/components/products/ProductsGridClient";
import PageBanner from "@/components/ui/PageBanner";
import { getActiveBannerByPosition } from "@/actions/admin/banners";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse Forever Healthcare's complete range of Ayurvedic supplements, medical equipment, and wellness products. 100% genuine, export-quality products.",
};

export default async function ProductsPage() {
  await dbConnect();
  const rawProducts = await Product.find({ status: "active" }).populate("category").lean();
  
  const formattedProducts = rawProducts.map((p: any) => ({
    ...p,
    category: p.category ? p.category.name : undefined,
    imageUrl: p.thumbnail || (p.images && p.images.length > 0 ? p.images[0].url : "/logo/logo.png"),
  }));
  
  const products = JSON.parse(JSON.stringify(formattedProducts));

  const bannerRes = await getActiveBannerByPosition("products-overview");
  const banner = bannerRes?.data;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <PageBanner
            banner={banner}
            defaultTitle="Our Products Catalog"
            defaultSubtitle="Browse our complete range of Ayurvedic supplements and healthcare equipment."
            badge="All Products"
          />
        </div>

        {/* Catalog Section */}
        <section className="pb-16 pt-6 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductsGridClient initialProducts={products} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
