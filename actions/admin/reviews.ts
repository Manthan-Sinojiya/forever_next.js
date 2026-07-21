"use server";

import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  await dbConnect();
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(reviews)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReviewStatus(id: string, status: string) {
  await dbConnect();
  try {
    await Review.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  await dbConnect();
  try {
    await Review.findByIdAndDelete(id);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
