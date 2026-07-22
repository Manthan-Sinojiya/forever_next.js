"use server";

import { revalidatePath } from "next/cache";
import { Order } from "@/models/Order";
import { User } from "@/models/User"; // Ensure it's registered
import connectDB from "@/lib/mongodb";

export async function getOrders(search?: string, page: number = 1, limit: number = 10) {
  try {
    await connectDB();
    const query = search ? { orderNumber: { $regex: search, $options: "i" } } : {};
    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({ path: "user", select: "name email", model: User })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    const serialized = JSON.parse(JSON.stringify(orders));

    return {
      success: true,
      data: serialized,
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(id: string, data: any) {
  try {
    await connectDB();
    
    // Check old status to see if it changed to shipping
    const oldOrder = await Order.findById(id).populate({ path: "user", select: "name email", model: User }).lean();
    
    const updated = await Order.findByIdAndUpdate(id, data, { new: true });
    
    if (oldOrder && oldOrder.orderStatus !== "shipping" && data.orderStatus === "shipping") {
       // Mock email sending
       console.log(`[EMAIL MOCK] Sending Shipping Email to ${oldOrder.user?.email || "unknown"} for Order #${oldOrder.orderNumber}`);
       console.log(`[EMAIL MOCK] Tracking Number: ${data.trackingNumber || "N/A"}, Partner: ${data.deliveryPartner || "N/A"}`);
    }

    revalidatePath("/admin/orders");
    return { success: true, data: updated?._id.toString() };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(id: string) {
  try {
    await connectDB();
    await Order.findByIdAndDelete(id);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function getOrderById(id: string) {
  try {
    await connectDB();
    const order = await Order.findById(id).populate({ path: "user", select: "name email", model: User }).lean();
    if (!order) return { success: false, error: "Order not found" };
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, error: "Failed to fetch order" };
  }
}
