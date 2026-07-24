"use server";

import { revalidatePath } from "next/cache";
import { Product } from "@/models/Product";
import connectDB from "@/lib/mongodb";

export async function getProducts(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    // Convert all ObjectIds and Dates to string for Client Components
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return {
      success: true,
      data: serializedProducts,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return { success: false, error: "Product not found" };

    const p = JSON.parse(JSON.stringify(product));

    return { success: true, data: p };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function createProduct(data: any) {
  try {
    await connectDB();
    const newProduct = new Product(data);
    await newProduct.save();
    revalidatePath("/admin/products");
    return { success: true, data: newProduct._id.toString() };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await connectDB();
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    revalidatePath("/admin/products");
    return { success: true, data: updatedProduct?._id.toString() };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
