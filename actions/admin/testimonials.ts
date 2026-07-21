"use server";

import { revalidatePath } from "next/cache";
import { Testimonial } from "@/models/Testimonial";
import connectDB from "@/lib/mongodb";

export async function getTestimonials(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { customerName: { $regex: search, $options: "i" } } : {};
    
    const total = await Testimonial.countDocuments(query);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(testimonials));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return { success: false, error: "Failed to fetch testimonials" };
  }
}

export async function toggleTestimonialApproval(id: string, status: string) {
  try {
    await connectDB();
    await Testimonial.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error toggling testimonial approval:", error);
    return { success: false, error: "Failed to toggle approval" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await connectDB();
    await Testimonial.findByIdAndDelete(id);
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}

export async function createTestimonial(data: any) {
  try {
    await connectDB();
    const newTestimonial = new Testimonial(data);
    await newTestimonial.save();
    revalidatePath("/admin/testimonials");
    return { success: true, data: newTestimonial };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Failed to create testimonial" };
  }
}
