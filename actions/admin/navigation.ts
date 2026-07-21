"use server";

import { revalidatePath } from "next/cache";
import { Menu } from "@/models/Menu";
import connectDB from "@/lib/mongodb";

export async function getMenus() {
  try {
    await connectDB();
    
    const total = await Menu.countDocuments();
    const menus = await Menu.find()
      .sort({ name: 1 })
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(menus));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: 1
    };
  } catch (error) {
    console.error("Error fetching menus:", error);
    return { success: false, error: "Failed to fetch menus" };
  }
}

export async function getMenuById(id: string) {
  try {
    await connectDB();
    const menu = await Menu.findById(id).lean();
    if (!menu) return { success: false, error: "Menu not found" };

    const m = JSON.parse(JSON.stringify(menu));
    if (m.links) {
      m.links = m.links.map((link: any) => ({
        ...link,
        _id: link._id ? link._id.toString() : undefined
      }));
    }

    return { success: true, data: m };
  } catch (error) {
    console.error("Error fetching menu:", error);
    return { success: false, error: "Failed to fetch menu" };
  }
}

export async function createMenu(data: any) {
  try {
    await connectDB();
    const newMenu = new Menu(data);
    await newMenu.save();
    revalidatePath("/admin/navigation");
    return { success: true, data: newMenu._id.toString() };
  } catch (error) {
    console.error("Error creating menu:", error);
    return { success: false, error: "Failed to create menu" };
  }
}

export async function updateMenu(id: string, data: any) {
  try {
    await connectDB();
    const updated = await Menu.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/navigation");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating menu:", error);
    return { success: false, error: "Failed to update menu" };
  }
}

export async function deleteMenu(id: string) {
  try {
    await connectDB();
    await Menu.findByIdAndDelete(id);
    revalidatePath("/admin/navigation");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu:", error);
    return { success: false, error: "Failed to delete menu" };
  }
}
