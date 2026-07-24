import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductDetailsClient from "./ProductDetailsClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  try {
    const product = await Product.findById(id);
    if (product) {
      return {
        title: product.metaTitle || `${product.name} - Forever Healthcare`,
        description: product.metaDescription || product.shortDescription || product.description?.replace(/<[^>]+>/g, '')?.substring(0, 155) || "Premium health and wellness product.",
        keywords: product.metaKeywords,
      };
    }
  } catch {
    // Silently fall back
  }
  return {
    title: "Product Details - Forever Healthcare",
    description: "Premium healthcare products from Forever Healthcare India.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  let product = null;
  try {
    const doc = await Product.findById(id).populate("category");
    if (doc) {
      const rawProduct = JSON.parse(JSON.stringify(doc));
      const sizes = rawProduct.variants 
        ? rawProduct.variants.filter((v: any) => v.attribute && v.attribute.toLowerCase() === "size").map((v: any) => ({
            name: v.value,
            price: v.price || rawProduct.price,
            originalPrice: rawProduct.mrp || undefined
          }))
        : [];
      
      product = {
        ...rawProduct,
        category: rawProduct.category?.name || rawProduct.category || "General",
        // Prioritize thumbnail, then first gallery image, then fallback
        imageUrl: rawProduct.thumbnail || (rawProduct.images && rawProduct.images.length > 0 ? rawProduct.images[0].url : "/logo/logo.png"),
        rating: rawProduct.rating || 5,
        originalPrice: rawProduct.mrp || Math.round(rawProduct.price * 1.35),
        sizes: sizes.length > 0 ? sizes : undefined
      };
    }
  } catch (err) {
    console.error("Error loading product details:", err);
  }

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProductDetailsClient product={product} />
      <Footer />
    </>
  );
}
