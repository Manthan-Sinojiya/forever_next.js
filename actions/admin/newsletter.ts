"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function getSubscribers() {
  await dbConnect();
  const subscribers = await Newsletter.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(subscribers));
}

export async function deleteSubscriber(id: string) {
  try {
    await dbConnect();
    await Newsletter.findByIdAndDelete(id);
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
