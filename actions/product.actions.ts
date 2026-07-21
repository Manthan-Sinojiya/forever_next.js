"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function getProducts({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    await dbConnect();
    const skip = (page - 1) * limit;

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(data: any) {
  try {
    await dbConnect();
    const newProduct = await Product.create(data);
    revalidatePath("/admin/products");
    return JSON.parse(JSON.stringify(newProduct));
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await dbConnect();
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    await dbConnect();
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
