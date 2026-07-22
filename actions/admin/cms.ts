"use server";

import { revalidatePath } from "next/cache";
import { CmsSection } from "@/models/CmsSection";
import connectDB from "@/lib/mongodb";

export async function getCmsSections() {
  try {
    await connectDB();
    const sections = await CmsSection.find()
      .sort({ order: 1 })
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(sections));

    return {
      success: true,
      data: serialized,
    };
  } catch (error) {
    console.error("Error fetching CMS sections:", error);
    return { success: false, error: "Failed to fetch CMS sections" };
  }
}

export async function updateCmsSectionOrder(id: string, order: number) {
  try {
    await connectDB();
    await CmsSection.findByIdAndUpdate(id, { order });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error("Error updating CMS section order:", error);
    return { success: false, error: "Failed to update order" };
  }
}

export async function toggleCmsSectionStatus(id: string, isActive: boolean) {
  try {
    await connectDB();
    await CmsSection.findByIdAndUpdate(id, { isActive });
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error("Error toggling CMS section status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function createCmsSection(data: any) {
  try {
    await connectDB();
    const newSection = new CmsSection(data);
    await newSection.save();
    revalidatePath("/admin/cms");
    return { success: true, data: newSection._id.toString() };
  } catch (error) {
    console.error("Error creating CMS section:", error);
    return { success: false, error: "Failed to create CMS section" };
  }
}

export async function deleteCmsSection(id: string) {
  try {
    await connectDB();
    await CmsSection.findByIdAndDelete(id);
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error("Error deleting CMS section:", error);
    return { success: false, error: "Failed to delete CMS section" };
  }
}

export async function bulkSaveCmsSections(sections: any[]) {
  try {
    await connectDB();
    // For simplicity, we just delete all and insert the new ones in order
    await CmsSection.deleteMany({});
    
    const sectionsToInsert = sections.map((s, index) => {
       const { id, _id, ...rest } = s; // remove frontend IDs
       return { ...rest, order: index };
    });

    await CmsSection.insertMany(sectionsToInsert);

    revalidatePath("/");
    revalidatePath("/admin/cms");
    return { success: true };
  } catch (error) {
    console.error("Error bulk saving CMS sections:", error);
    return { success: false, error: "Failed to save CMS sections" };
  }
}
