"use server";

import { revalidatePath } from "next/cache";
import { Category } from "@/models/Category";
import connectDB from "@/lib/mongodb";

export async function getCategories(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(categories));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id: string) {
  try {
    await connectDB();
    const category = await Category.findById(id).lean();
    if (!category) return { success: false, error: "Category not found" };

    const c = JSON.parse(JSON.stringify(category));

    return { success: true, data: c };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Failed to fetch category" };
  }
}

export async function createCategory(data: any) {
  try {
    await connectDB();
    const newCategory = new Category(data);
    await newCategory.save();
    revalidatePath("/admin/categories");
    return { success: true, data: newCategory._id.toString() };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Category.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/categories");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB();
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
