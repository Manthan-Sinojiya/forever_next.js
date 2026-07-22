import dbConnect from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import mongoose from "mongoose";

interface GetProductsOptions {
  fetchAll?: boolean;
  todayDeal?: boolean;
  featured?: boolean;
  category?: string;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}) {
  await dbConnect();
  
  const query: any = {};
  if (options.todayDeal !== undefined) query.todayDeal = options.todayDeal;
  if (options.featured !== undefined) query.isFeatured = options.featured;
  if (options.category !== undefined) query.category = options.category;
  
  if (options.fetchAll) {
    return await Product.find(query).sort({ createdAt: -1 });
  }
  
  if (Object.keys(query).length === 0) {
    return await Product.find({ isFeatured: true }).limit(options.limit || 6);
  }
  
  let result = Product.find(query).sort({ createdAt: -1 });
  if (options.limit) {
    result = result.limit(options.limit);
  }
  return await result;
}

export async function getProductById(id: string) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  return await Product.findById(id);
}

export async function createProduct(data: Partial<IProduct>) {
  await dbConnect();
  return await Product.create(data);
}

export async function updateProduct(id: string, data: Partial<IProduct>) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProduct(id: string) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }
  return await Product.findByIdAndDelete(id);
}
