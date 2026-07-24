"use server";

import { revalidatePath } from "next/cache";
import { Banner } from "@/models/Banner";
import connectDB from "@/lib/mongodb";

export async function getBanners(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    
    const total = await Banner.countDocuments(query);
    const banners = await Banner.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(banners));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching banners:", error);
    return { success: false, error: "Failed to fetch banners" };
  }
}

export async function getBannerById(id: string) {
  try {
    await connectDB();
    const banner = await Banner.findById(id).lean();
    if (!banner) return { success: false, error: "Banner not found" };

    const b = JSON.parse(JSON.stringify(banner));

    return { success: true, data: b };
  } catch (error) {
    console.error("Error fetching banner:", error);
    return { success: false, error: "Failed to fetch banner" };
  }
}

export async function createBanner(data: any) {
  try {
    await connectDB();
    const newBanner = new Banner(data);
    await newBanner.save();
    revalidatePath("/admin/banners");
    return { success: true, data: newBanner._id.toString() };
  } catch (error) {
    console.error("Error creating banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

export async function updateBanner(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Banner.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    revalidatePath("/admin/banners");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

export async function deleteBanner(id: string) {
  try {
    await connectDB();
    await Banner.findByIdAndDelete(id);
    revalidatePath("/admin/banners");
    return { success: true };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}
