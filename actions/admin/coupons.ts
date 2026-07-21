"use server";

import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  await dbConnect();
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.parse(JSON.stringify(coupons)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(data: any) {
  await dbConnect();
  try {
    const newCoupon = await Coupon.create(data);
    revalidatePath("/admin/coupons");
    return { success: true, data: JSON.parse(JSON.stringify(newCoupon)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCoupon(id: string, data: any) {
  await dbConnect();
  try {
    await Coupon.findByIdAndUpdate(id, data);
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  await dbConnect();
  try {
    await Coupon.findByIdAndDelete(id);
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
