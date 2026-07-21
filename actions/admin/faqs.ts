"use server";

import { revalidatePath } from "next/cache";
import { Faq } from "@/models/Faq";
import connectDB from "@/lib/mongodb";

export async function getFaqs(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { question: { $regex: search, $options: "i" } } : {};
    
    const total = await Faq.countDocuments(query);
    const faqs = await Faq.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(faqs));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { success: false, error: "Failed to fetch FAQs" };
  }
}

export async function createFaq(data: any) {
  try {
    await connectDB();
    const newFaq = new Faq(data);
    await newFaq.save();
    revalidatePath("/admin/faqs");
    return { success: true, data: newFaq._id.toString() };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "Failed to create FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    await connectDB();
    await Faq.findByIdAndDelete(id);
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "Failed to delete FAQ" };
  }
}
