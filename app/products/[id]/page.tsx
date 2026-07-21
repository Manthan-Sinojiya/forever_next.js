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
    const doc = await Product.findById(id);
    if (doc) {
      product = JSON.parse(JSON.stringify(doc));
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
