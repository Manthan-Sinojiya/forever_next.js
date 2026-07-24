"use server";

import { revalidatePath } from "next/cache";
import { CustomPage } from "@/models/CustomPage";
import connectDB from "@/lib/mongodb";

export async function getCustomPages(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    
    const total = await CustomPage.countDocuments(query);
    const pages = await CustomPage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(pages));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching custom pages:", error);
    return { success: false, error: "Failed to fetch custom pages" };
  }
}

export async function getCustomPageById(id: string) {
  try {
    await connectDB();
    const customPage = await CustomPage.findById(id).lean();
    if (!customPage) return { success: false, error: "Custom page not found" };

    const p = JSON.parse(JSON.stringify(customPage));

    return { success: true, data: p };
  } catch (error) {
    console.error("Error fetching custom page:", error);
    return { success: false, error: "Failed to fetch custom page" };
  }
}

export async function createCustomPage(data: any) {
  try {
    await connectDB();
    const newPage = new CustomPage(data);
    await newPage.save();
    revalidatePath("/admin/custompages");
    return { success: true, data: newPage._id.toString() };
  } catch (error) {
    console.error("Error creating custom page:", error);
    return { success: false, error: "Failed to create custom page" };
  }
}

export async function updateCustomPage(id: string, data: any) {
  try {
    await connectDB();
    const updated = await CustomPage.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    revalidatePath("/admin/custompages");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating custom page:", error);
    return { success: false, error: "Failed to update custom page" };
  }
}

export async function deleteCustomPage(id: string) {
  try {
    await connectDB();
    await CustomPage.findByIdAndDelete(id);
    revalidatePath("/admin/custompages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting custom page:", error);
    return { success: false, error: "Failed to delete custom page" };
  }
}
