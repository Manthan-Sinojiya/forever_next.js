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
        title: `${product.name} - Forever Healthcare`,
        description: product.description || "Premium health and wellness product.",
      };
    }
  } catch {
    // Silently fall back
  }
  return {
    title: "Product Details - Forever Healthcare",
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
      product = {
        ...rawProduct,
        category: rawProduct.category?.name || rawProduct.category || "General",
        imageUrl: rawProduct.images && rawProduct.images.length > 0 ? rawProduct.images[0].url : "/products/missing-image-test.png",
        rating: rawProduct.rating || 5,
        originalPrice: rawProduct.originalPrice || rawProduct.mrp || Math.round(rawProduct.price * 1.35)
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
