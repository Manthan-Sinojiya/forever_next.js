"use server";

import { revalidatePath } from "next/cache";
import { Setting } from "@/models/Setting";
import connectDB from "@/lib/mongodb";

export async function getSettings() {
  try {
    await connectDB();
    const settings = await Setting.findOne().lean();
    
    if (!settings) {
      return { success: true, data: null };
    }

    const s = JSON.parse(JSON.stringify(settings));

    return { success: true, data: s };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function updateSettings(data: any) {
  try {
    await connectDB();
    // Check if settings already exist
    const existing = await Setting.findOne();
    
    if (existing) {
      await Setting.findByIdAndUpdate(existing._id, data, { new: true });
    } else {
      const newSettings = new Setting(data);
      await newSettings.save();
    }
    
    revalidatePath("/admin/settings");
    revalidatePath("/"); // Also revalidate storefront
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
