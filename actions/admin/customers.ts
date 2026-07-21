"use server";

import { revalidatePath } from "next/cache";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function getCustomers(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    
    // Using simple regex search on name or email
    const query: any = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
          ],
          role: "user" // Only get customers, not admins if we want to restrict
        } 
      : { role: "user" };
    
    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(customers));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Failed to fetch customers" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
