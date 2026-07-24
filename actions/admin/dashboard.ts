"use server";

import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import User from "@/models/User";
import { Order } from "@/models/Order";

export async function getDashboardMetrics() {
  try {
    await dbConnect();

    // Mock calculations or simple counts for now
    const activeProductsCount = await Product.countDocuments({ status: "active" });
    const totalCustomersCount = await User.countDocuments({ role: { $ne: "admin" } });
    
    // Aggregate Revenue and Orders
    const orders = await Order.find({ paymentStatus: "paid" });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      totalRevenue,
      totalOrders,
      activeProductsCount,
      totalCustomersCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error("Failed to fetch dashboard metrics");
  }
}

export async function getRecentOrders() {
  try {
    await dbConnect();
    
    // Fetch top 5 recent orders
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
      
    return orders.map((order: any) => ({
      id: order.orderNumber,
      customer: order.shippingAddress?.fullName || order.userEmail || "Guest",
      total: order.totalAmount || 0,
      status: order.orderStatus,
      date: order.createdAt
    }));
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
}
