"use server";

import dbConnect from "@/lib/mongodb";
import { Product } from "@/models/Product";
import User from "@/models/User";
// import Order from "@/models/Order"; // Assuming Order model will be created later

export async function getDashboardMetrics() {
  try {
    await dbConnect();

    // Mock calculations or simple counts for now
    const activeProductsCount = await Product.countDocuments({ status: "active" });
    const totalCustomersCount = await User.countDocuments({ role: { $ne: "admin" } });
    
    // We mock orders and revenue since the Order model is not defined in this scope yet
    // In a real scenario, this would aggregate over the Order collection
    const totalRevenue = 125430.50; // Mocked
    const totalOrders = 845; // Mocked

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
    // await dbConnect();
    // In a real app:
    // const orders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").lean();
    // return JSON.parse(JSON.stringify(orders));
    
    // Mocking 5 recent orders for the UI
    return [
      { id: "ORD-001", customer: "John Doe", total: 125.0, status: "completed", date: new Date().toISOString() },
      { id: "ORD-002", customer: "Jane Smith", total: 45.0, status: "processing", date: new Date().toISOString() },
      { id: "ORD-003", customer: "Alice Johnson", total: 299.99, status: "shipped", date: new Date().toISOString() },
      { id: "ORD-004", customer: "Bob Williams", total: 89.5, status: "pending", date: new Date().toISOString() },
      { id: "ORD-005", customer: "Emma Davis", total: 12.0, status: "completed", date: new Date().toISOString() },
    ];
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
}
